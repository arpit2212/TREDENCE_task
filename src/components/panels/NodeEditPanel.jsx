import React from 'react';
import { X, Trash2 } from 'lucide-react';
import StartNodeForm from '../forms/StartNodeForm';
import TaskNodeForm from '../forms/TaskNodeForm';
import ApprovalNodeForm from '../forms/ApprovalNodeForm';
import AutomatedNodeForm from '../forms/AutomatedNodeForm';
import EndNodeForm from '../forms/EndNodeForm';

const NodeEditPanel = ({ node, updateNodeData, onClose, onDelete }) => {
  const renderForm = () => {
    switch (node.type) {
      case 'start':
        return <StartNodeForm node={node} updateNodeData={updateNodeData} />;
      case 'task':
        return <TaskNodeForm node={node} updateNodeData={updateNodeData} />;
      case 'approval':
        return <ApprovalNodeForm node={node} updateNodeData={updateNodeData} />;
      case 'automated':
        return <AutomatedNodeForm node={node} updateNodeData={updateNodeData} />;
      case 'end':
        return <EndNodeForm node={node} updateNodeData={updateNodeData} />;
      default:
        return <div className="text-gray-400">No form available for this node type</div>;
    }
  };

  const getNodeTitle = () => {
    const titles = {
      start: 'Start Node',
      task: 'Task Node',
      approval: 'Approval Node',
      automated: 'Automated Node',
      end: 'End Node',
    };
    return titles[node.type] || 'Node';
  };

  const getNodeColor = () => {
    const colors = {
      start: 'border-green-500 bg-green-900/10',
      task: 'border-blue-500 bg-blue-900/10',
      approval: 'border-purple-500 bg-purple-900/10',
      automated: 'border-orange-500 bg-orange-900/10',
      end: 'border-red-500 bg-red-900/10',
    };
    return colors[node.type] || 'border-gray-500 bg-gray-900/10';
  };

  return (
    <div className="w-96 bg-gray-900 border-l border-gray-800 overflow-y-auto flex flex-col">
      {/* Header */}
      <div className={`p-4 border-b-2 ${getNodeColor()} flex items-center justify-between`}>
        <div>
          <h3 className="text-white font-bold text-lg">{getNodeTitle()}</h3>
          <p className="text-gray-400 text-xs mt-1">Configure node properties</p>
        </div>
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
        >
          <X className="text-gray-400" size={20} />
        </button>
      </div>

      {/* Form Content */}
      <div className="flex-1 p-4">
        {renderForm()}
      </div>

      {/* Footer Actions */}
      <div className="p-4 border-t border-gray-800 bg-gray-950">
        <button
          onClick={onDelete}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors font-medium"
        >
          <Trash2 size={16} />
          Delete Node
        </button>
      </div>
    </div>
  );
};

export default NodeEditPanel;