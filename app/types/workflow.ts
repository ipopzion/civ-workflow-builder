export type TaskType = 'log' | 'email' | 'calculation'

export type TaskStatus = 'idle' | 'success' | 'warning' | 'error'

export interface WorkflowTask {
  id: string
  type: TaskType
  status: TaskStatus
}

export const TASK_TYPES: Record<TaskType, {
  icon: string
  accent: string
  label: string
  description: string
}> = {
  log: {
    icon: '📝',
    accent: '#e6e93e',
    label: 'Log Message',
    description: 'Prints a message to the execution log.',
  },
  email: {
    icon: '✉️',
    accent: '#3b82f6',
    label: 'Send Email',
    description: 'Sends an email to the specified recipient.',
  },
  calculation: {
    icon: '🔢',
    accent: '#10b981',
    label: 'Calculate',
    description: 'Executes a mathematical calculation.',
  },
}

export interface ExecutionEntry {
  timestamp: string
  level: 'LOG' | 'ERROR'
  stage: string
  output: string
}