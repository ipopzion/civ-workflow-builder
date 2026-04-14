import type { TaskTypeDefinition } from '../types'

export const calculationTask: TaskTypeDefinition = {
  type: 'calculation',
  label: 'Calculate',
  description: 'Performs an arithmetic operation on two numbers.',
  icon: "🔢",
  inputFields: [
    {
      key: 'num1',
      label: 'Number 1',
      type: 'number',
      placeholder: '0',
      required: true,
    },
    {
      key: 'num2',
      label: 'Number 2',
      type: 'number',
      placeholder: '0',
      required: true,
    },
    {
      key: 'operator',
      label: 'Operator',
      type: 'select',
      required: true,
      options: [
        { label: 'Add', value: 'add' },
        { label: 'Multiply', value: 'multiply' },
      ],
    },
  ],
  outputFields: [
    {
      key: 'result',
      label: 'Result',
      type: 'number',
    },
  ],
  execute(task) {
    if (task?.inputs?.num1 === undefined || task?.inputs?.num2 === undefined) {
      return { status: 'warning', output: { result: 'Both numbers are required.' } }
    }

    const a = parseFloat(task?.inputs?.num1)
    const b = parseFloat(task?.inputs?.num2)
    const operator = task?.inputs?.operator

    if (!operator) {
      return { status: 'warning', output: { result: 'No operator selected.' } }
    }
    if (isNaN(a) || isNaN(b)) {
      return { status: 'warning', output: { result: 'Invalid numbers.' } }
    }

    const result = operator === 'multiply' ? a * b : a + b
    return { status: 'success', output: { result: String(result) } }
  },
}