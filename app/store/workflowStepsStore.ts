import { create } from 'zustand'
import type { TaskType } from '~/taskLibrary'
import type { TaskStatus, WorkflowTask } from '~/types/workflow'

interface WorkflowStepsStore {
  tasks: WorkflowTask[]
  addTask: (type: TaskType) => void
  removeTask: (id: string) => void
  setTaskInput: (id: string, key: string, value: string) => void
  setTaskOutputs: (id: string, outputs: Record<string, string>) => void
  setTaskStatus: (id: string, status: TaskStatus) => void
  exportWorkflow: () => void
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
  exportWorkflow: () => {
    const { tasks } = useWorkflowStepsStore.getState()
    const workflowData = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      tasks: tasks.map(task => ({
        id: task.id,
        type: task.type,
        inputs: task.inputs || {},
      }))
    }

    const jsonString = JSON.stringify(workflowData, null, 2)
    const blob = new Blob([jsonString], { type: 'application/json' })
    const url = URL.createObjectURL(blob)

    const a = document.createElement('a')
    a.href = url
    a.download = `workflow-${Date.now()}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }
}))