import { useRef, useState, useCallback } from 'react'
import { DndProvider, useDrop } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { useWorkflowStepsStore } from '~/store/workflowStepsStore'
import { TaskCard } from './TaskCard'

const ITEM_TYPE = 'TASK_CARD'

function Canvas() {
  const { tasks, setTaskPosition } = useWorkflowStepsStore()
  const canvasRef = useRef<HTMLDivElement>(null)

  // Pan state
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const isPanning = useRef(false)
  const panStart = useRef({ x: 0, y: 0 })
  const offsetStart = useRef({ x: 0, y: 0 })

  const [, drop] = useDrop(() => ({
    accept: ITEM_TYPE,
    drop: (item: { id: string; startX: number; startY: number }, monitor) => {
      const delta = monitor.getDifferenceFromInitialOffset()
      if (!delta) return
      setTaskPosition(
        item.id,
        Math.max(0, item.startX + delta.x),
        Math.max(0, item.startY + delta.y),
      )
    },
  }))

  // Combine refs
  const setRefs = useCallback((el: HTMLDivElement | null) => {
    canvasRef.current = el
    drop(el)
  }, [drop])

  const onMouseDown = (e: React.MouseEvent) => {
    // Only pan on canvas background (not card)
    if ((e.target as HTMLElement).closest('[data-task-card]')) return
    isPanning.current = true
    panStart.current = { x: e.clientX, y: e.clientY }
    offsetStart.current = { ...offset }
  }

  const onMouseMove = (e: React.MouseEvent) => {
    if (!isPanning.current) return
    setOffset({
      x: offsetStart.current.x + (e.clientX - panStart.current.x),
      y: offsetStart.current.y + (e.clientY - panStart.current.y),
    })
  }

  const onMouseUp = () => { isPanning.current = false }

  return (
    <div
      ref={setRefs}
      className="h-full w-full relative overflow-hidden bg-gray-50 select-none"
      style={{ cursor: isPanning.current ? 'grabbing' : 'grab' }}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseUp}
    >
      {/* Dot grid */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="dots" x={offset.x % 40} y={offset.y % 40} width="40" height="40" patternUnits="userSpaceOnUse">
            <circle cx="1" cy="1" r="1" fill="#d1d5db" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#dots)" />
      </svg>

      {tasks.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <p className="text-sm text-gray-400">Add tasks to build your workflow</p>
        </div>
      )}

      {/* Cards layer */}
      <div
        className="absolute inset-0"
        style={{ transform: `translate(${offset.x}px, ${offset.y}px)` }}
      >
        {tasks.map((task, i) => (
          <TaskCard key={task.id} task={task} index={i} />
        ))}
      </div>
    </div>
  )
}

export default function WorkflowCanvas() {
  return (
    <DndProvider backend={HTML5Backend}>
      <Canvas />
    </DndProvider>
  )
}