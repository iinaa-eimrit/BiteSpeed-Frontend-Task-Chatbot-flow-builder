import { saveFlow, loadFlow, clearFlow } from '../lib/storage';
import type { Node, Edge } from 'reactflow';

const node: Node = { id: 'n1', type: 'textMessage', position: {x:10,y:20}, data: { text: 'hello' } } as any;
const edge: Edge = { id: 'e1', source: 'n1', target: 'n2' } as any;

beforeEach(() => clearFlow());

test('save and load roundtrip', () => {
  saveFlow([node], [edge]);
  const loaded = loadFlow();
  expect(loaded).not.toBeNull();
  expect(loaded!.nodes[0].id).toBe('n1');
  expect(loaded!.edges[0].id).toBe('e1');
});
