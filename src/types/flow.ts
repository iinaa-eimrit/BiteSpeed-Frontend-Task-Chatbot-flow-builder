import { Node, Edge, XYPosition } from 'reactflow';

// Node data types
export type TextNodeData = {
  text: string;
};

// Flow types
export type FlowNode = Node<TextNodeData>;
export type FlowEdge = Edge;

// Node catalog for extensibility
export type NodeCatalogItem = {
  type: string;
  label: string;
  icon: string;
  defaultData: TextNodeData;
};

// Store types
export type FlowState = {
  nodes: FlowNode[];
  edges: FlowEdge[];
  selectedNodeId?: string;
  setNodes: (updater: (nodes: FlowNode[]) => FlowNode[]) => void;
  setEdges: (updater: (edges: FlowEdge[]) => FlowEdge[]) => void;
  selectNode: (id?: string) => void;
  addNode: (partial: Partial<FlowNode>, pos: XYPosition) => void;
  upsertNodeData: (id: string, data: Partial<TextNodeData>) => void;
  canConnectFrom: (sourceId: string) => boolean;
  validateBeforeSave: () => { ok: true } | { ok: false; reason: string };
  save: () => void;
  load: () => void;
};

// Validation result
export type ValidationResult = 
  | { ok: true }
  | { ok: false; reason: string };