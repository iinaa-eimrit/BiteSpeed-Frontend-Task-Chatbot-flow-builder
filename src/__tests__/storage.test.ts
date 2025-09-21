import { countIncoming, hasMultipleZeroIncoming, validateFlow } from '../lib/validation';
import type { Edge, Node } from 'reactflow';

type TextData = { text: string };
type RFNode = Node<TextData>;
type RFEdge = Edge;

const makeNode = (id: string): RFNode => ({
  id,
  type: 'textMessage',
  position: { x: 0, y: 0 },
  data: { text: 't' },
});

const makeEdge = (id: string, source: string, target: string): RFEdge => ({
  id,
  source,
  target,
});

test('countIncoming tallies targets', () => {
  const edges: RFEdge[] = [makeEdge('e1', 'a', 'b'), makeEdge('e2', 'c', 'b')];
  const map = countIncoming(edges);
  expect(map.get('b')).toBe(2);
});

test('hasMultipleZeroIncoming detects invalid graph', () => {
  const nodes: RFNode[] = [makeNode('a'), makeNode('b'), makeNode('c')];
  const edges: RFEdge[] = [makeEdge('e1', 'a', 'c')];
  expect(hasMultipleZeroIncoming(nodes, edges)).toBe(true);
});

test('validateFlow ok when at most one node has zero incoming', () => {
  const nodes: RFNode[] = [makeNode('a'), makeNode('b')];
  const edges: RFEdge[] = [makeEdge('e1', 'a', 'b')];
  expect(validateFlow(nodes, edges).ok).toBe(true);
});
