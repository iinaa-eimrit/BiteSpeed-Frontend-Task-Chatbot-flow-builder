import { FlowNode, FlowEdge } from '../types/flow';

const STORAGE_KEY = 'bitespeed.flow.v1';

export type SerializedFlow = {
  nodes: Array<{
    id: string;
    type: string;
    position: { x: number; y: number };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: any;
  }>;
  edges: Array<{
    id: string;
    source: string;
    target: string;
    type?: string;
  }>;
};

/**
 * Save flow to localStorage
 */
export const saveFlow = (nodes: FlowNode[], edges: FlowEdge[]): void => {
  try {
    const serialized: SerializedFlow = {
      nodes: nodes.map(node => ({
        id: node.id,
        type: node.type || 'textMessage',
        position: node.position,
        data: node.data
      })),
      edges: edges.map(edge => ({
        id: edge.id,
        source: edge.source,
        target: edge.target,
        type: edge.type
      }))
    };
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(serialized));
  } catch (error) {
    console.error('Failed to save flow:', error);
  }
};

/**
 * Load flow from localStorage
 */
export const loadFlow = (): { nodes: FlowNode[]; edges: FlowEdge[] } | null => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;
    
    const parsed: SerializedFlow = JSON.parse(stored);
    
    const nodes: FlowNode[] = parsed.nodes.map(node => ({
      id: node.id,
      type: node.type,
      position: node.position,
      data: node.data
    }));
    
    const edges: FlowEdge[] = parsed.edges.map(edge => ({
      id: edge.id,
      source: edge.source,
      target: edge.target,
      type: edge.type || 'smoothstep'
    }));
    
    return { nodes, edges };
  } catch (error) {
    console.error('Failed to load flow:', error);
    return null;
  }
};

/**
 * Clear stored flow (useful for development/reset)
 */
export const clearFlow = (): void => {
  localStorage.removeItem(STORAGE_KEY);
};