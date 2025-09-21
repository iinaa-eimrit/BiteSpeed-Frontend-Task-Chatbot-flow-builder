import { FlowNode, FlowEdge, ValidationResult } from '../types/flow';

/**
 * Count incoming edges for each node
 */
export const countIncoming = (edges: FlowEdge[]): Map<string, number> => {
  const counts = new Map<string, number>();
  
  edges.forEach(edge => {
    const current = counts.get(edge.target) || 0;
    counts.set(edge.target, current + 1);
  });
  
  return counts;
};

/**
 * Check if there are multiple nodes with no incoming edges
 */
export const hasMultipleZeroIncoming = (nodes: FlowNode[], edges: FlowEdge[]): boolean => {
  if (nodes.length <= 1) return false;
  
  const incomingCounts = countIncoming(edges);
  let zeroIncomingCount = 0;
  
  nodes.forEach(node => {
    const incomingCount = incomingCounts.get(node.id) || 0;
    if (incomingCount === 0) {
      zeroIncomingCount++;
    }
  });
  
  return zeroIncomingCount > 1;
};

/**
 * Validate the flow before saving
 */
export const validateFlow = (nodes: FlowNode[], edges: FlowEdge[]): ValidationResult => {
  if (hasMultipleZeroIncoming(nodes, edges)) {
    return {
      ok: false,
      reason: 'More than one node has no incoming connection.'
    };
  }
  
  return { ok: true };
};

export type { ValidationResult };
