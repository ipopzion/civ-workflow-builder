import { create } from 'zustand'
import type { TaskStatus, TaskType, WorkflowTask } from '~/types/workflow'

interface WorkflowStepsStore {
  tasks: WorkflowTask[]
  addTask: (type: TaskType) => void
  removeTask: (id: string) => void
  setTaskStatus: (id: string, status: TaskStatus) => void
}

export const useWorkflowStepsStore = create<WorkflowStepsStore>((set) => ({
  tasks: [],
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
  setTaskStatus: (id, status) =>
    set((state) => ({
      tasks: state.tasks.map((t) => t.id === id ? { ...t, status } : t),
    })),
}))