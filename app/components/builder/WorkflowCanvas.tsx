import { useWorkflowStepsStore } from "~/store/workflowStepsStore"
import { TaskCard } from "./TaskCard"

export default function WorkflowCanvas() {
  const { tasks } = useWorkflowStepsStore()

  return (
    <div className="flex-1 bg-gray-50 flex flex-col items-center justify-center gap-6">
      <p className="text-sm text-gray-400 font-mono">{tasks.length} tasks</p>
      <div className="max-w-xl mx-auto flex flex-col gap-2">
        {tasks.map((task, i) => (
          <TaskCard key={task.id} task={task} index={i} />
        ))}
      </div>
    </div>
  )
}