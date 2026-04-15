import { useState } from "react"
import type { FieldSchema } from "~/taskLibrary/types"

interface FieldInputProps {
  field: FieldSchema
  value: string
  disabled: boolean
  onChange: (value: string) => void
}

export function InputField({ field, value, disabled = false, onChange }: FieldInputProps) {
  const [fileName, setFileName] = useState('')
  const className = `w-full text-xs border border-gray-200 rounded-lg px-2 py-1.5 text-gray-700 font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${disabled ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white'}`

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setFileName(file.name)
    const reader = new FileReader()
    reader.onload = async (event) => {
      const content = event.target?.result

      // Create file info object as JSON string
      const fileData = {
        name: file.name,
        size: file.size,
        type: file.type,
        content: content,
      }

      // Pass as JSON string to maintain compatibility with existing string-based value
      onChange(JSON.stringify(fileData))
    }

    reader.onerror = () => {
      onChange(JSON.stringify({ error: 'Failed to read file' }))
    }

    // Read as text for all file types
    reader.readAsText(file)
  }

  if (field.type === 'file') {
    return (
      <div className="space-y-1">
        <input
          type="file"
          onChange={handleFileUpload}
          disabled={disabled}
          onClick={(e) => e.stopPropagation()}
          className={`
            w-full text-xs rounded-lg px-2 py-1.5
            border border-gray-200
            ${disabled ? 'bg-gray-100 text-gray-400' : 'bg-white hover:border-gray-300'}
            file:mr-2 file:py-1 file:px-2 file:rounded-md
            file:text-xs file:font-medium
            file:border-0 file:bg-indigo-50 file:text-indigo-700
            hover:file:bg-indigo-100
            cursor-pointer
            focus:outline-none focus:ring-2 focus:ring-indigo-500
          `}
        />
        {fileName && !disabled && (
          <div className="text-xs text-green-600 flex items-center gap-1">
            <span>✓</span>
            <span className="truncate">{fileName}</span>
          </div>
        )}
        {value && !disabled && !fileName && (
          <div className="text-xs text-gray-500">
            {(() => {
              try {
                const fileData = JSON.parse(value)
                if (fileData.name) {
                  return <span>📎 {fileData.name}</span>
                }
              } catch (e) {
                return null
              }
              return null
            })()}
          </div>
        )}
      </div>
    )
  }

  if (field.type === 'select') {
    return (
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onClick={(e) => e.stopPropagation()}
        className={className}
      >
        <option value="">Select...</option>
        {field.options?.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    )
  }

  return (
    <input
      type={field.type === 'number' ? 'number' : 'text'}
      placeholder={field.placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onClick={(e) => e.stopPropagation()}
      className={className}
      disabled={disabled}
    />
  )
}