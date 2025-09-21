import { countIncoming, hasMultipleZeroIncoming, validateFlow } from '../lib/validation';
import type { Edge, Node } from 'reactflow';

const makeNode = (id: string): Node => ({ id, type: 'textMessage', position: {x:0,y:0}, data: { text: 't' } });
const makeEdge = (id: string, s: string, t: string): Edge => ({ id, source: s, target: t });

test('countIncoming tallies targets', () => {
  const edges = [makeEdge('e1','a','b'), makeEdge('e2','c','b')];
  const map = countIncoming(edges as any);
  expect(map.get('b')).toBe(2);
});

test('hasMultipleZeroIncoming detects invalid graph', () => {
  const nodes = [makeNode('a'), makeNode('b'), makeNode('c')];
  const edges = [makeEdge('e1','a','c')];
  expect(hasMultipleZeroIncoming(nodes as any, edges as any)).toBe(true);
});

test('validateFlow ok when at most one node has zero incoming', () => {
  const nodes = [makeNode('a'), makeNode('b')];
  const edges = [makeEdge('e1','a','b')];
  expect(validateFlow(nodes as any, edges as any).ok).toBe(true);
});
