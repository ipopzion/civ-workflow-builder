import type { TaskTypeDefinition } from "../types"

export const lookupTask: TaskTypeDefinition = {
  type: 'lookup',
  label: 'Extract Data',
  description: 'Find specific information in text (emails, prices, dates, etc.)',
  icon: "🔍",
  inputFields: [
    {
      key: 'sourceText',
      label: 'Text to Search',
      type: 'text',
      placeholder: 'Paste the text you want to search through...',
      required: true,
    },
    {
      key: 'extractionType',
      label: 'What to Extract',
      type: 'select',
      required: true,
      options: [
        { label: '📧 Email Addresses', value: 'email' },
        { label: '💰 Dollar Amounts ($50, $1.99, etc.)', value: 'money' },
        { label: '🔢 All Numbers', value: 'numbers' },
        { label: '📞 Phone Numbers', value: 'phone' },
        { label: '🌐 URLs / Links', value: 'url' },
        { label: '📅 Dates (MM/DD/YYYY)', value: 'dates' },
        { label: '🎯 Custom Pattern (Advanced)', value: 'regex' },
        { label: '📝 Next Word After...', value: 'nextWord' },
      ],
    },
    {
      key: 'customPattern',
      label: 'Custom Pattern',
      type: 'text',
      condition: { field: 'extractionType', value: 'regex' },
      placeholder: 'e.g., product-[0-9]+ or "Price: (\\$\\d+)',
    },
    {
      key: 'searchTerm',
      label: 'Look After This Word',
      type: 'text',
      condition: { field: 'extractionType', value: 'nextWord' },
      placeholder: 'e.g., "total", "price", "name"',
    },
  ],
  outputFields: [
    {
      key: 'matches',
      label: 'Found Items',
      type: 'text',
    },
    {
      key: 'count',
      label: 'Number Found',
      type: 'number',
    },
    {
      key: 'firstMatch',
      label: 'First Match',
      type: 'text',
    },
  ],
  execute(task) {
    const text = task?.inputs?.sourceText
    const extractionType = task?.inputs?.extractionType

    if (!text) {
      return { status: 'warning', output: { matches: 'No text provided to search.', count: '0', firstMatch: '' } }
    }

    let matches: string[] = []
    let pattern = null

    // Define patterns for common extraction types
    const patterns = {
      email: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g,
      money: /\$?\d+(?:\.\d{2})?|\d+\s?(?:dollars|USD)/gi,
      numbers: /\d+(?:\.\d+)?/g,
      phone: /\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g,
      url: /https?:\/\/[^\s]+|www\.[^\s]+/gi,
      dates: /\d{1,2}\/\d{1,2}\/\d{4}|\d{4}-\d{2}-\d{2}/g,
    }

    if (extractionType == null) {
      return { status: 'warning', output: { matches: 'Please select what you want to extract.', count: '0', firstMatch: '' } }
    }

    if (extractionType === 'regex') {
      const customPattern = task?.inputs?.customPattern
      if (!customPattern) {
        return { status: 'warning', output: { matches: 'Please provide a custom pattern.', count: '0', firstMatch: '' } }
      }
      try {
        pattern = new RegExp(customPattern, 'gi')
        matches = [...text.matchAll(pattern)].map(m => m[0])
      } catch (error: any) {
        return { status: 'warning', output: { matches: `Invalid pattern: ${error.message}`, count: '0', firstMatch: '' } }
      }
    } else if (extractionType === 'nextWord') {
      const searchTerm = task?.inputs?.searchTerm
      if (!searchTerm) {
        return { status: 'warning', output: { matches: 'Please enter a word to search for.', count: '0', firstMatch: '' } }
      }
      const regex = new RegExp(`${searchTerm}\\s+(\\w+)`, 'gi')
      matches = [...text.matchAll(regex)].map(m => m[1])
    } else {
      pattern = patterns[extractionType as keyof typeof patterns]
      if (pattern) {
        matches = text.match(pattern) || []
      }
    }

    const uniqueMatches = [...new Set(matches)]

    return {
      status: 'success',
      output: {
        matches: uniqueMatches.join(', ') || 'No matches found',
        count: String(uniqueMatches.length),
        firstMatch: uniqueMatches[0] || 'None',
      }
    }
  },
}