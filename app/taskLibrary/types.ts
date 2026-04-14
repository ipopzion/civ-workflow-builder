import type { WorkflowTask } from "~/types/workflow"

export type FieldType = 'text' | 'number' | 'select'

export interface FieldSchema {
  key: string
  label: string
  type: FieldType
  placeholder?: string
  options?: { label: string; value: string }[]
  required?: boolean
}

export interface TaskTypeDefinition {
  type: string
  label: string
  description: string
  icon: string
  inputFields: FieldSchema[]
  outputFields: FieldSchema[]
  execute: (task: WorkflowTask) => ExecutionResult | Promise<ExecutionResult>
}

export interface ExecutionResult {
  status: 'success' | 'warning' | 'error'
  output: Record<string, string>
}