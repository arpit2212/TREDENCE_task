import React, { useState, useEffect } from 'react';
import Input from '../ui/Input';
import { useAutomations } from '../../hooks/useAutomations';

const AutomatedNodeForm = ({ node, updateNodeData }) => {
  const [title, setTitle] = useState(node.data.title || '');
  const [selectedAction, setSelectedAction] = useState(node.data.action || '');
  const [parameters, setParameters] = useState(node.data.parameters || {});
  const { automations, loading } = useAutomations();

  const handleChange = (field, value) => {
    updateNodeData(node.id, { [field]: value });
  };

  const handleActionChange = (actionId) => {
    setSelectedAction(actionId);
    const action = automations.find((a) => a.id === actionId);
    
    // Initialize empty parameters for the selected action
    const emptyParams = {};
    if (action) {
      action.params.forEach((param) => {
        emptyParams[param] = '';
      });
    }
    
    setParameters(emptyParams);
    updateNodeData(node.id, {
      action: actionId,
      actionLabel: action?.label || '',
      parameters: emptyParams,
    });
  };

  const handleParameterChange = (paramName, value) => {
    const updated = { ...parameters, [paramName]: value };
    setParameters(updated);
    handleChange('parameters', updated);
  };

  const selectedActionData = automations.find((a) => a.id === selectedAction);

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
          placeholder="Enter automation step title"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Action <span className="text-red-400">*</span>
        </label>
        {loading ? (
          <div className="text-gray-400 text-sm">Loading automations...</div>
        ) : (
          <select
            value={selectedAction}
            onChange={(e) => handleActionChange(e.target.value)}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
          >
            <option value="">Select an action</option>
            {automations.map((action) => (
              <option key={action.id} value={action.id}>
                {action.label}
              </option>
            ))}
          </select>
        )}
      </div>

      {selectedActionData && selectedActionData.params.length > 0 && (
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Action Parameters
          </label>
          <div className="space-y-3">
            {selectedActionData.params.map((param) => (
              <div key={param}>
                <label className="block text-xs text-gray-400 mb-1 capitalize">
                  {param.replace('_', ' ')}
                </label>
                <Input
                  type="text"
                  value={parameters[param] || ''}
                  onChange={(e) => handleParameterChange(param, e.target.value)}
                  placeholder={`Enter ${param}`}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {selectedActionData && (
        <div className="bg-orange-900/20 border border-orange-700 rounded-lg p-3">
          <h4 className="text-orange-300 font-semibold text-xs mb-2">
            Action Summary
          </h4>
          <div className="space-y-2 text-xs text-gray-400">
            <div className="flex justify-between">
              <span>Action:</span>
              <span className="text-white">{selectedActionData.label}</span>
            </div>
            <div className="flex justify-between">
              <span>Parameters:</span>
              <span className="text-white">{selectedActionData.params.length}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AutomatedNodeForm;