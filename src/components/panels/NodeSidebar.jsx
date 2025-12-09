import React from 'react';
import { Play, CheckSquare, Zap, Square, StopCircle, Sparkles } from 'lucide-react';

const NodeSidebar = ({ nodes, setNodes, onAIAssistClick }) => {
  const nodeTemplates = [
    {
      type: 'start',
      label: 'Start Node',
      icon: Play,
      color: 'text-green-400',
      bgColor: 'bg-green-900/20 border-green-700',
    },
    {
      type: 'task',
      label: 'Task Node',
      icon: Square,
      color: 'text-blue-400',
      bgColor: 'bg-blue-900/20 border-blue-700',
    },
    {
      type: 'approval',
      label: 'Approval Node',
      icon: CheckSquare,
      color: 'text-purple-400',
      bgColor: 'bg-purple-900/20 border-purple-700',
    },
    {
      type: 'automated',
      label: 'Automated Node',
      icon: Zap,
      color: 'text-orange-400',
      bgColor: 'bg-orange-900/20 border-orange-700',
    },
    {
      type: 'end',
      label: 'End Node',
      icon: StopCircle,
      color: 'text-red-400',
      bgColor: 'bg-red-900/20 border-red-700',
    },
  ];

  const getDefaultNodeData = (type) => {
    const defaults = {
      start: { title: 'Start Workflow', metadata: {} },
      task: { title: 'New Task', description: '', assignee: '', dueDate: '', customFields: {} },
      approval: { title: 'Approval Required', approverRole: '', autoApproveThreshold: null },
      automated: { title: 'Automated Step', action: '', parameters: {}, actionLabel: '' },
      end: { endMessage: 'Workflow Complete', generateSummary: false },
    };
    return defaults[type] || {};
  };

  const onDragStart = (event, nodeType) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div className="w-64 bg-gray-900 border-r border-gray-800 p-4 overflow-y-auto">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-white mb-1">Workflow Designer</h2>
        <p className="text-sm text-gray-400">Drag nodes to canvas</p>
      </div>

      {/* AI Assistant Button */}
      <button
        onClick={onAIAssistClick}
        className="w-full mb-4 p-4 rounded-lg border-2 bg-gradient-to-r from-purple-900/30 to-pink-900/30 border-purple-500 hover:border-purple-400 hover:scale-105 transition-all cursor-pointer group"
      >
        <div className="flex items-center gap-3">
          <Sparkles className="text-purple-400 group-hover:scale-110 transition-transform animate-pulse" size={24} />
          <div className="text-left">
            <div className="text-white font-bold text-sm">AI Assistant</div>
            <div className="text-purple-300 text-xs">Generate workflows</div>
          </div>
        </div>
      </button>

      <div className="space-y-3">
        {nodeTemplates.map((template) => {
          const Icon = template.icon;
          return (
            <div
              key={template.type}
              draggable
              onDragStart={(e) => onDragStart(e, template.type)}
              className={`w-full p-4 rounded-lg border-2 ${template.bgColor} hover:scale-105 transition-transform cursor-grab active:cursor-grabbing group`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`${template.color} group-hover:scale-110 transition-transform`} size={24} />
                <div className="text-left">
                  <div className="text-white font-medium text-sm">{template.label}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 p-4 bg-gray-800 rounded-lg border border-gray-700">
        <h3 className="text-white font-semibold text-sm mb-2">Instructions</h3>
        <ul className="text-xs text-gray-400 space-y-1">
          <li>• Drag nodes to the canvas</li>
          <li>• Connect nodes by dragging handles</li>
          <li>• Click a node to edit it</li>
          <li>• Use AI Assistant for suggestions</li>
        </ul>
      </div>

      <div className="mt-4 p-3 bg-gradient-to-r from-blue-900/30 to-purple-900/30 rounded-lg border border-blue-700/50">
        <div className="text-white font-medium text-xs mb-1">Active Nodes</div>
        <div className="text-2xl font-bold text-blue-400">{nodes.length}</div>
      </div>
    </div>
  );
};

export default NodeSidebar;