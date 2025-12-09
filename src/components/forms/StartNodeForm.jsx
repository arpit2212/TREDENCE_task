import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';
import Input from '../ui/Input';

const StartNodeForm = ({ node, updateNodeData }) => {
  const [title, setTitle] = useState(node.data.title || '');
  const [metadata, setMetadata] = useState(node.data.metadata || {});
  const [newKey, setNewKey] = useState('');
  const [newValue, setNewValue] = useState('');

  const handleTitleChange = (e) => {
    const value = e.target.value;
    setTitle(value);
    updateNodeData(node.id, { title: value });
  };

  const addMetadata = () => {
    if (newKey && newValue) {
      const updated = { ...metadata, [newKey]: newValue };
      setMetadata(updated);
      updateNodeData(node.id, { metadata: updated });
      setNewKey('');
      setNewValue('');
    }
  };

  const removeMetadata = (key) => {
    const updated = { ...metadata };
    delete updated[key];
    setMetadata(updated);
    updateNodeData(node.id, { metadata: updated });
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Title <span className="text-red-400">*</span>
        </label>
        <Input
          type="text"
          value={title}
          onChange={handleTitleChange}
          placeholder="Enter start node title"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Metadata (Optional)
        </label>
        
        {Object.entries(metadata).length > 0 && (
          <div className="space-y-2 mb-3">
            {Object.entries(metadata).map(([key, value]) => (
              <div key={key} className="flex items-center gap-2 bg-gray-800 p-2 rounded border border-gray-700">
                <div className="flex-1">
                  <div className="text-xs text-gray-400">{key}</div>
                  <div className="text-sm text-white">{value}</div>
                </div>
                <button
                  onClick={() => removeMetadata(key)}
                  className="p-1 hover:bg-gray-700 rounded"
                >
                  <X size={14} className="text-gray-400" />
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="space-y-2">
          <Input
            type="text"
            value={newKey}
            onChange={(e) => setNewKey(e.target.value)}
            placeholder="Key"
          />
          <Input
            type="text"
            value={newValue}
            onChange={(e) => setNewValue(e.target.value)}
            placeholder="Value"
          />
          <button
            onClick={addMetadata}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm transition-colors"
          >
            <Plus size={16} />
            Add Metadata
          </button>
        </div>
      </div>
    </div>
  );
};

export default StartNodeForm;