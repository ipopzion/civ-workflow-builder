import { useCallback, useEffect } from 'react'
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  ReactFlowProvider,
  useNodesState,
  useEdgesState,
  useReactFlow,
  type Connection,
  type Edge,
  type Node,
  type IsValidConnection,
  ConnectionMode,
  ConnectionLineType,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { useWorkflowStepsStore } from '~/store/workflowStepsStore'
import { useConnectionStore } from '~/store/workflowConnectionsStore'
import { TaskCard } from './TaskCard'
import type { WorkflowTask } from '~/types/workflow'

const nodeTypes = {
  taskCard: TaskCard,
}

interface TaskNode {
  id: string
  type: 'taskCard'
  position: { x: number; y: number }
  data: {
    task: WorkflowTask
    index: number
  }
}

function FlowContent() {
  const { tasks, setTaskPosition, removeTask } = useWorkflowStepsStore()
  const { connections, addConnection, removeConnection, removeConnectionsForTask, selectConnection, selectedConnectionId } = useConnectionStore()
  const { fitView } = useReactFlow()

  const [nodes, setNodes, onNodesChange] = useNodesState<TaskNode>([])
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([])

  // Update nodes when tasks change - using useEffect instead of useMemo
  useEffect(() => {
    const newNodes: TaskNode[] = tasks.map((task, index) => ({
      id: task.id,
      type: 'taskCard',
      position: { x: task.position.x, y: task.position.y },
      data: { task, index },
      draggable: true,
    }))

    setNodes(newNodes)
  }, [tasks, setNodes])

  // Update edges when connections change
  useEffect(() => {
    const newEdges = connections.map((conn) => ({
      id: conn.id,
      source: conn.sourceTaskId,
      sourceHandle: conn.sourceOutputKey,
      target: conn.targetTaskId,
      targetHandle: conn.targetInputKey,
      type: 'smoothstep',
      animated: true,
      selected: selectedConnectionId === conn.id,
      style: {
        stroke: selectedConnectionId === conn.id ? '#3b82f6' : '#94a3b8',
        strokeWidth: selectedConnectionId === conn.id ? 3 : 2,
      },
    }))
    setEdges(newEdges)
  }, [connections, setEdges, selectedConnectionId])

  const isValidConnection = useCallback(
    (connection: Connection) => {
      // Prevent self-connection
      if (connection.source === connection.target) {
        return false
      }

      // Check if target input already has a connection
      const existingConnection = connections.find(
        (c) => c.targetTaskId === connection.target && c.targetInputKey === connection.targetHandle
      )

      if (existingConnection) {
        return false
      }

      return true
    },
    [connections]
  )

  const onConnect = useCallback(
    (connection: Connection) => {
      if (!connection.source || !connection.target || !connection.sourceHandle || !connection.targetHandle) {
        return
      }

      if (!isValidConnection(connection)) {
        console.warn('Invalid connection')
        return
      }

      addConnection({
        sourceTaskId: connection.source,
        sourceOutputKey: connection.sourceHandle,
        targetTaskId: connection.target,
        targetInputKey: connection.targetHandle,
      })
    },
    [addConnection, isValidConnection]
  )

  const onNodeDragStop = useCallback(
    (_event: React.MouseEvent, node: Node) => {
      setTaskPosition(node.id, node.position.x, node.position.y)
    },
    [setTaskPosition]
  )

  const onEdgeClick = useCallback((event: React.MouseEvent, edge: Edge) => {
    event.stopPropagation()
    selectConnection(edge.id)
  }, [selectConnection])

  const onEdgesDelete = useCallback(
    (edgesToDelete: Edge[]) => {
      edgesToDelete.forEach((edge) => {
        removeConnection(edge.id)
      })
    },
    [removeConnection]
  )

  const onNodesDelete = useCallback(
    (nodesToDelete: Node[]) => {
      nodesToDelete.forEach((node) => {
        removeConnectionsForTask(node.id)
        removeTask(node.id)
      })
    },
    [removeConnectionsForTask, removeTask]
  )

  const onPaneClick = useCallback(() => {
    selectConnection(null)
  }, [selectConnection])

  // Fit view on initial load
  useEffect(() => {
    setTimeout(() => fitView({ duration: 200 }), 100)
  }, [fitView])

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      onNodeDragStop={onNodeDragStop}
      onEdgesDelete={onEdgesDelete}
      onNodesDelete={onNodesDelete}
      onEdgeClick={onEdgeClick}
      onPaneClick={onPaneClick}
      onConnectStart={() => console.log('Connection started')}
      onConnectEnd={() => console.log('Connection ended')}
      isValidConnection={isValidConnection as IsValidConnection<Edge>}
      nodeTypes={nodeTypes}
      fitView
      snapToGrid
      snapGrid={[20, 20]}
      defaultViewport={{ x: 0, y: 0, zoom: 1 }}
      minZoom={0.5}
      maxZoom={2}
      connectionMode={'loose' as ConnectionMode}
      connectionLineStyle={{ stroke: '#6366f1', strokeWidth: 2 }}
      connectionLineType={'smoothstep' as ConnectionLineType}
    >
      <Background color="#d1d5db" gap={40} size={1} />
      <Controls />
      <MiniMap
        nodeStrokeWidth={3}
        zoomable
        pannable
        nodeColor="#6366f1"
      />
    </ReactFlow>
  )
}

export default function WorkflowCanvas() {
  return (
    <div className="h-full w-full" style={{ height: '100vh' }}>
      <ReactFlowProvider>
        <FlowContent />
      </ReactFlowProvider>
    </div>
  )
}