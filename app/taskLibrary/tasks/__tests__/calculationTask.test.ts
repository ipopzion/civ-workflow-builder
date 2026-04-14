import { describe, it, expect } from 'vitest'
import { calculationTask } from '../calculationTask'
import type { WorkflowTask } from '~/types/workflow'

const baseTask: WorkflowTask = {
  id: '2',
  type: 'calculation',
  status: 'idle',
  inputs: {},
  outputs: {},
}

describe('calculationTask', () => {
  it('adds two numbers correctly', async () => {
    const task = { ...baseTask, inputs: { num1: '3', num2: '4', operator: 'add' } }
    const result = await calculationTask.execute(task)
    expect(result.status).toBe('success')
    expect(result.output.result).toBe('7')
  })

  it('multiplies two numbers correctly', async () => {
    const task = { ...baseTask, inputs: { num1: '3', num2: '4', operator: 'multiply' } }
    const result = await calculationTask.execute(task)
    expect(result.status).toBe('success')
    expect(result.output.result).toBe('12')
  })

  it('returns warning when operator is missing', async () => {
    const task = { ...baseTask, inputs: { num1: '3', num2: '4' } }
    const result = await calculationTask.execute(task)
    expect(result.status).toBe('warning')
  })

  it('returns warning when numbers are invalid', async () => {
    const task = { ...baseTask, inputs: { num1: 'abc', num2: '4', operator: 'add' } }
    const result = await calculationTask.execute(task)
    expect(result.status).toBe('warning')
  })

  it('returns warning when inputs are missing', async () => {
    const task = { ...baseTask, inputs: {} }
    const result = await calculationTask.execute(task)
    expect(result.status).toBe('warning')
  })
})