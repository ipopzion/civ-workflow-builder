import { create } from 'zustand'
import { WorkflowService, type ImportedWorkflow } from '~/services/workflowPersistenceService'
import type { TaskType } from '~/taskLibrary'
import type { TaskStatus, WorkflowTask } from '~/types/workflow'

interface WorkflowStepsStore {
  tasks: WorkflowTask[]
  isImporting: boolean
  importError: string | null
  addTask: (type: TaskType) => void
  removeTask: (id: string) => void
  setTaskInput: (id: string, key: string, value: string) => void
  setTaskOutputs: (id: string, outputs: Record<string, string>) => void
  setTaskStatus: (id: string, status: TaskStatus) => void
  exportWorkflow: () => void
  importWorkflow: (file: File) => Promise<void>
  clearWorkflow: () => void
  clearImportError: () => void
}

export const useWorkflowStepsStore = create<WorkflowStepsStore>((set) => ({
  tasks: [],
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