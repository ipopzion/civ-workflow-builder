import { useWorkflowStepsStore } from '~/store/workflowStepsStore'
import { WorkflowImportButton } from './WorkflowImportButton'

export default function BuilderPageHeader() {
  return (<header className="bg-white border-b border-gray-200 px-6 py-4">
    <div className="flex items-center justify-between">
      <h1 className="text-xl font-semibold text-gray-900">Workflow Builder</h1>
      <div className="flex items-center gap-3">
        <button
          onClick={() => {
            if (confirm('Are you sure you want to create a new workflow? All unsaved changes will be lost.')) {
              useWorkflowStepsStore.getState().clearWorkflow()
            }
          }}
          className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 bg-transparent hover:bg-gray-100 rounded-md transition-colors"
        >
          New Workflow
        </button>
        <WorkflowImportButton />
      </div>
    </div>
  </header>)
}