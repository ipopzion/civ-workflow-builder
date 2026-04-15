import type { TaskType } from "~/taskLibrary"

export type TaskStatus = 'idle' | 'success' | 'warning' | 'error' | 'running'

export interface WorkflowTask {
  id: string
  type: TaskType
  status: TaskStatus
  inputs?: Record<string, string>
  outputs?: Record<string, string>
  position: { x: number; y: number }
}

export interface ExecutionEntry {
  timestamp: string
  level: 'LOG' | 'WARN' | 'ERROR'
  stage: string
  status: TaskStatus
  output: Record<string, string>
}