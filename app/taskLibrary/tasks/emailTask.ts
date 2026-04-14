import emailjs from '@emailjs/browser'
import type { TaskTypeDefinition } from '../types'

export const emailTask: TaskTypeDefinition = {
  type: 'email',
  label: 'Send Email',
  description: 'Sends an email to a recipient via EmailJS.',
  icon: '✉️',
  inputFields: [
    {
      key: 'recipient',
      label: 'Recipient',
      type: 'text',
      placeholder: 'recipient@example.com',
      required: true,
    },
    {
      key: 'subject',
      label: 'Subject',
      type: 'text',
      placeholder: 'Enter subject...',
      required: true,
    },
    {
      key: 'body',
      label: 'Body',
      type: 'text',
      placeholder: 'Enter email body...',
      required: true,
    },
  ],
  outputFields: [
    {
      key: 'status',
      label: 'Status',
      type: 'text',
    },
  ],
  async execute(task) {
    const { recipient, subject, body } = task.inputs ?? {}

    if (!recipient || !subject || !body) {
      return {
        status: 'warning',
        output: { status: 'Missing required fields.' },
      }
    }

    try {
      await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        { recipient, subject, body },
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY,
      )

      return {
        status: 'success',
        output: { status: `Email sent to ${recipient}` },
      }
    } catch (err) {
      console.log('EmailJS error:', JSON.stringify(err))
      return {
        status: 'error',
        output: { status: `Failed: ${JSON.stringify(err)}` },
      }
    }
  },
}