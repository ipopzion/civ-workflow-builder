import { calculationTask } from "./tasks/calculationTask"
import { emailTask } from "./tasks/emailTask"
import { fileInputTask } from "./tasks/fileInputTask"
import { formatStringTask } from "./tasks/formatTextTask"
import { logTask } from "./tasks/logTask"
import { lookupTask } from "./tasks/lookupTask"
import type { TaskTypeDefinition } from "./types"

export type TaskType = 'log' | 'email' | 'calculation' | 'fileInput' | 'lookup' | 'format'

export const taskTypeRegistry: Record<TaskType, TaskTypeDefinition> = {
  log: logTask,
  email: emailTask,
  calculation: calculationTask,
  fileInput: fileInputTask,
  lookup: lookupTask,
  format: formatStringTask,
}

export function getTaskType(type: TaskType): TaskTypeDefinition {
  const definition = taskTypeRegistry[type]
  if (!definition) throw new Error(`Unknown task type: "${type}"`)
  return definition
}
