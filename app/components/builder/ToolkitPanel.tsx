import { TaskCreationButton } from './TaskCreationButton'
import { taskTypeRegistry, type TaskType } from '~/taskLibrary'

export default function ToolkitPanel() {
  const taskTypes = taskTypeRegistry

  return (
    <aside data-testid="toolkit-panel" className="w-56 bg-white flex flex-col shrink-0 border-r border-gray-100">
      <div className="px-4 py-5 border-b border-gray-100">
        <p className="text-xs font-medium text-gray-400 uppercase tracking-widest">
          Tasks
        </p>
      </div>

      <div className="px-3 py-4 flex flex-col gap-2">
        {Object.values(taskTypes).map((taskType) => (
          <TaskCreationButton key={taskType.type} type={taskType.type as TaskType} />
        ))}
      </div>
    </aside>
  )
}