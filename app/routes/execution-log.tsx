import ExecutionLogTable from '~/components/execution-log/ExecutionLogTable'

export default function ExecutionLogPage() {
  return (
    <div className="min-h-screen p-6 max-w-7xl mx-auto bg-gray-50 ">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Execution Log</h1>
        <p className="text-sm text-gray-500 mt-1">
          History of all workflow executions
        </p>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <ExecutionLogTable />
        </div>
      </div>
    </div>
  )
}
