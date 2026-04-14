import { create } from 'zustand'
import type { TaskType, WorkflowTask } from '~/types/workflow'

interface WorkflowStepsStore {
  tasks: WorkflowTask[]
  addTask: (type: TaskType) => void
  removeTask: (id: string) => void
}

export const useWorkflowStepsStore = create<WorkflowStepsStore>((set) => ({
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