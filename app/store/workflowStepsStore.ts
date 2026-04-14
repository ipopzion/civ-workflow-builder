import { create } from 'zustand'
import type { TaskStatus, TaskType, WorkflowTask } from '~/types/workflow'

interface WorkflowStepsStore {
  tasks: WorkflowTask[]
  addTask: (type: TaskType) => void
  removeTask: (id: string) => void
  setTaskInput: (id: string, key: string, value: string) => void
  setTaskOutputs: (id: string, outputs: Record<string, string>) => void
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
}))