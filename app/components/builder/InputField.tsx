import type { FieldSchema } from "~/taskLibrary/types"

interface FieldInputProps {
  field: FieldSchema
  value: string
  onChange: (value: string) => void
}

export function InputField({ field, value, onChange }: FieldInputProps) {
  const baseClass = "w-full text-xs border border-gray-200 rounded-lg px-2 py-1.5 text-gray-700 placeholder-gray-300 focus:outline-none focus:border-indigo-400 transition-colors"

  if (field.type === 'select') {
    return (
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onClick={(e) => e.stopPropagation()}
        className={baseClass}
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
      className={baseClass}
    />
  )
}