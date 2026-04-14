import { create } from 'zustand'
import type { TaskType, WorkflowTask } from '~/types/workflow'

interface WorkflowStore {
  tasks: WorkflowTask[]
  addTask: (type: TaskType) => void
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