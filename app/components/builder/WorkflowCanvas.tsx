import { useWorkflowStore } from "~/store/workflowStore"

export default function WorkflowCanvas() {
  const { tasks } = useWorkflowStore()

  return (
    <div className="flex-1 bg-gray-50 flex items-center justify-center">
      <p className="text-sm text-gray-400 font-mono">{tasks.length} tasks</p>
    </div>
  )
}