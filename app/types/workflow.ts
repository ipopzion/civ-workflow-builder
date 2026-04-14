import type { TaskType } from "~/taskTypes"

export type TaskStatus = 'idle' | 'success' | 'warning' | 'error'

export interface WorkflowTask {
  id: string
  type: TaskType
  status: TaskStatus
  inputs?: Record<string, string>
  outputs?: Record<string, string>
}

export interface ExecutionEntry {
  timestamp: string
  level: 'LOG' | 'WARN' | 'ERROR'
  stage: string
  status: TaskStatus
  output: Record<string, string>
}