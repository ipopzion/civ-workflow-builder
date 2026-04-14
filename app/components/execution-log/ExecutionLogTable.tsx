
import { useExecutionHistoryStore } from '../../store/executionHistoryStore'

export default function ExecutionLogTable() {
  const { runs } = useExecutionHistoryStore()

  return (
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50">
        <tr>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Run ID
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Workflow Name
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Actor
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Timestamp
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Status
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Steps
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Duration
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Actions
          </th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {(runs == null || runs.length === 0) ? (
          <tr>
            <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
              No workflow executions found. Run a workflow to see it here.
            </td>
          </tr>
        ) : (
          runs.map((run) => (
            <tr key={run.id} className="hover:bg-gray-50 transition-colors">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">
                {run.id.slice(0, 8)}...
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">
                {run.workflowName?.length > 30 ? run.workflowName.slice(0, 30) + '...' : run.workflowName}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">
                {run.actor}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                {run.displayTime}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(run.status)}`}>
                  {run.status.toUpperCase()}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                {run.successfulSteps} / {run.totalSteps}
                {run.failedSteps > 0 && (
                  <span className="text-red-600 ml-1">
                    ({run.failedSteps} failed)
                  </span>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                {formatDuration(run.duration)}
              </td>
              {/* <td className="px-6 py-4 whitespace-nowrap text-sm">
                <a
                  href={`/execution-log/${run.id}`}
                  className="text-indigo-600 hover:text-indigo-900 font-medium"
                >
                  View Details →
                </a>
              </td> */}
            </tr>
          ))
        )}
      </tbody>
    </table>
  )
}

function formatDuration(ms: number): string {
  if (ms < 1000) return `${ms}ms`
  const seconds = (ms / 1000).toFixed(2)
  return `${seconds}s`
}

function getStatusColor(status: string): string {
  switch (status) {
    case 'success':
      return 'text-green-600 bg-green-50'
    case 'failed':
      return 'text-red-600 bg-red-50'
    case 'partial':
      return 'text-yellow-600 bg-yellow-50'
    default:
      return 'text-gray-600 bg-gray-50'
  }
}
