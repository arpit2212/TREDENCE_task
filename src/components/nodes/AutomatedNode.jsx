import React from 'react';
import { Handle, Position } from 'reactflow';

const AutomatedNode = ({ data, selected }) => {
  return (
    <div
      className={`px-6 py-4 rounded-lg border-2 ${
        selected ? 'border-orange-400 shadow-orange-500/50' : 'border-orange-500'
      } bg-gradient-to-br from-orange-900/50 to-orange-800/30 backdrop-blur-sm shadow-lg min-w-[180px] transition-all`}
    >
      <div className="text-orange-300 font-semibold text-xs mb-1 uppercase tracking-wider">
        Automated
      </div>
      <div className="text-white font-medium mb-1">
        {data.title || 'Automated Step'}
      </div>
      {data.action && (
        <div className="text-gray-300 text-xs flex items-center gap-1">
          <span>⚡</span>
          <span>{data.actionLabel || data.action}</span>
        </div>
      )}
      {data.parameters && Object.keys(data.parameters).length > 0 && (
        <div className="text-gray-400 text-xs mt-1">
          {Object.keys(data.parameters).length} parameter(s)
        </div>
      )}
      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 bg-orange-400 border-2 border-gray-900"
      />
      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 bg-orange-400 border-2 border-gray-900"
      />
    </div>
  );
};

export default AutomatedNode;