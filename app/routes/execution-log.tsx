export default function ExecutionLogPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <h1 className="text-xl font-semibold text-gray-900">Execution Log</h1>
      </header>

      <main className="flex-1 flex items-center justify-center">
        <p className="text-gray-400 text-sm">Executed workflows will appear here.</p>
      </main>
    </div>
  )
}