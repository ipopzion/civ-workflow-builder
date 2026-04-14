import { useWorkflowStepsStore } from "~/store/workflowStepsStore"

export default function WorkflowMetadataInput() {
  const { metadata, updateMetadata } = useWorkflowStepsStore()

  const handleMetadataChange = (field: keyof typeof metadata, value: any) => {
    updateMetadata({ [field]: value })
  }

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
          value={metadata.name}
          onChange={(e) => handleMetadataChange('name', e.target.value)}
          className="w-full text-sm text-gray-900 bg-white border border-gray-200 rounded-md px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-400 focus:border-blue-400"
          placeholder="Workflow name"
        />
      </div>

      {/* Description */}
      <div className="flex flex-col gap-1">
        <label className="text-xs text-gray-500 font-medium">Description</label>
        <textarea
          value={metadata.description}
          onChange={(e) => handleMetadataChange('description', e.target.value)}
          rows={2}
          className="w-full text-sm text-gray-900 bg-white border border-gray-200 rounded-md px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-400 focus:border-blue-400 resize-none"
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
            value={metadata.maxRetries}
            onChange={(e) => handleMetadataChange('maxRetries', Math.min(10, Math.max(0, parseInt(e.target.value) || 0)))}
            className="w-20 text-sm text-gray-900 bg-white border border-gray-200 rounded-md px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-400 focus:border-blue-400"
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
            value={metadata.timeout}
            onChange={(e) => handleMetadataChange('timeout', Math.min(3600, Math.max(10, parseInt(e.target.value) || 10)))}
            className="w-24 text-sm text-gray-900 bg-white border border-gray-200 rounded-md px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-400 focus:border-blue-400"
          />
          <span className="text-xs text-gray-400">seconds</span>
        </div>
      </div>

      {/* Visibility */}
      <div className="flex flex-col gap-1">
        <label className="text-xs text-gray-500 font-medium">Visibility</label>
        <select
          value={metadata.visibility}
          onChange={(e) => handleMetadataChange('visibility', e.target.value as typeof metadata.visibility)}
          className="w-full text-sm text-gray-900 bg-white border border-gray-200 rounded-md px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-400 focus:border-blue-400"
        >
          <option value="private">🔒 Private - Only me</option>
          <option value="team">👥 Team - My team members</option>
          <option value="public">🌐 Public - Everyone</option>
        </select>
      </div>

      {/* Last updated info */}
      {metadata.updatedAt && (
        <div className="text-xs text-gray-400 mt-1">
          Last updated: {new Date(metadata.updatedAt).toLocaleString()}
        </div>
      )}
    </div>
  )
}