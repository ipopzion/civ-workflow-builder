import { Toolkit } from "~/components/builder/Toolkit";

export default function BuilderPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <h1 className="text-xl font-semibold text-gray-900">Workflow Builder</h1>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <Toolkit />
        <main className="flex-1 bg-gray-50 flex items-center justify-center">
          <p className="text-sm text-gray-400 font-mono">Canvas coming soon</p>
        </main>
      </div>
    </div>
  )
}