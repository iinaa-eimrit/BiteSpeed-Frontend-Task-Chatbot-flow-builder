import React, { useMemo, useState } from 'react';
import { ArrowLeft, Save, Trash2, AlertCircle } from 'lucide-react';
import { useFlowStore } from '../../state/useFlowStore';
import type { TextNodeData } from '../../types/flow';
import toast from 'react-hot-toast';

/**
 * Settings panel for editing a single message node.
 */
const SettingsPanel: React.FC = () => {
  const {
    nodes,
    selectedNodeId,
    selectNode,
    upsertNodeData,
    save,
    validateBeforeSave,
    setNodes,
    setEdges,
  } = useFlowStore();

  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const selectedNode = useMemo(
    () => nodes.find((n) => n.id === selectedNodeId),
    [nodes, selectedNodeId]
  );

  if (!selectedNode) return null;

  const data = (selectedNode.data || {}) as TextNodeData;

  const handleSave = async () => {
    // Validate once; show ONLY error toast here to avoid duplicate success toasts.
    const result = validateBeforeSave();
    if (!result.ok) {
      setError(result.reason);
      toast.error(result.reason);
      return;
    }

    try {
      setIsSaving(true);
      save(); // store can show single success toast
      setError(null);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = () => {
    // One compact, styled confirm card with actions directly under the message.
    const id = toast.custom(
      (t) => (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Delete message confirmation"
          className={`w-[460px] max-w-[92vw] rounded-xl border border-gray-200 bg-white shadow-lg p-4 transition
                      ${t.visible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-1'}`}
        >
          <p className="text-sm text-gray-800">
            Are you sure you want to delete this message?
          </p>

          <div className="mt-3 flex justify-end gap-2">
            <button
              type="button"
              className="px-3 py-1.5 text-sm rounded-md bg-gray-200 text-gray-800 hover:bg-gray-300"
              onClick={() => toast.dismiss(id)}
              autoFocus
            >
              Cancel
            </button>
            <button
              type="button"
              className="px-3 py-1.5 text-sm rounded-md bg-red-600 text-white hover:bg-red-700"
              onClick={() => {
                const nodeId = selectedNode.id;
                setNodes((prev) => prev.filter((n) => n.id !== nodeId));
                setEdges((prev) => prev.filter((e) => e.source !== nodeId && e.target !== nodeId));
                selectNode(undefined);
                toast.dismiss(id);
                toast.success('Message deleted');
              }}
            >
              Delete
            </button>
          </div>
        </div>
      ),
      {
        duration: Infinity, // persist until action
        position: 'top-center',
      }
    );
  };

  return (
    <div className="h-full w-full flex flex-col">
      {/* Header with back, delete, and save */}
      <div className="sticky top-0 z-10 bg-white border-b">
        <div className="flex items-center justify-between px-4 py-3">
          <button
            type="button"
            onClick={() => selectNode(undefined)}
            className="inline-flex items-center gap-2 text-sm text-gray-700 hover:text-gray-900"
            aria-label="Back to Nodes Panel"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Message</span>
          </button>

          <div className="flex items-center gap-2">
            {/* Delete node */}
            <button
              type="button"
              onClick={handleDelete}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-red-600 text-white text-sm hover:bg-red-700 transition-colors"
              aria-label="Delete message"
            >
              <Trash2 className="w-4 h-4" />
              <span>Delete</span>
            </button>

            {/* Save flow */}
            <button
              type="button"
              onClick={handleSave}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-blue-600 text-white text-sm hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors"
              disabled={isSaving}
              aria-label="Save flow"
            >
              <Save className={`w-4 h-4 ${isSaving ? 'animate-spin' : ''}`} />
              <span>{isSaving ? 'Saving…' : 'Save'}</span>
            </button>
          </div>
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
      <div className="p-6 space-y-4 overflow-y-auto">
        <label htmlFor="messageText" className="text-sm font-medium text-gray-700">
          Text
        </label>
        <textarea
          id="messageText"
          className="w-full min-h-[140px] rounded-lg border border-gray-300 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
          value={data.text ?? ''}
          onChange={(e) => upsertNodeData(selectedNode.id, { text: e.target.value })}
          placeholder="Type a message…"
        />

        <div className="mt-2 p-3 bg-blue-50 rounded-lg">
          <h3 className="text-sm font-medium text-blue-700 mb-1">Connection Rules</h3>
          <ul className="text-xs text-blue-600 space-y-1">
            <li>• Can have multiple incoming connections</li>
            <li>• Can have only one outgoing connection</li>
            <li>• Drag from the right handle to connect</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SettingsPanel;
