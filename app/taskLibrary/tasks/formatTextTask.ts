import type { TaskTypeDefinition } from "../types"

export const formatStringTask: TaskTypeDefinition = {
  type: 'format',
  label: 'Format Text',
  description: 'Add, replace, or template text with variables',
  icon: "✨",
  inputFields: [
    {
      key: 'sourceText',
      label: 'Original Text',
      type: 'text',
      placeholder: 'Enter the text you want to format...',
      required: true,
    },
    {
      key: 'operation',
      label: 'What to Do',
      type: 'select',
      required: true,
      options: [
        { label: '✂️ Replace Text', value: 'replace' },
        { label: "📝 Fill Template (like 'Hello {name}')", value: 'template' },
        { label: '➕ Add Prefix/Suffix', value: 'add' },
        { label: '🔠 Change Case', value: 'case' },
        { label: '✂️ Trim Whitespace', value: 'trim' },
      ],
    },
    {
      key: 'findText',
      label: 'Find What',
      type: 'text',
      placeholder: 'Text to replace...',
      condition: { field: 'operation', value: 'replace' },
      required: true,
    },
    {
      key: 'replaceText',
      label: 'Replace With',
      type: 'text',
      placeholder: 'New text...',
      condition: { field: 'operation', value: 'replace' },
      required: true,
    },
    {
      key: 'template',
      label: 'Template',
      type: 'text',
      placeholder: 'Example: "Hello {name}! Your total is ${amount}."',
      condition: { field: 'operation', value: 'template' },
      required: true,
    },
    {
      key: 'variables',
      label: 'Variable Values',
      type: 'text',
      placeholder: 'Example: name=John, amount=50\nOr JSON: {"name":"John","amount":50}',
      condition: { field: 'operation', value: 'template' },
    },
    {
      key: 'prefix',
      label: 'Add Before Text',
      type: 'text',
      placeholder: 'e.g., "Hello: "',
      condition: { field: 'operation', value: 'add' },
    },
    {
      key: 'suffix',
      label: 'Add After Text',
      type: 'text',
      placeholder: 'e.g., " - Done"',
      condition: { field: 'operation', value: 'add' },
    },
    {
      key: 'caseType',
      label: 'Case Type',
      type: 'select',
      condition: { field: 'operation', value: 'case' },
      options: [
        { label: 'UPPERCASE', value: 'upper' },
        { label: 'lowercase', value: 'lower' },
        { label: 'Title Case', value: 'title' },
        { label: 'Capitalize First Letter', value: 'capitalize' },
      ],
    },
  ],
  outputFields: [
    {
      key: 'formattedText',
      label: 'Formatted Result',
      type: 'text',
    },
    {
      key: 'length',
      label: 'Character Count',
      type: 'number',
    },
  ],
  execute(task) {
    let text = task?.inputs?.sourceText || ''
    const operation = task?.inputs?.operation

    if (!text && operation !== 'template') {
      return { status: 'warning', output: { formattedText: 'No text provided.' } }
    }

    let result = text

    try {
      switch (operation) {
        case 'replace':
          const findText = task?.inputs?.findText
          const replaceText = task?.inputs?.replaceText
          if (!findText) {
            return { status: 'warning', output: { formattedText: 'Please specify text to find.' } }
          }
          result = text.replace(new RegExp(findText, 'g'), replaceText || '')
          break

        case 'template':
          const template = task?.inputs?.template
          if (!template) {
            return { status: 'warning', output: { formattedText: 'Please provide a template.' } }
          }

          let variables: Record<string, string> = {}
          const varsInput = task?.inputs?.variables

          if (varsInput) {
            // Try parsing as JSON first
            try {
              variables = JSON.parse(varsInput)
            } catch {
              // Parse as key=value pairs
              varsInput.split('\n').forEach(line => {
                const [key, value] = line.split('=')
                if (key && value) variables[key.trim()] = value.trim()
              })
            }
          }

          result = template.replace(/\{(\w+)\}/g, (match, key) => {
            return variables[key] !== undefined ? variables[key] : match
          })
          break

        case 'add':
          const prefix = task?.inputs?.prefix || ''
          const suffix = task?.inputs?.suffix || ''
          result = prefix + text + suffix
          break

        case 'case':
          const caseType = task?.inputs?.caseType
          switch (caseType) {
            case 'upper':
              result = text.toUpperCase()
              break
            case 'lower':
              result = text.toLowerCase()
              break
            case 'title':
              result = text.replace(/\b\w/g, l => l.toUpperCase())
              break
            case 'capitalize':
              result = text.charAt(0).toUpperCase() + text.slice(1).toLowerCase()
              break
            default:
              result = text
          }
          break

        case 'trim':
          result = text.trim()
          break

        default:
          return { status: 'warning', output: { formattedText: 'Please select an operation.' } }
      }

      return {
        status: 'success',
        output: {
          formattedText: result,
        }
      }
    } catch (error: any) {
      return { status: 'warning', output: { formattedText: `Error: ${error.message}` } }
    }
  },
}