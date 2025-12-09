import React from 'react';
import { Handle, Position } from 'reactflow';

const EndNode = ({ data, selected }) => {
  return (
    <div
      className={`px-6 py-4 rounded-lg border-2 ${
        selected ? 'border-red-400 shadow-red-500/50' : 'border-red-500'
      } bg-gradient-to-br from-red-900/50 to-red-800/30 backdrop-blur-sm shadow-lg min-w-[180px] transition-all`}
    >
      <div className="flex items-center gap-2 mb-1">
        <div className="w-3 h-3 rounded-full bg-red-400" />
        <div className="text-red-300 font-semibold text-xs uppercase tracking-wider">
          End
        </div>
      </div>
      <div className="text-white font-medium">
        {data.endMessage || 'Workflow Complete'}
      </div>
      {data.generateSummary && (
        <div className="text-gray-300 text-xs mt-2 flex items-center gap-1">
          <span>📋</span>
          <span>Summary enabled</span>
        </div>
      )}
      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 bg-red-400 border-2 border-gray-900"
      />
    </div>
  );
};

export default EndNode;