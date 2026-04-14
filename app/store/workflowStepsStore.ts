import { create } from 'zustand'
import { WorkflowService, type ImportedWorkflow } from '~/services/workflowPersistenceService'
import type { TaskType } from '~/taskLibrary'
import type { TaskStatus, WorkflowTask } from '~/types/workflow'

interface WorkflowMetadata {
  name: string
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
  updateMetadata: (data: Partial<WorkflowMetadata>) => void
  exportWorkflow: () => void
  importWorkflow: (file: File) => Promise<void>
  clearWorkflow: () => void
  clearImportError: () => void
}

const defaultMetadata: WorkflowMetadata = {
  name: 'Untitled Workflow',
  description: '',
  maxRetries: 3,
  visibility: 'private',
  timeout: 300,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
}

export const useWorkflowStepsStore = create<WorkflowStepsStore>((set) => ({
  tasks: [],
  metadata: defaultMetadata,
  isImporting: false,
  importError: null,

  addTask: (type) =>
    set((state) => ({
      tasks: [
        ...state.tasks,
        { id: crypto.randomUUID(), type, status: 'idle' },
      ],
    })),

  removeTask: (id) =>
    set((state) => ({
      tasks: state.tasks.filter((task) => task.id !== id),
    })),

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
    const { tasks } = useWorkflowStepsStore.getState()
    WorkflowService.exportWorkflow(tasks)
  },

  importWorkflow: async (file: File) => {
    set({ isImporting: true, importError: null })

    try {
      const imported: ImportedWorkflow = await WorkflowService.importWorkflow(file)
      set({ tasks: imported.tasks, isImporting: false })
    } catch (error) {
      set({
        importError: error instanceof Error ? error.message : 'Failed to import workflow',
        isImporting: false
      })
    }
  },

  clearWorkflow: () => set({ tasks: [] }),

  clearImportError: () => set({ importError: null })
}))