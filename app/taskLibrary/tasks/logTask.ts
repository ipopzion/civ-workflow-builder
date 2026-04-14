import type { TaskTypeDefinition } from '../types'

export const logTask: TaskTypeDefinition = {
  type: 'log',
  label: 'Log Message',
  description: 'Prints a message to the execution log.',
  icon: '📝',
  inputFields: [
    {
      key: 'message',
      label: 'Message',
      type: 'text',
      placeholder: 'Enter message to log...',
      required: true,
    },
  ],
  outputFields: [
    {
      key: 'message',
      label: 'Message',
      type: 'text',
    },
  ],
  execute(task) {
    const message = task?.inputs?.message

    if (!message) {
      return { status: 'warning', output: { message: 'No message provided.' } }
    }
    return { status: 'success', output: { message } }
  },
}
