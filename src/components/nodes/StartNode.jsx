import React from 'react';
import { Handle, Position } from 'reactflow';

const StartNode = ({ data, selected }) => {
  return (
    <div
      className={`px-6 py-4 rounded-lg border-2 ${
        selected ? 'border-green-400 shadow-green-500/50' : 'border-green-500'
      } bg-gradient-to-br from-green-900/50 to-green-800/30 backdrop-blur-sm shadow-lg min-w-[180px] transition-all`}
    >
      <div className="flex items-center gap-2 mb-1">
        <div className="w-3 h-3 rounded-full bg-green-400 animate-pulse" />
        <div className="text-green-300 font-semibold text-xs uppercase tracking-wider">
          Start
        </div>
      </div>
      <div className="text-white font-medium">
        {data.title || 'Start Workflow'}
      </div>
      {data.metadata && Object.keys(data.metadata).length > 0 && (
        <div className="mt-2 text-xs text-gray-400">
          {Object.keys(data.metadata).length} metadata field(s)
        </div>
      )}
      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 bg-green-400 border-2 border-gray-900"
      />
    </div>
  );
};

export default StartNode;