import React from 'react';
import { Handle, Position } from 'reactflow';

const TaskNode = ({ data, selected }) => {
  return (
    <div
      className={`px-6 py-4 rounded-lg border-2 ${
        selected ? 'border-blue-400 shadow-blue-500/50' : 'border-blue-500'
      } bg-gradient-to-br from-blue-900/50 to-blue-800/30 backdrop-blur-sm shadow-lg min-w-[180px] transition-all`}
    >
      <div className="text-blue-300 font-semibold text-xs mb-1 uppercase tracking-wider">
        Task
      </div>
      <div className="text-white font-medium mb-1">
        {data.title || 'New Task'}
      </div>
      {data.assignee && (
        <div className="text-gray-300 text-xs flex items-center gap-1">
          <span>👤</span>
          <span>{data.assignee}</span>
        </div>
      )}
      {data.dueDate && (
        <div className="text-gray-300 text-xs flex items-center gap-1 mt-1">
          <span>📅</span>
          <span>{data.dueDate}</span>
        </div>
      )}
      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 bg-blue-400 border-2 border-gray-900"
      />
      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 bg-blue-400 border-2 border-gray-900"
      />
    </div>
  );
};

export default TaskNode;