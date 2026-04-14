import { Link, useParams } from "react-router";
import { useExecutionHistoryStore } from '../store/executionHistoryStore'

export default function ExecutionDetailPage() {
  const { id } = useParams()
  const run = useExecutionHistoryStore((state) => state.getRun(id))

  if (!run) {
    return (
      <div className="p-6">
        <div className="mb-6">
          <Link to="/execution-log" className="text-indigo-600 hover:text-indigo-900">
            ← Back to Execution Log
          </Link>
        </div>
        <div className="text-center py-12">
          <p className="text-gray-500">Execution run not found</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-4xl mx-auto bg-gray-50 min-h-screen">
      <div className="mb-6">
        <Link to="/execution-log" className="text-indigo-600 hover:text-indigo-900">
          ← Back to Execution Log
        </Link>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h1 className="text-2xl font-semibold text-gray-900 mb-4">
          Execution Details
        </h1>

        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-gray-500">Run ID</h3>
            <p className="text-sm font-mono text-gray-900">{run.id}</p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500">Timestamp</h3>
            <p className="text-sm text-gray-900">{run.displayTime}</p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500">Status</h3>
            <p className="text-sm text-gray-900">{run.status.toUpperCase()}</p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500">Duration</h3>
            <p className="text-sm text-gray-900">{run.duration}ms</p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500">Steps</h3>
            <p className="text-sm text-gray-900">
              {run.successfulSteps} successful, {run.failedSteps} failed out of {run.totalSteps} total
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}