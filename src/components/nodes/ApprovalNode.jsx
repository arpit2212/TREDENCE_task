import React from 'react';
import { Handle, Position } from 'reactflow';

const ApprovalNode = ({ data, selected }) => {
  return (
    <div
      className={`px-6 py-4 rounded-lg border-2 ${
        selected ? 'border-purple-400 shadow-purple-500/50' : 'border-purple-500'
      } bg-gradient-to-br from-purple-900/50 to-purple-800/30 backdrop-blur-sm shadow-lg min-w-[180px] transition-all`}
    >
      <div className="text-purple-300 font-semibold text-xs mb-1 uppercase tracking-wider">
        Approval
      </div>
      <div className="text-white font-medium mb-1">
        {data.title || 'Approval Required'}
      </div>
      {data.approverRole && (
        <div className="text-gray-300 text-xs flex items-center gap-1">
          <span>✓</span>
          <span>{data.approverRole}</span>
        </div>
      )}
      {data.autoApproveThreshold && (
        <div className="text-gray-300 text-xs mt-1">
          Auto-approve: {data.autoApproveThreshold}
        </div>
      )}
      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 bg-purple-400 border-2 border-gray-900"
      />
      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 bg-purple-400 border-2 border-gray-900"
      />
    </div>
  );
};

export default ApprovalNode;