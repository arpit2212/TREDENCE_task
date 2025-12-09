import React, { useState } from 'react';
import Input from '../ui/Input';

const ApprovalNodeForm = ({ node, updateNodeData }) => {
  const [title, setTitle] = useState(node.data.title || '');
  const [approverRole, setApproverRole] = useState(node.data.approverRole || '');
  const [autoApproveThreshold, setAutoApproveThreshold] = useState(
    node.data.autoApproveThreshold || ''
  );

  const handleChange = (field, value) => {
    updateNodeData(node.id, { [field]: value });
  };

  const approverRoles = [
    'Manager',
    'HRBP',
    'Director',
    'VP',
    'C-Level',
    'Department Head',
    'Team Lead',
  ];

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
          placeholder="Enter approval step title"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Approver Role <span className="text-red-400">*</span>
        </label>
        <select
          value={approverRole}
          onChange={(e) => {
            setApproverRole(e.target.value);
            handleChange('approverRole', e.target.value);
          }}
          className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
        >
          <option value="">Select approver role</option>
          {approverRoles.map((role) => (
            <option key={role} value={role}>
              {role}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Auto-Approve Threshold (Optional)
        </label>
        <Input
          type="number"
          value={autoApproveThreshold}
          onChange={(e) => {
            setAutoApproveThreshold(e.target.value);
            handleChange('autoApproveThreshold', e.target.value ? Number(e.target.value) : null);
          }}
          placeholder="e.g., 5000"
        />
        <p className="text-xs text-gray-500 mt-1">
          Requests below this amount will be auto-approved
        </p>
      </div>

      <div className="bg-purple-900/20 border border-purple-700 rounded-lg p-3">
        <h4 className="text-purple-300 font-semibold text-xs mb-2">
          Approval Configuration
        </h4>
        <div className="space-y-2 text-xs text-gray-400">
          <div className="flex justify-between">
            <span>Approver:</span>
            <span className="text-white">{approverRole || 'Not set'}</span>
          </div>
          {autoApproveThreshold && (
            <div className="flex justify-between">
              <span>Auto-approve:</span>
              <span className="text-white">&lt; {autoApproveThreshold}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ApprovalNodeForm;