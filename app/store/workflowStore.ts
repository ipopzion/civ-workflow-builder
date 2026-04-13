import { create } from 'zustand'

export interface WorkflowTask {
  id: string
  type: 'default'
  label: string
}

interface WorkflowStore {
  tasks: WorkflowTask[]
  addTask: (type: 'default') => void
  removeTask: (id: string) => void
}

export const useWorkflowStore = create<WorkflowStore>((set) => ({
  tasks: [],
  addTask: (type) =>
    set((state) => ({
      tasks: [
        ...state.tasks,
        { id: crypto.randomUUID(), type, label: 'Placeholder' },
      ],
    })),
  removeTask: (id) =>
    set((state) => ({
      tasks: state.tasks.filter((task) => task.id !== id),
    })),
}))