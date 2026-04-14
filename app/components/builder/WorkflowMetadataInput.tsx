import { useState } from "react"

export default function WorkflowMetadataInput() {
  const [workflowName, setWorkflowName] = useState('Untitled Workflow')
  const [maxRetries, setMaxRetries] = useState(3)
  const [visibility, setVisibility] = useState<'private' | 'team' | 'public'>('private')
  const [description, setDescription] = useState('')
  const [timeout, setTimeout] = useState(300)

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium text-gray-400 uppercase tracking-widest">
          Workflow Info
        </p>
      </div>

      {/* Workflow Name */}
      <div className="flex flex-col gap-1">
        <label className="text-xs text-gray-500 font-medium">Name</label>
        <input
          type="text"
          value={workflowName}
          onChange={(e) => setWorkflowName(e.target.value)}
          className="text-sm border border-gray-200 rounded-md px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-400 focus:border-blue-400"
          placeholder="Workflow name"
        />
      </div>

      {/* Description */}
      <div className="flex flex-col gap-1">
        <label className="text-xs text-gray-500 font-medium">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={2}
          className="text-sm border border-gray-200 rounded-md px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-400 focus:border-blue-400 resize-none"
          placeholder="Optional description..."
        />
      </div>

      {/* Max Retries */}
      <div className="flex flex-col gap-1">
        <label className="text-xs text-gray-500 font-medium">Max Retries</label>
        <div className="flex items-center gap-2">
          <input
            type="number"
            min="0"
            max="10"
            value={maxRetries}
            onChange={(e) => setMaxRetries(Math.min(10, Math.max(0, parseInt(e.target.value) || 0)))}
            className="w-20 text-sm border border-gray-200 rounded-md px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-400 focus:border-blue-400"
          />
          <span className="text-xs text-gray-400">attempts</span>
        </div>
      </div>

      {/* Timeout */}
      <div className="flex flex-col gap-1">
        <label className="text-xs text-gray-500 font-medium">Timeout</label>
        <div className="flex items-center gap-2">
          <input
            type="number"
            min="10"
            max="3600"
            step="10"
            value={timeout}
            onChange={(e) => setTimeout(Math.min(3600, Math.max(10, parseInt(e.target.value) || 10)))}
            className="w-24 text-sm border border-gray-200 rounded-md px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-400 focus:border-blue-400"
          />
          <span className="text-xs text-gray-400">seconds</span>
        </div>
      </div>

      {/* Visibility */}
      <div className="flex flex-col gap-1">
        <label className="text-xs text-gray-500 font-medium">Visibility</label>
        <select
          value={visibility}
          onChange={(e) => setVisibility(e.target.value as typeof visibility)}
          className="text-sm border border-gray-200 rounded-md px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-400 focus:border-blue-400 bg-white"
        >
          <option value="private">🔒 Private - Only me</option>
          <option value="team">👥 Team - My team members</option>
          <option value="public">🌐 Public - Everyone</option>
        </select>
      </div>
    </div>
  )
}