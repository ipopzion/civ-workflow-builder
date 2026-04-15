import type { FieldSchema } from "~/taskLibrary/types"

interface FieldInputProps {
  field: FieldSchema
  value: string
  disabled: boolean
  onChange: (value: string) => void
}

export function InputField({ field, value, disabled = false, onChange }: FieldInputProps) {
  const className = `w-full text-xs border border-gray-200 rounded-lg px-2 py-1.5 text-gray-700 font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${disabled ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white'}`

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