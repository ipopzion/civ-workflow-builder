import { create } from 'zustand'
import { WorkflowService, type ImportedWorkflow } from '~/services/workflowPersistenceService'
import type { TaskType } from '~/taskLibrary'
import type { TaskStatus, WorkflowTask } from '~/types/workflow'
import { useConnectionStore } from './workflowConnectionsStore'

export interface WorkflowMetadata {
  name: string
  version: string
  description: string
  maxRetries: number
  visibility: 'private' | 'team' | 'public'
  timeout: number // seconds
  createdAt?: string
  updatedAt?: string
}

interface WorkflowStepsStore {
  tasks: WorkflowTask[]
  metadata: WorkflowMetadata
  isImporting: boolean
  importError: string | null
  addTask: (type: TaskType) => void
  removeTask: (id: string) => void
  setTaskInput: (id: string, key: string, value: string) => void
  setTaskOutputs: (id: string, outputs: Record<string, string>) => void
  setTaskStatus: (id: string, status: TaskStatus) => void
  setTaskPosition: (id: string, x: number, y: number) => void
  updateMetadata: (data: Partial<WorkflowMetadata>) => void
  exportWorkflow: () => void
  importWorkflow: (file: File) => Promise<void>
  clearWorkflow: () => void
  clearImportError: () => void
  // New methods for connected workflow execution
  getExecutionOrder: () => string[]
  getTaskInputsWithConnections: (taskId: string) => Record<string, any>
}

const defaultMetadata: WorkflowMetadata = {
  name: 'Untitled Workflow',
  version: '1.0',
  description: '',
  maxRetries: 3,
  visibility: 'private',
  timeout: 300,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
}

export const useWorkflowStepsStore = create<WorkflowStepsStore>((set, get) => ({
  tasks: [],
  metadata: defaultMetadata,
  isImporting: false,
  importError: null,

  addTask: (type) =>
    set((state) => ({
      tasks: [
        ...state.tasks,
        {
          id: crypto.randomUUID(), type, status: 'idle', position: {
            x: 40 + state.tasks.length * 220,
            y: 80,
          }
        },
      ],
    })),

  setTaskPosition: (id, x, y) =>
    set((state) => ({
      tasks: state.tasks.map((t) =>
        t.id === id ? { ...t, position: { x, y } } : t
      ),
    })),

  removeTask: (id) => {
    useConnectionStore.getState().removeConnectionsForTask(id)

    set((state) => ({
      tasks: state.tasks.filter((task) => task.id !== id),
    }))
  },

  setTaskInput: (id, key, value) =>
    set((state) => ({
      tasks: state.tasks.map((t) =>
        t.id === id ? { ...t, inputs: { ...t.inputs, [key]: value } } : t
      ),
    })),

  setTaskOutputs: (id, outputs) =>
    set((state) => ({
      tasks: state.tasks.map((t) =>
        t.id === id ? { ...t, outputs } : t
      ),
    })),

  setTaskStatus: (id, status) =>
    set((state) => ({
      tasks: state.tasks.map((t) => t.id === id ? { ...t, status } : t),
    })),

  updateMetadata: (updates) =>
    set((state) => ({
      metadata: {
        ...state.metadata,
        ...updates,
        updatedAt: new Date().toISOString(),
      },
    })),

  exportWorkflow: () => {
    const { tasks, metadata } = get()
    WorkflowService.exportWorkflow(tasks, metadata)
  },

  importWorkflow: async (file: File) => {
    set({ isImporting: true, importError: null })

    try {
      const imported: ImportedWorkflow = await WorkflowService.importWorkflow(file)
      set({ tasks: imported.tasks, metadata: imported.metadata, isImporting: false })
    } catch (error) {
      set({
        importError: error instanceof Error ? error.message : 'Failed to import workflow',
        isImporting: false
      })
    }
  },

  clearWorkflow: () => set({ tasks: [] }),

  clearImportError: () => set({ importError: null }),

  getExecutionOrder: () => {
    const { tasks } = get()
    const connections = useConnectionStore.getState().connections

    // Build dependency graph
    const dependencies = new Map<string, Set<string>>()
    const dependents = new Map<string, Set<string>>()

    // Initialize for all tasks
    tasks.forEach(task => {
      dependencies.set(task.id, new Set())
      dependents.set(task.id, new Set())
    })

    // Build graph from connections
    connections.forEach(conn => {
      // Target depends on source
      dependencies.get(conn.targetTaskId)?.add(conn.sourceTaskId)
      dependents.get(conn.sourceTaskId)?.add(conn.targetTaskId)
    })

    // Kahn's algorithm for topological sort
    const inDegree = new Map<string, number>()
    tasks.forEach(task => {
      inDegree.set(task.id, dependencies.get(task.id)?.size || 0)
    })

    const queue: string[] = []
    const order: string[] = []

    // Start with tasks that have no dependencies
    inDegree.forEach((degree, taskId) => {
      if (degree === 0) queue.push(taskId)
    })

    while (queue.length > 0) {
      const current = queue.shift()!
      order.push(current)

      // Reduce in-degree for dependent tasks
      dependents.get(current)?.forEach(dependent => {
        const newDegree = (inDegree.get(dependent) || 0) - 1
        inDegree.set(dependent, newDegree)
        if (newDegree === 0) {
          queue.push(dependent)
        }
      })
    }

    // If order doesn't include all tasks, there's a cycle
    // Return tasks in original order as fallback
    if (order.length !== tasks.length) {
      console.warn('Cycle detected in workflow connections, falling back to original order')
      return tasks.map(t => t.id)
    }

    return order
  },

  getTaskInputsWithConnections: (taskId: string) => {
    const { tasks } = get()
    const task = tasks.find(t => t.id === taskId)
    if (!task) return {}

    const connections = useConnectionStore.getState().connections
    const incomingConnections = connections.filter(c => c.targetTaskId === taskId)

    // Start with manually set inputs
    const resolvedInputs: Record<string, any> = { ...task.inputs }

    // Override with values from connected outputs
    incomingConnections.forEach(conn => {
      const sourceTask = tasks.find(t => t.id === conn.sourceTaskId)
      if (sourceTask?.outputs && conn.sourceOutputKey in sourceTask.outputs) {
        resolvedInputs[conn.targetInputKey] = sourceTask.outputs[conn.sourceOutputKey]
      }
    })

    return resolvedInputs
  }
}))