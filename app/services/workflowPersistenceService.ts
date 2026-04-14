import type { TaskType } from '~/taskLibrary'
import type { WorkflowTask } from '~/types/workflow'

export interface ExportedWorkflow {
  version: string
  exportedAt: string
  tasks: ExportedWorkflowTask[]
}

export interface ExportedWorkflowTask {
  id: string
  type: TaskType
  inputs: Record<string, string>
}

export interface ImportedWorkflow {
  tasks: WorkflowTask[]
}

export class WorkflowService {
  static exportWorkflow(tasks: WorkflowTask[]): void {
    const workflowData: ExportedWorkflow = {
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

  static async importWorkflow(file: File): Promise<ImportedWorkflow> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()

      reader.onload = (event) => {
        try {
          const content = event.target?.result as string
          const exportedWorkflow: ExportedWorkflow = JSON.parse(content)

          // Validate the imported workflow structure
          if (!this.validateWorkflow(exportedWorkflow)) {
            reject(new Error('Invalid workflow file format'))
            return
          }

          // Convert exported tasks to WorkflowTask format
          const tasks: WorkflowTask[] = exportedWorkflow.tasks.map(task => ({
            id: task.id,
            type: task.type,
            status: 'idle', // Reset status for imported tasks
            inputs: task.inputs || {},
            outputs: {} // Initialize empty outputs
          }))

          resolve({ tasks })
        } catch (error) {
          reject(new Error('Failed to parse workflow file'))
        }
      }

      reader.onerror = () => {
        reject(new Error('Failed to read file'))
      }

      reader.readAsText(file)
    })
  }

  private static validateWorkflow(workflow: any): workflow is ExportedWorkflow {
    return (
      workflow &&
      typeof workflow === 'object' &&
      typeof workflow.version === 'string' &&
      typeof workflow.exportedAt === 'string' &&
      Array.isArray(workflow.tasks) &&
      workflow.tasks.every((task: any) =>
        task &&
        typeof task.id === 'string' &&
        typeof task.type === 'string' &&
        typeof task.inputs === 'object'
      )
    )
  }

  static createFileInput(onFileSelected: (file: File) => void): HTMLInputElement {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'application/json'
    input.onchange = async (event) => {
      const file = (event.target as HTMLInputElement).files?.[0]
      if (file) {
        onFileSelected(file)
      }
    }
    return input
  }
}