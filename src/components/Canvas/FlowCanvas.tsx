import React, { useCallback, useEffect, useRef, useState } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  ReactFlowProvider,
  ReactFlowInstance,
  Node,
  Edge,
  OnSelectionChangeParams
} from 'reactflow';
import 'reactflow/dist/style.css';

import { useFlowStore, useFlowHandlers } from '../../state/useFlowStore';
import TextMessageNode from './nodeTypes/TextMessageNode';
import { generateId } from '../../lib/ids';
import { showConfirmToast } from '../common/ConfirmToast';

// registry
const nodeTypes = { textMessage: TextMessageNode };

const FlowCanvas: React.FC = () => {
  const { nodes, edges, setEdges, setNodes } = useFlowStore();
  const { onNodesChange, onEdgesChange, onConnect, onNodeClick, onPaneClick } = useFlowHandlers();

  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance | null>(null);

  const [showMinimap, setShowMinimap] = useState<boolean>(true);
  const selectedEdgesRef = useRef<Edge[]>([]);
  const selectedNodesRef = useRef<Node[]>([]);
  const confirmOpenRef = useRef<boolean>(false); // prevent multiple stacked confirms

  // Hotkeys: delete edges immediately; ask confirm for nodes via custom toast (not window.confirm)
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const del = e.key === 'Delete' || e.key === 'Backspace';

      // delete selected edges
      if (del && selectedEdgesRef.current.length > 0) {
        const ids = new Set(selectedEdgesRef.current.map((ed) => ed.id));
        setEdges((prev) => prev.filter((ed) => !ids.has(ed.id)));
      }

      // delete selected nodes with custom confirm
      if (del && selectedNodesRef.current.length > 0) {
        if (confirmOpenRef.current) return; // already showing one
        confirmOpenRef.current = true;

        const count = selectedNodesRef.current.length;
        const ids = new Set(selectedNodesRef.current.map((n) => n.id));

        showConfirmToast({
          message: `Delete ${count} selected node${count > 1 ? 's' : ''}?`,
          onConfirm: () => {
            setNodes((prev) => prev.filter((n) => !ids.has(n.id)));
            setEdges((prev) => prev.filter((ed) => !ids.has(ed.source) && !ids.has(ed.target)));
            confirmOpenRef.current = false;
          }
        });

        // if user cancels (toast dismissed), allow next confirm
        // the confirm helper resets this flag only on confirm; also handle dismissal below
        setTimeout(() => (confirmOpenRef.current = false), 5200);
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [setEdges, setNodes]);

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();

    const bounds = reactFlowWrapper.current?.getBoundingClientRect();
    const type = e.dataTransfer.getData('application/reactflow');
    if (!type || !reactFlowInstance || !bounds) return;

    const position = reactFlowInstance.project({
      x: e.clientX - bounds.left,
      y: e.clientY - bounds.top,
    });

    setNodes((prev) => [
      ...prev,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      { id: generateId(), type, position, data: { text: 'New message' } } as any,
    ]);
  }, [reactFlowInstance, setNodes]);

  const onInit = useCallback((inst: ReactFlowInstance) => setReactFlowInstance(inst), []);
  const onSelectionChange = useCallback((p: OnSelectionChangeParams) => {
    selectedEdgesRef.current = p.edges;
    selectedNodesRef.current = p.nodes;
  }, []);

  return (
    <div className="relative h-full w-full" ref={reactFlowWrapper}>
      {/* move minimap button so it doesn't collide with theme switcher */}
      <div className="fixed top-16 left-4 z-20">
        <button
          className="px-3 py-1 rounded-lg border border-gray-300 bg-white shadow text-sm hover:bg-gray-50"
          onClick={() => setShowMinimap((v) => !v)}
          aria-pressed={showMinimap}
          aria-label="Toggle minimap"
        >
          {showMinimap ? 'Hide Minimap' : 'Show Minimap'}
        </button>
      </div>

      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        onPaneClick={onPaneClick}
        onInit={onInit}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onSelectionChange={onSelectionChange}
        nodeTypes={nodeTypes}
        fitView
        attributionPosition="bottom-left"
        className="bg-gray-50"
      >
        <Background color="#e5e7eb" gap={20} />
        <Controls className="bg-white shadow-lg border border-gray-200" />
        {showMinimap && (
          <MiniMap
            className="bg-white border border-gray-200 shadow-lg"
            nodeColor="#10b981"
            maskColor="rgba(0, 0, 0, 0.08)"
          />
        )}

        {/* empty state hint */}
        {nodes.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-center text-gray-400">
              <p className="text-lg font-medium mb-2">Start building your chatbot flow</p>
              <p className="text-sm">Drag a Message from the right panel to get started</p>
            </div>
          </div>
        )}
      </ReactFlow>
    </div>
  );
};

const FlowCanvasWrapper: React.FC = () => (
  <ReactFlowProvider>
    <FlowCanvas />
  </ReactFlowProvider>
);

export default FlowCanvasWrapper;
