import React, { useRef } from 'react'
import { useWorkflowStepsStore } from '~/store/workflowStepsStore'
import { WorkflowService } from '~/services/workflowPersistenceService'

export const WorkflowImportButton: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const { importWorkflow, isImporting, importError, clearImportError } = useWorkflowStepsStore()

  const handleImportClick = () => {
    if (!fileInputRef.current) {
      const input = WorkflowService.createFileInput(async (file) => {
        await importWorkflow(file)
        if (fileInputRef.current) {
          fileInputRef.current.value = '' // Reset file input
        }
      })
      fileInputRef.current = input
      document.body.appendChild(input)
      input.click()
      document.body.removeChild(input)
    } else {
      fileInputRef.current.click()
    }
  }

  return (
    <div>
      <button
        onClick={handleImportClick}
        disabled={isImporting}
        className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 bg-transparent hover:bg-gray-100 rounded-md transition-colors disabled:opacity-50"
      >
        {isImporting ? 'Importing...' : 'Import Workflow'}
      </button>

      {importError && (
        <div className="mt-2 text-red-600 text-sm">
          Error: {importError}
          <button
            onClick={clearImportError}
            className="ml-2 text-gray-500 hover:text-gray-700"
          >
            Dismiss
          </button>
        </div>
      )}
    </div>
  )
}