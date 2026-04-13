import { useWorkflowStore } from '../../store/workflowStore'

export default function Toolkit() {
  const { addTask } = useWorkflowStore()

  return (
    <aside className="w-56 bg-white flex flex-col shrink-0 border-r border-gray-100">
      <div className="px-4 py-5 border-b border-gray-100">
        <p className="text-xs font-medium text-gray-400 uppercase tracking-widest">
          Tasks
        </p>
      </div>

      <div className="px-3 py-4">
        <button
          onClick={() => addTask('default')}
          className="w-full px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-xl transition-colors"
        >
          + Add Task
        </button>
      </div>
    </aside>
  )
}