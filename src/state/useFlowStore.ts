import { create } from 'zustand';
import {
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  Connection,
  Edge,
  EdgeChange,
  Node,
  NodeChange,
  OnConnect,
  OnEdgesChange,
  OnNodesChange,
} from 'reactflow';
import toast from 'react-hot-toast';
import { saveFlow, loadFlow as loadFromStorage } from '../lib/storage';
import { validateFlow, ValidationResult } from '../lib/validation';

/** App-wide types for nodes/edges (can expand later) */
export type FlowNode = Node<{ text: string }>;
export type FlowEdge = Edge;

type FlowState = {
  // graph
  nodes: FlowNode[];
  edges: FlowEdge[];

  // selection
  selectedNodeId?: string;

  // handlers wired into React Flow
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;
  onNodeClick: (_: React.MouseEvent, node: FlowNode) => void;
  onPaneClick: () => void;

  // store mutators
  setNodes: (
    updater: FlowNode[] | ((prev: FlowNode[]) => FlowNode[]),
  ) => void;
  setEdges: (
    updater: FlowEdge[] | ((prev: FlowEdge[]) => FlowEdge[]),
  ) => void;

  // ui helpers
  selectNode: (id: string | undefined) => void;
  upsertNodeData: (id: string, data: Partial<{ text: string }>) => void;

  // persistence + validation
  save: () => void;
  load: () => void;
  validateBeforeSave: () => ValidationResult;
};

export const useFlowStore = create<FlowState>((set, get) => ({
  nodes: [],
  edges: [],
  selectedNodeId: undefined,

  /** React Flow node changes -> zustand */
  onNodesChange: (changes: NodeChange[]) =>
    set((state) => ({ nodes: applyNodeChanges(changes, state.nodes) })),

  /** React Flow edge changes -> zustand */
  onEdgesChange: (changes: EdgeChange[]) =>
    set((state) => ({ edges: applyEdgeChanges(changes, state.edges) })),

  /**
   * Enforce "one outgoing edge per source" on connect.
   * Allow unlimited incoming edges (target handle).
   */
  onConnect: (params: Connection) => {
    const { edges } = get();

    // If a source was provided and it already has an outgoing edge, block it.
    if (params.source && edges.some((e) => e.source === params.source)) {
      toast.error('Each message can have only one outgoing connection');
      return;
    }

    // Otherwise add the edge with a clean default style
    set((state) => ({
      edges: addEdge(
        {
          ...params,
          type: state.edges?.[0]?.type, // keep default (if any)
        },
        state.edges,
      ),
    }));
  },

  /** Node clicked -> open settings */
  onNodeClick: (_, node) => set({ selectedNodeId: node.id }),

  /** Clicked on canvas -> deselect */
  onPaneClick: () => set({ selectedNodeId: undefined }),

  /** Replace/set nodes */
  setNodes: (updater) =>
    set((state) => ({
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      nodes: typeof updater === 'function' ? (updater as any)(state.nodes) : (updater as FlowNode[]),
    })),

  /** Replace/set edges */
  setEdges: (updater) =>
    set((state) => ({
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      edges: typeof updater === 'function' ? (updater as any)(state.edges) : (updater as FlowEdge[]),
    })),

  /** Programmatic selection */
  selectNode: (id) => set({ selectedNodeId: id }),

  /** Update text data for a node */
  upsertNodeData: (id, data) =>
    set((state) => ({
      nodes: state.nodes.map((n) =>
        n.id === id ? ({ ...n, data: { ...n.data, ...data } } as FlowNode) : n,
      ),
    })),

  /** Validate the flow against the spec */
  validateBeforeSave: () => {
    const { nodes, edges } = get();
    return validateFlow(nodes, edges);
  },

  /** Persist to localStorage; success toast lives *here* (single source of truth) */
  save: () => {
    const { nodes, edges } = get();
    const res = get().validateBeforeSave();

    if (!res.ok) {
      toast.error(res.reason ?? 'Cannot save');
      return;
    }

    saveFlow(nodes, edges);
    toast.success('Flow saved'); // <— the ONLY success toast
  },

  /** Load from localStorage on app start */
  load: () => {
    const data = loadFromStorage();
    if (data) {
      set({ nodes: data.nodes as FlowNode[], edges: data.edges as FlowEdge[] });
    }
  },
}));

/* Convenience re-exports for components */
export const useFlowHandlers = () => {
  const {
    onNodesChange,
    onEdgesChange,
    onConnect,
    onNodeClick,
    onPaneClick,
  } = useFlowStore.getState();

  return { onNodesChange, onEdgesChange, onConnect, onNodeClick, onPaneClick };
};
