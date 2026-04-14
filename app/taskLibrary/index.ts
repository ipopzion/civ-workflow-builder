import { calculationTask } from "./tasks/calculationTask"
import { emailTask } from "./tasks/emailTask"
import { logTask } from "./tasks/logTask"
import type { TaskTypeDefinition } from "./types"

export type TaskType = 'log' | 'email' | 'calculation'

export const taskTypeRegistry: Record<TaskType, TaskTypeDefinition> = {
  log: logTask,
  email: emailTask,
  calculation: calculationTask,
}

export function getTaskType(type: TaskType): TaskTypeDefinition {
  const definition = taskTypeRegistry[type]
  if (!definition) throw new Error(`Unknown task type: "${type}"`)
  return definition
}
