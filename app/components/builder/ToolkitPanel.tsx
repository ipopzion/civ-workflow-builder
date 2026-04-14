import { TASK_TYPES, type TaskType } from '~/types/workflow'
import { TaskCreationButton } from './TaskCreationButton'

export default function ToolkitPanel() {
  return (
    <aside className="w-56 bg-white flex flex-col shrink-0 border-r border-gray-100">
      <div className="px-4 py-5 border-b border-gray-100">
        <p className="text-xs font-medium text-gray-400 uppercase tracking-widest">
          Tasks
        </p>
      </div>

      <div className="px-3 py-4 flex flex-col gap-2">
        {(Object.keys(TASK_TYPES) as TaskType[]).map((type) => (
          <TaskCreationButton key={type} type={type} />
        ))}
      </div>
    </aside>
  )
}