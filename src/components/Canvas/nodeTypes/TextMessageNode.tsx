import React from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { MessageCircle } from 'lucide-react';
import { TextNodeData } from '../../../types/flow';
import { useUiStore } from '../../../state/useUiStore';

/**
 * Theme-aware text message node
 */
const TextMessageNode: React.FC<NodeProps<TextNodeData>> = ({ data, selected }) => {
  const { theme } = useUiStore();
  const displayText = data.text || 'New message';

  const headerClass =
    theme === 'teal'
      ? 'bg-emerald-500 text-white'
      : theme === 'ghost'
      ? 'bg-white text-gray-800 border-b border-gray-200'
      : 'bg-gray-100 text-gray-800';

  return (
    <div
      className={`rounded-xl shadow-md border ${
        selected ? 'ring-2 ring-emerald-400' : 'border-gray-200'
      } bg-white w-[320px]`}
    >
      {/* Header */}
      <div className={`flex items-center gap-2 px-3 py-2 rounded-t-xl ${headerClass}`}>
        <MessageCircle className="w-4 h-4" />
        <span className="font-medium text-sm">Send Message</span>
      </div>

      {/* Target handle */}
      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 bg-gray-400 border-2 border-white hover:bg-blue-500 transition-colors"
      />

      {/* Body */}
      <div className="px-4 py-3">
        <p className="text-sm text-gray-700 truncate">{displayText}</p>
      </div>

      {/* Source handle */}
      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 bg-gray-400 border-2 border-white hover:bg-blue-500 transition-colors"
      />
    </div>
  );
};

export default TextMessageNode;
