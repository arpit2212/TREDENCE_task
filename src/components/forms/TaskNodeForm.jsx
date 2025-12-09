import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';
import Input from '../ui/Input';

const TaskNodeForm = ({ node, updateNodeData }) => {
  const [title, setTitle] = useState(node.data.title || '');
  const [description, setDescription] = useState(node.data.description || '');
  const [assignee, setAssignee] = useState(node.data.assignee || '');
  const [dueDate, setDueDate] = useState(node.data.dueDate || '');
  const [customFields, setCustomFields] = useState(node.data.customFields || {});
  const [newFieldKey, setNewFieldKey] = useState('');
  const [newFieldValue, setNewFieldValue] = useState('');

  const handleChange = (field, value) => {
    updateNodeData(node.id, { [field]: value });
  };

  const addCustomField = () => {
    if (newFieldKey && newFieldValue) {
      const updated = { ...customFields, [newFieldKey]: newFieldValue };
      setCustomFields(updated);
      updateNodeData(node.id, { customFields: updated });
      setNewFieldKey('');
      setNewFieldValue('');
    }
  };

  const removeCustomField = (key) => {
    const updated = { ...customFields };
    delete updated[key];
    setCustomFields(updated);
    updateNodeData(node.id, { customFields: updated });
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
          onChange={(e) => {
            setTitle(e.target.value);
            handleChange('title', e.target.value);
          }}
          placeholder="Enter task title"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Description
        </label>
        <textarea
          value={description}
          onChange={(e) => {
            setDescription(e.target.value);
            handleChange('description', e.target.value);
          }}
          placeholder="Enter task description"
          rows={3}
          className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Assignee
        </label>
        <Input
          type="text"
          value={assignee}
          onChange={(e) => {
            setAssignee(e.target.value);
            handleChange('assignee', e.target.value);
          }}
          placeholder="e.g., John Doe or HR Team"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Due Date
        </label>
        <Input
          type="date"
          value={dueDate}
          onChange={(e) => {
            setDueDate(e.target.value);
            handleChange('dueDate', e.target.value);
          }}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Custom Fields (Optional)
        </label>
        
        {Object.entries(customFields).length > 0 && (
          <div className="space-y-2 mb-3">
            {Object.entries(customFields).map(([key, value]) => (
              <div key={key} className="flex items-center gap-2 bg-gray-800 p-2 rounded border border-gray-700">
                <div className="flex-1">
                  <div className="text-xs text-gray-400">{key}</div>
                  <div className="text-sm text-white">{value}</div>
                </div>
                <button
                  onClick={() => removeCustomField(key)}
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
            value={newFieldKey}
            onChange={(e) => setNewFieldKey(e.target.value)}
            placeholder="Field name"
          />
          <Input
            type="text"
            value={newFieldValue}
            onChange={(e) => setNewFieldValue(e.target.value)}
            placeholder="Field value"
          />
          <button
            onClick={addCustomField}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm transition-colors"
          >
            <Plus size={16} />
            Add Custom Field
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskNodeForm;