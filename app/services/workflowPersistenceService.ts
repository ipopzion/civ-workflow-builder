import type { WorkflowMetadata } from '~/store/workflowStepsStore'
import type { TaskType } from '~/taskLibrary'
import type { WorkflowTask } from '~/types/workflow'
import type { Connection } from '~/store/workflowConnectionsStore'

export interface ExportedWorkflow {
  tasks: ExportedWorkflowTask[]
  connections: ExportedConnection[]
  metadata: WorkflowMetadata
  version: string // Added version for future compatibility
}

export interface ExportedWorkflowTask {
  id: string
  type: TaskType
  inputs: Record<string, string>
  position: { x: number; y: number } // Store position
}

export interface ExportedConnection {
  sourceTaskId: string
  sourceOutputKey: string
  targetTaskId: string
  targetInputKey: string
}

export interface ImportedWorkflow {
  tasks: WorkflowTask[]
  connections: Connection[]
  metadata: WorkflowMetadata
}

export class WorkflowService {
  static readonly CURRENT_VERSION = '1.1'

  static exportWorkflow(
    tasks: WorkflowTask[],
    metadata: WorkflowMetadata,
    connections: Connection[]
  ): void {
    const workflowData: ExportedWorkflow = {
      version: this.CURRENT_VERSION,
      metadata,
      tasks: tasks.map(task => ({
        id: task.id,
        type: task.type,
        inputs: task.inputs || {},
        position: task.position || { x: 0, y: 0 }, // Store position, default if missing
      })),
      connections: connections.map(conn => ({
        sourceTaskId: conn.sourceTaskId,
        sourceOutputKey: conn.sourceOutputKey,
        targetTaskId: conn.targetTaskId,
        targetInputKey: conn.targetInputKey,
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
          const exportedWorkflow: any = JSON.parse(content)

          // Validate the imported workflow structure
          if (!this.validateWorkflow(exportedWorkflow)) {
            reject(new Error('Invalid workflow file format'))
            return
          }

          // Convert exported tasks to WorkflowTask format
          const tasks: WorkflowTask[] = exportedWorkflow.tasks.map((task: ExportedWorkflowTask) => ({
            id: task.id,
            type: task.type,
            status: 'idle', // Reset status for imported tasks
            inputs: task.inputs || {},
            outputs: {}, // Initialize empty outputs
            position: task.position || { x: 0, y: 0 }, // Restore position
          }))

          // Convert exported connections to Connection format
          const connections: Connection[] = (exportedWorkflow.connections || []).map((conn: ExportedConnection) => ({
            id: crypto.randomUUID(), // Generate new IDs for imported connections
            sourceTaskId: conn.sourceTaskId,
            sourceOutputKey: conn.sourceOutputKey,
            targetTaskId: conn.targetTaskId,
            targetInputKey: conn.targetInputKey,
          }))

          resolve({ tasks, connections, metadata: exportedWorkflow.metadata })
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
    // Basic structure validation
    if (!workflow || typeof workflow !== 'object') return false

    // Version check - support older versions
    const version = workflow.version || '1.0'

    // Validate tasks
    if (!Array.isArray(workflow.tasks)) return false

    const tasksValid = workflow.tasks.every((task: any) => {
      const hasBasicProps = task &&
        typeof task.id === 'string' &&
        typeof task.type === 'string' &&
        typeof task.inputs === 'object'

      if (!hasBasicProps) return false

      // Position validation (optional for backward compatibility)
      if (task.position !== undefined) {
        return typeof task.position.x === 'number' && typeof task.position.y === 'number'
      }

      return true
    })

    if (!tasksValid) return false

    // Validate metadata
    const hasMetadata = workflow.metadata &&
      typeof workflow.metadata.name === 'string' &&
      typeof workflow.metadata.description === 'string' &&
      typeof workflow.metadata.maxRetries === 'number' &&
      ['private', 'team', 'public'].includes(workflow.metadata.visibility)

    if (!hasMetadata) return false

    // Validate connections (optional for backward compatibility with v1.0)
    if (version === '1.0') {
      // v1.0 files don't have connections, which is fine
      return true
    }

    // v1.1+ should have connections array
    if (workflow.connections !== undefined && !Array.isArray(workflow.connections)) {
      return false
    }

    // Validate connections structure if present
    if (workflow.connections) {
      const connectionsValid = workflow.connections.every((conn: any) =>
        conn &&
        typeof conn.sourceTaskId === 'string' &&
        typeof conn.sourceOutputKey === 'string' &&
        typeof conn.targetTaskId === 'string' &&
        typeof conn.targetInputKey === 'string'
      )
      if (!connectionsValid) return false
    }

    return true
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