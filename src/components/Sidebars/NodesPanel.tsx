import React, { useState } from 'react';
import { MessageCircle, Save, AlertCircle } from 'lucide-react';
import { NodeCatalogItem } from '../../types/flow';
import { useFlowStore } from '../../state/useFlowStore';
import toast from 'react-hot-toast';

// Extensible node catalog
const NODE_CATALOG: NodeCatalogItem[] = [
  { type: 'textMessage', label: 'Message', icon: 'MessageCircle', defaultData: { text: 'New message' } },
];

const NodesPanel: React.FC = () => {
  const { save, validateBeforeSave } = useFlowStore();
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  const handleSave = async () => {
    const result = validateBeforeSave();
    if (!result.ok) {
      setError(result.reason);
      toast.error(result.reason);
      return;
    }
    try {
      setIsSaving(true);
      save();         // Persist (store may toast success)
      setError(null);
      // Removed success toast here to avoid duplicate "Flow saved" toasts
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="h-full w-full flex flex-col">
      {/* Header with Save */}
      <div className="sticky top-0 z-10 bg-white border-b">
        <div className="flex items-center justify-between px-4 py-3">
          <h2 className="text-sm font-semibold text-gray-800">Nodes Panel</h2>
          <button
            type="button"
            onClick={handleSave}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-blue-600 text-white text-sm
                       hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors"
            disabled={isSaving}
            aria-label="Save flow"
            title="Save Changes"
          >
            <Save className={`w-4 h-4 ${isSaving ? 'animate-spin' : ''}`} />
            <span>{isSaving ? 'Saving…' : 'Save'}</span>
          </button>
        </div>

        {error && (
          <div
            className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-700 text-xs"
            role="alert"
          >
            <AlertCircle className="w-4 h-4" />
            <span>{error}</span>
          </div>
        )}
      </div>

      {/* Body */}
      <div className="p-6 space-y-6 overflow-y-auto">
        <p className="text-sm text-gray-500">
          Drag and drop nodes onto the canvas to build your flow
        </p>

        {/* Node palette */}
        <div className="space-y-4">
          {NODE_CATALOG.map((node) => (
            <div
              key={node.type}
              draggable
              onDragStart={(e) => onDragStart(e, node.type)}
              className="cursor-grab select-none rounded-xl border border-blue-300 hover:border-blue-400 bg-white p-5
                         shadow-sm hover:shadow transition flex items-center gap-3"
              title="Drag to canvas"
              aria-label={`Drag ${node.label} node to canvas`}
            >
              <div className="p-2 rounded-full bg-blue-50 text-blue-600">
                <MessageCircle className="w-5 h-5" />
              </div>
              <div className="font-medium text-blue-700">{node.label}</div>
            </div>
          ))}
        </div>

        {/* Help card */}
        <div className="p-4 bg-gray-50 rounded-lg">
          <h3 className="text-sm font-medium text-gray-700 mb-2">How to use:</h3>
          <ul className="text-xs text-gray-600 space-y-1">
            <li>• Drag nodes from here to the canvas</li>
            <li>• Click a node to edit its properties</li>
            <li>• Connect nodes by dragging from handles</li>
            <li>• Each message can have only one outgoing connection</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default NodesPanel;
