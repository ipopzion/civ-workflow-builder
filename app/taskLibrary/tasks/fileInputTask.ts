import type { TaskTypeDefinition } from "../types"

export const fileInputTask: TaskTypeDefinition = {
  type: 'fileInput',
  label: 'Read File',
  description: 'Extract content from uploaded files (TXT, CSV, JSON)',
  icon: "📄",
  inputFields: [
    {
      key: 'inputMethod',
      label: 'How to Add Content',
      type: 'select',
      required: true,
      options: [
        { label: '📝 Paste Text', value: 'paste' },
        { label: '📎 Upload File', value: 'upload' },
      ],
    },
    {
      key: 'fileContent',
      label: 'Text Content',
      type: 'text',
      placeholder: 'Paste your text content here...',
      required: true,
      condition: { field: 'inputMethod', value: 'paste' },
    },
    {
      key: 'uploadedFile',
      label: 'Upload File',
      type: 'file',
      placeholder: 'Click to upload or drag and drop',
      required: true,
      condition: { field: 'inputMethod', value: 'upload' },
    },
    {
      key: 'fileType',
      label: 'File Format',
      type: 'select',
      required: true,
      options: [
        { label: 'Plain Text (.txt)', value: 'text' },
        { label: 'CSV / Spreadsheet', value: 'csv' },
        { label: 'JSON Data', value: 'json' },
      ],
    },
    {
      key: 'delimiter',
      label: 'CSV Delimiter',
      type: 'select',
      options: [
        { label: 'Comma (,)', value: ',' },
        { label: 'Semicolon (;)', value: ';' },
        { label: 'Tab (\\t)', value: '\t' },
        { label: 'Pipe (|)', value: '|' },
        { label: 'Custom', value: 'custom' },
      ],
      condition: { field: 'fileType', value: 'csv' },
    },
    {
      key: 'customDelimiter',
      label: 'Custom Delimiter',
      type: 'text',
      placeholder: 'e.g., | or ; or \\t',
      condition: {
        field: 'delimiter',
        value: 'custom'
      },
    },
    {
      key: 'encoding',
      label: 'File Encoding',
      type: 'select',
      options: [
        { label: 'UTF-8', value: 'utf8' },
        { label: 'ASCII', value: 'ascii' },
        { label: 'UTF-16', value: 'utf16' },
      ],
      condition: { field: 'inputMethod', value: 'upload' },
    },
  ],
  outputFields: [
    {
      key: 'content',
      label: 'Extracted Content',
      type: 'text',
    },
    {
      key: 'lineCount',
      label: 'Line Count',
      type: 'number',
    },
    {
      key: 'firstLine',
      label: 'First Line Preview',
      type: 'text',
    },
  ],
  execute(task) {
    const inputMethod = task?.inputs?.inputMethod || 'paste'

    // Get content based on input method
    let content = ''
    let fileSize = 0

    if (inputMethod === 'paste') {
      content = task?.inputs?.fileContent || ''
      if (!content.trim()) {
        return { status: 'warning', output: { content: 'Please paste some text content.' } }
      }
    } else if (inputMethod === 'upload') {
      const uploadedFile = task?.inputs?.uploadedFile
      if (!uploadedFile) {
        return { status: 'warning', output: { content: 'Please upload a file.' } }
      }

      // Handle file object (this would come from your file upload component)
      if (typeof uploadedFile === 'object' && uploadedFile !== null && 'content' in uploadedFile) {
        content = (uploadedFile as any).content
        fileSize = (uploadedFile as any).size || 0
      } else if (typeof uploadedFile === 'string') {
        content = uploadedFile
      } else {
        return { status: 'warning', output: { content: 'Invalid file data.' } }
      }
    }

    const fileType = task?.inputs?.fileType

    if (!content || content.trim() === '') {
      return { status: 'warning', output: { content: 'No content provided.' } }
    }

    try {
      let processedContent = content
      let lineCount = content.split(/\r?\n/).length
      let firstLine = content.split(/\r?\n/)[0] || ''

      // Parse based on file type
      if (fileType === 'csv') {
        let delimiter = task?.inputs?.delimiter || ','

        // Handle custom delimiter
        if (delimiter === 'custom') {
          delimiter = task?.inputs?.customDelimiter || ','
          if (!delimiter) {
            return { status: 'warning', output: { content: 'Please specify a custom delimiter.' } }
          }
        }

        // Parse CSV with proper handling of quotes
        const rows = []
        const lines = content.split(/\r?\n/)

        for (const line of lines) {
          if (line.trim() === '') continue

          // Simple CSV parsing with quote handling
          const row = []
          let current = ''
          let inQuotes = false

          for (let i = 0; i < line.length; i++) {
            const char = line[i]

            if (char === '"') {
              inQuotes = !inQuotes
            } else if (char === delimiter && !inQuotes) {
              row.push(current)
              current = ''
            } else {
              current += char
            }
          }
          row.push(current)
          rows.push(row)
        }

        processedContent = JSON.stringify(rows, null, 2)
        lineCount = rows.length
        firstLine = rows[0]?.join(delimiter) || ''
      } else if (fileType === 'json') {
        const parsed = JSON.parse(content)
        processedContent = JSON.stringify(parsed, null, 2)
        lineCount = Array.isArray(parsed) ? parsed.length : Object.keys(parsed).length
        firstLine = Array.isArray(parsed)
          ? JSON.stringify(parsed[0])
          : JSON.stringify(parsed).substring(0, 100)
      }

      const output: any = {
        content: processedContent,
        lineCount: String(lineCount),
        firstLine: firstLine.substring(0, 200),
      }

      if (fileSize > 0) {
        output.fileSize = String((fileSize / 1024).toFixed(2))
      }

      return {
        status: 'success',
        output
      }
    } catch (error: any) {
      let errorMessage = 'Error reading file: '

      if (fileType === 'json') {
        errorMessage += 'Invalid JSON format. Please check your JSON syntax.'
      } else if (fileType === 'csv') {
        errorMessage += 'Could not parse CSV. Check your delimiter and format.'
      } else {
        errorMessage += error.message
      }

      return { status: 'warning', output: { content: errorMessage } }
    }
  },
}