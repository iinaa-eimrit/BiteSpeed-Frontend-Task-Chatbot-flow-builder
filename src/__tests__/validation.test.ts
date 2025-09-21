import { countIncoming, hasMultipleZeroIncoming, validateFlow } from '../lib/validation';
import type { Edge, Node } from 'reactflow';

/**
 * Define Text Node type so our test nodes match the app's expected shape.
 */
type TextNode = Node<{ text: string }>;

/** Helper to create nodes */
const makeNode = (id: string): TextNode => ({
  id,
  type: 'textMessage',
  position: { x: 0, y: 0 },
  data: { text: 'test' },
});

/** Helper to create edges */
const makeEdge = (id: string, source: string, target: string): Edge => ({
  id,
  source,
  target,
});

test('countIncoming tallies targets correctly', () => {
  const edges: Edge[] = [
    makeEdge('e1', 'a', 'b'),
    makeEdge('e2', 'c', 'b'),
  ];

  // Count incoming edges per node
  const map = countIncoming(edges);
  expect(map.get('b')).toBe(2);
});

test('hasMultipleZeroIncoming detects invalid graph', () => {
  const nodes: TextNode[] = [makeNode('a'), makeNode('b'), makeNode('c')];
  const edges: Edge[] = [makeEdge('e1', 'a', 'c')];

  // Two nodes (a and b) have zero incoming edges
  expect(hasMultipleZeroIncoming(nodes, edges)).toBe(true);
});

test('validateFlow passes when at most one node has zero incoming', () => {
  const nodes: TextNode[] = [makeNode('a'), makeNode('b')];
  const edges: Edge[] = [makeEdge('e1', 'a', 'b')];

  // Only node 'a' has zero incoming, so this is valid
  const result = validateFlow(nodes, edges);
  expect(result.ok).toBe(true);
});
