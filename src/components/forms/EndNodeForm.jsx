import React, { useState } from 'react';
import Input from '../ui/Input';

const EndNodeForm = ({ node, updateNodeData }) => {
  const [endMessage, setEndMessage] = useState(node.data.endMessage || '');
  const [generateSummary, setGenerateSummary] = useState(node.data.generateSummary || false);

  const handleChange = (field, value) => {
    updateNodeData(node.id, { [field]: value });
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          End Message
        </label>
        <Input
          type="text"
          value={endMessage}
          onChange={(e) => {
            setEndMessage(e.target.value);
            handleChange('endMessage', e.target.value);
          }}
          placeholder="e.g., Workflow completed successfully"
        />
        <p className="text-xs text-gray-500 mt-1">
          This message will be displayed when the workflow completes
        </p>
      </div>

      <div>
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={generateSummary}
            onChange={(e) => {
              setGenerateSummary(e.target.checked);
              handleChange('generateSummary', e.target.checked);
            }}
            className="w-4 h-4 text-red-600 bg-gray-800 border-gray-700 rounded focus:ring-red-500 focus:ring-2"
          />
          <div>
            <span className="text-sm font-medium text-gray-300">
              Generate Summary
            </span>
            <p className="text-xs text-gray-500">
              Create a summary report at workflow completion
            </p>
          </div>
        </label>
      </div>

      <div className="bg-red-900/20 border border-red-700 rounded-lg p-3">
        <h4 className="text-red-300 font-semibold text-xs mb-2">
          End Node Configuration
        </h4>
        <div className="space-y-2 text-xs text-gray-400">
          <div className="flex justify-between">
            <span>Message:</span>
            <span className="text-white">
              {endMessage || 'Workflow Complete'}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Summary:</span>
            <span className="text-white">
              {generateSummary ? 'Enabled' : 'Disabled'}
            </span>
          </div>
        </div>
      </div>

      <div className="bg-blue-900/20 border border-blue-700 rounded-lg p-3">
        <h4 className="text-blue-300 font-semibold text-xs mb-2">💡 Tip</h4>
        <p className="text-xs text-gray-400">
          The End node marks the completion of the workflow. Enable summary generation
          to get a detailed report of all executed steps.
        </p>
      </div>
    </div>
  );
};

export default EndNodeForm;