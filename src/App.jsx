import React, { useState, useCallback, useMemo } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  addEdge,
  useNodesState,
  useEdgesState,
  MarkerType,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { 
  Play, 
  Download, 
  Upload, 
  Circle, 
  CheckCircle, 
  UserCheck, 
  Zap, 
  XCircle,
  Trash2
} from 'lucide-react';

// Mock API Service
const mockApiService = {
  getAutomations: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          { id: "send_email", label: "Send Email", params: ["to", "subject", "body"] },
          { id: "generate_doc", label: "Generate Document", params: ["template", "recipient"] },
          { id: "create_ticket", label: "Create Ticket", params: ["title", "priority"] },
          { id: "notify_slack", label: "Notify Slack", params: ["channel", "message"] },
          { id: "update_database", label: "Update Database", params: ["table", "record_id", "fields"] }
        ]);
      }, 300);
    });
  },
  
  simulate: async (workflow) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const steps = [];
        const { nodes, edges } = workflow;
        
        // Find start node
        const startNode = nodes.find(n => n.type === 'startNode');
        if (!startNode) {
          resolve({ error: "No start node found", steps: [] });
          return;
        }
        
        // Simulate execution
        steps.push({
          nodeId: startNode.id,
          nodeName: startNode.data.label,
          status: 'completed',
          message: `Started workflow: ${startNode.data.config?.title || 'Untitled'}`
        });
        
        // Traverse the workflow
        let currentNodeId = startNode.id;
        let visited = new Set([currentNodeId]);
        let iterations = 0;
        const maxIterations = 20;
        
        while (iterations < maxIterations) {
          const outgoingEdge = edges.find(e => e.source === currentNodeId);
          if (!outgoingEdge) break;
          
          const nextNode = nodes.find(n => n.id === outgoingEdge.target);
          if (!nextNode || visited.has(nextNode.id)) break;
          
          visited.add(nextNode.id);
          currentNodeId = nextNode.id;
          
          const config = nextNode.data.config || {};
          let message = '';
          
          switch (nextNode.type) {
            case 'taskNode':
              message = `Task assigned to ${config.assignee || 'Unassigned'}: ${config.title || 'Untitled Task'}`;
              break;
            case 'approvalNode':
              message = `Approval required from ${config.approverRole || 'Approver'}: ${config.title || 'Untitled Approval'}`;
              break;
            case 'automatedNode':
              message = `Automated action executed: ${config.action?.label || 'No action'} with params: ${JSON.stringify(config.actionParams || {})}`;
              break;
            case 'endNode':
              message = `Workflow completed: ${config.endMessage || 'Done'}`;
              break;
            default:
              message = `Processed node: ${nextNode.data.label}`;
          }
          
          steps.push({
            nodeId: nextNode.id,
            nodeName: nextNode.data.label,
            status: 'completed',
            message
          });
          
          if (nextNode.type === 'endNode') break;
          iterations++;
        }
        
        resolve({ 
          success: true, 
          steps,
          summary: `Executed ${steps.length} steps successfully`
        });
      }, 1000);
    });
  }
};

// Custom Node Components
const nodeStyles = {
  base: "px-4 py-3 rounded-lg border-2 shadow-lg min-w-[180px] bg-gradient-to-br",
  handle: "w-3 h-3 !bg-blue-500 border-2 border-white"
};

const StartNode = ({ data, selected }) => (
  <div className={`${nodeStyles.base} ${selected ? 'border-blue-400 ring-2 ring-blue-400' : 'border-green-500'} from-green-900 to-green-800`}>
    <div className="flex items-center gap-2">
      <Circle className="w-5 h-5 text-green-400" />
      <div>
        <div className="font-bold text-white text-sm">Start</div>
        <div className="text-xs text-green-300">{data.config?.title || 'Begin Workflow'}</div>
      </div>
    </div>
    <div className={`absolute -right-1 top-1/2 -translate-y-1/2 ${nodeStyles.handle}`} />
  </div>
);

const TaskNode = ({ data, selected }) => (
  <div className={`${nodeStyles.base} ${selected ? 'border-blue-400 ring-2 ring-blue-400' : 'border-blue-500'} from-blue-900 to-blue-800`}>
    <div className="flex items-center gap-2">
      <CheckCircle className="w-5 h-5 text-blue-400" />
      <div>
        <div className="font-bold text-white text-sm">Task</div>
        <div className="text-xs text-blue-300">{data.config?.title || 'Untitled Task'}</div>
      </div>
    </div>
    <div className={`absolute -left-1 top-1/2 -translate-y-1/2 ${nodeStyles.handle}`} />
    <div className={`absolute -right-1 top-1/2 -translate-y-1/2 ${nodeStyles.handle}`} />
  </div>
);

const ApprovalNode = ({ data, selected }) => (
  <div className={`${nodeStyles.base} ${selected ? 'border-blue-400 ring-2 ring-blue-400' : 'border-purple-500'} from-purple-900 to-purple-800`}>
    <div className="flex items-center gap-2">
      <UserCheck className="w-5 h-5 text-purple-400" />
      <div>
        <div className="font-bold text-white text-sm">Approval</div>
        <div className="text-xs text-purple-300">{data.config?.title || 'Needs Approval'}</div>
      </div>
    </div>
    <div className={`absolute -left-1 top-1/2 -translate-y-1/2 ${nodeStyles.handle}`} />
    <div className={`absolute -right-1 top-1/2 -translate-y-1/2 ${nodeStyles.handle}`} />
  </div>
);

const AutomatedNode = ({ data, selected }) => (
  <div className={`${nodeStyles.base} ${selected ? 'border-blue-400 ring-2 ring-blue-400' : 'border-yellow-500'} from-yellow-900 to-yellow-800`}>
    <div className="flex items-center gap-2">
      <Zap className="w-5 h-5 text-yellow-400" />
      <div>
        <div className="font-bold text-white text-sm">Automated</div>
        <div className="text-xs text-yellow-300">{data.config?.title || 'Auto Step'}</div>
      </div>
    </div>
    <div className={`absolute -left-1 top-1/2 -translate-y-1/2 ${nodeStyles.handle}`} />
    <div className={`absolute -right-1 top-1/2 -translate-y-1/2 ${nodeStyles.handle}`} />
  </div>
);

const EndNode = ({ data, selected }) => (
  <div className={`${nodeStyles.base} ${selected ? 'border-blue-400 ring-2 ring-blue-400' : 'border-red-500'} from-red-900 to-red-800`}>
    <div className="flex items-center gap-2">
      <XCircle className="w-5 h-5 text-red-400" />
      <div>
        <div className="font-bold text-white text-sm">End</div>
        <div className="text-xs text-red-300">{data.config?.endMessage || 'Workflow Complete'}</div>
      </div>
    </div>
    <div className={`absolute -left-1 top-1/2 -translate-y-1/2 ${nodeStyles.handle}`} />
  </div>
);

// Node Configuration Forms
const StartNodeForm = ({ node, onUpdate }) => {
  const config = node.data.config || {};
  const [metadata, setMetadata] = useState(config.metadata || [{ key: '', value: '' }]);
  
  const handleMetadataChange = (index, field, value) => {
    const newMetadata = [...metadata];
    newMetadata[index][field] = value;
    setMetadata(newMetadata);
    onUpdate({ ...config, metadata: newMetadata });
  };
  
  const addMetadata = () => {
    const newMetadata = [...metadata, { key: '', value: '' }];
    setMetadata(newMetadata);
    onUpdate({ ...config, metadata: newMetadata });
  };
  
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">Start Title</label>
        <input
          type="text"
          value={config.title || ''}
          onChange={(e) => onUpdate({ ...config, title: e.target.value })}
          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:border-blue-500"
          placeholder="e.g., Employee Onboarding"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Metadata (Optional)</label>
        {metadata.map((item, index) => (
          <div key={index} className="flex gap-2 mb-2">
            <input
              type="text"
              value={item.key}
              onChange={(e) => handleMetadataChange(index, 'key', e.target.value)}
              placeholder="Key"
              className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white text-sm focus:outline-none focus:border-blue-500"
            />
            <input
              type="text"
              value={item.value}
              onChange={(e) => handleMetadataChange(index, 'value', e.target.value)}
              placeholder="Value"
              className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white text-sm focus:outline-none focus:border-blue-500"
            />
          </div>
        ))}
        <button
          onClick={addMetadata}
          className="text-sm text-blue-400 hover:text-blue-300"
        >
          + Add Metadata
        </button>
      </div>
    </div>
  );
};

const TaskNodeForm = ({ node, onUpdate }) => {
  const config = node.data.config || {};
  const [customFields, setCustomFields] = useState(config.customFields || [{ key: '', value: '' }]);
  
  const handleCustomFieldChange = (index, field, value) => {
    const newFields = [...customFields];
    newFields[index][field] = value;
    setCustomFields(newFields);
    onUpdate({ ...config, customFields: newFields });
  };
  
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">
          Title <span className="text-red-400">*</span>
        </label>
        <input
          type="text"
          value={config.title || ''}
          onChange={(e) => onUpdate({ ...config, title: e.target.value })}
          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:border-blue-500"
          placeholder="e.g., Collect Documents"
          required
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">Description</label>
        <textarea
          value={config.description || ''}
          onChange={(e) => onUpdate({ ...config, description: e.target.value })}
          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:border-blue-500"
          placeholder="Task description..."
          rows="3"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">Assignee</label>
        <input
          type="text"
          value={config.assignee || ''}
          onChange={(e) => onUpdate({ ...config, assignee: e.target.value })}
          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:border-blue-500"
          placeholder="e.g., HR Admin"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">Due Date</label>
        <input
          type="date"
          value={config.dueDate || ''}
          onChange={(e) => onUpdate({ ...config, dueDate: e.target.value })}
          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:border-blue-500"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Custom Fields</label>
        {customFields.map((field, index) => (
          <div key={index} className="flex gap-2 mb-2">
            <input
              type="text"
              value={field.key}
              onChange={(e) => handleCustomFieldChange(index, 'key', e.target.value)}
              placeholder="Field name"
              className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white text-sm focus:outline-none focus:border-blue-500"
            />
            <input
              type="text"
              value={field.value}
              onChange={(e) => handleCustomFieldChange(index, 'value', e.target.value)}
              placeholder="Value"
              className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white text-sm focus:outline-none focus:border-blue-500"
            />
          </div>
        ))}
        <button
          onClick={() => {
            const newFields = [...customFields, { key: '', value: '' }];
            setCustomFields(newFields);
            onUpdate({ ...config, customFields: newFields });
          }}
          className="text-sm text-blue-400 hover:text-blue-300"
        >
          + Add Custom Field
        </button>
      </div>
    </div>
  );
};

const ApprovalNodeForm = ({ node, onUpdate }) => {
  const config = node.data.config || {};
  
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">Title</label>
        <input
          type="text"
          value={config.title || ''}
          onChange={(e) => onUpdate({ ...config, title: e.target.value })}
          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:border-blue-500"
          placeholder="e.g., Manager Approval"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">Approver Role</label>
        <select
          value={config.approverRole || ''}
          onChange={(e) => onUpdate({ ...config, approverRole: e.target.value })}
          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:border-blue-500"
        >
          <option value="">Select role...</option>
          <option value="Manager">Manager</option>
          <option value="HRBP">HRBP</option>
          <option value="Director">Director</option>
          <option value="VP">VP</option>
          <option value="CEO">CEO</option>
        </select>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">Auto-approve Threshold</label>
        <input
          type="number"
          value={config.autoApproveThreshold || ''}
          onChange={(e) => onUpdate({ ...config, autoApproveThreshold: e.target.value })}
          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:border-blue-500"
          placeholder="e.g., 1000"
        />
        <p className="text-xs text-gray-400 mt-1">Auto-approve if value is below this threshold</p>
      </div>
    </div>
  );
};

const AutomatedNodeForm = ({ node, onUpdate }) => {
  const config = node.data.config || {};
  const [automations, setAutomations] = useState([]);
  const [loading, setLoading] = useState(true);
  
  React.useEffect(() => {
    mockApiService.getAutomations().then(data => {
      setAutomations(data);
      setLoading(false);
    });
  }, []);
  
  const selectedAction = config.action || null;
  const actionParams = config.actionParams || {};
  
  const handleActionChange = (actionId) => {
    const action = automations.find(a => a.id === actionId);
    onUpdate({ ...config, action, actionParams: {} });
  };
  
  const handleParamChange = (param, value) => {
    onUpdate({ 
      ...config, 
      actionParams: { ...actionParams, [param]: value }
    });
  };
  
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">Title</label>
        <input
          type="text"
          value={config.title || ''}
          onChange={(e) => onUpdate({ ...config, title: e.target.value })}
          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:border-blue-500"
          placeholder="e.g., Send Welcome Email"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">Action</label>
        {loading ? (
          <div className="text-gray-400 text-sm">Loading actions...</div>
        ) : (
          <select
            value={selectedAction?.id || ''}
            onChange={(e) => handleActionChange(e.target.value)}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:border-blue-500"
          >
            <option value="">Select an action...</option>
            {automations.map(action => (
              <option key={action.id} value={action.id}>{action.label}</option>
            ))}
          </select>
        )}
      </div>
      
      {selectedAction && selectedAction.params && (
        <div className="space-y-3 pt-2 border-t border-gray-600">
          <label className="block text-sm font-medium text-gray-300">Action Parameters</label>
          {selectedAction.params.map(param => (
            <div key={param}>
              <label className="block text-xs text-gray-400 mb-1 capitalize">{param}</label>
              <input
                type="text"
                value={actionParams[param] || ''}
                onChange={(e) => handleParamChange(param, e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white text-sm focus:outline-none focus:border-blue-500"
                placeholder={`Enter ${param}...`}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const EndNodeForm = ({ node, onUpdate }) => {
  const config = node.data.config || {};
  
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">End Message</label>
        <input
          type="text"
          value={config.endMessage || ''}
          onChange={(e) => onUpdate({ ...config, endMessage: e.target.value })}
          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:border-blue-500"
          placeholder="e.g., Onboarding Complete"
        />
      </div>
      
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="summaryFlag"
          checked={config.summaryFlag || false}
          onChange={(e) => onUpdate({ ...config, summaryFlag: e.target.checked })}
          className="w-4 h-4 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
        />
        <label htmlFor="summaryFlag" className="text-sm text-gray-300">
          Generate Summary Report
        </label>
      </div>
    </div>
  );
};

// Main Application
export default function WorkflowDesigner() {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedNode, setSelectedNode] = useState(null);
  const [showSimulator, setShowSimulator] = useState(false);
  const [simulationResult, setSimulationResult] = useState(null);
  const [simulating, setSimulating] = useState(false);
  
  const nodeTypes = useMemo(
    () => ({
      startNode: StartNode,
      taskNode: TaskNode,
      approvalNode: ApprovalNode,
      automatedNode: AutomatedNode,
      endNode: EndNode,
    }),
    []
  );
  
  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge({ ...params, type: 'smoothstep', markerEnd: { type: MarkerType.ArrowClosed } }, eds)),
    [setEdges]
  );
  
  const onNodeClick = useCallback((event, node) => {
    setSelectedNode(node);
  }, []);
  
  const onPaneClick = useCallback(() => {
    setSelectedNode(null);
  }, []);
  
  const addNode = (type) => {
    const nodeConfig = {
      startNode: { label: 'Start', icon: Circle, color: 'green' },
      taskNode: { label: 'Task', icon: CheckCircle, color: 'blue' },
      approvalNode: { label: 'Approval', icon: UserCheck, color: 'purple' },
      automatedNode: { label: 'Automated', icon: Zap, color: 'yellow' },
      endNode: { label: 'End', icon: XCircle, color: 'red' },
    };
    
    const config = nodeConfig[type];
    const id = `${type}-${Date.now()}`;
    
    const newNode = {
      id,
      type,
      position: { x: Math.random() * 400 + 100, y: Math.random() * 300 + 100 },
      data: { label: config.label, config: {} },
    };
    
    setNodes((nds) => [...nds, newNode]);
  };
  
  const updateNodeConfig = (nodeId, config) => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === nodeId) {
          return { ...node, data: { ...node.data, config } };
        }
        return node;
      })
    );
  };
  
  const deleteSelected = () => {
    if (selectedNode) {
      setNodes((nds) => nds.filter((node) => node.id !== selectedNode.id));
      setEdges((eds) => eds.filter((edge) => edge.source !== selectedNode.id && edge.target !== selectedNode.id));
      setSelectedNode(null);
    }
  };
  
  const exportWorkflow = () => {
    const workflow = { nodes, edges };
    const blob = new Blob([JSON.stringify(workflow, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'workflow.json';
    a.click();
  };
  
  const importWorkflow = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const workflow = JSON.parse(e.target.result);
          setNodes(workflow.nodes || []);
          setEdges(workflow.edges || []);
        } catch (error) {
          alert('Invalid workflow file');
        }
      };
      reader.readAsText(file);
    }
  };
  
  const runSimulation = async () => {
    setSimulating(true);
    setShowSimulator(true);
    setSimulationResult(null);
    
    const workflow = { nodes, edges };
    const result = await mockApiService.simulate(workflow);
    setSimulationResult(result);
    setSimulating(false);
  };
  
  const renderNodeForm = () => {
    if (!selectedNode) return null;
    
    const forms = {
      startNode: StartNodeForm,
      taskNode: TaskNodeForm,
      approvalNode: ApprovalNodeForm,
      automatedNode: AutomatedNodeForm,
      endNode: EndNodeForm,
    };
    
    const FormComponent = forms[selectedNode.type];
    if (!FormComponent) return null;
    
    return (
      <FormComponent
        node={selectedNode}
        onUpdate={(config) => updateNodeConfig(selectedNode.id, config)}
      />
    );
  };
  
  return (
    <div className="h-screen w-full bg-gray-900 flex flex-col">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 px-6 py-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">HR Workflow Designer</h1>
        <div className="flex items-center gap-3">
          <button
            onClick={runSimulation}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
          >
            <Play className="w-4 h-4" />
            Test Workflow
          </button>
          <button
            onClick={exportWorkflow}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            <Download className="w-4 h-4" />
            Export
          </button>
          <label className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg cursor-pointer transition-colors">
            <Upload className="w-4 h-4" />
            Import
            <input type="file" accept=".json" onChange={importWorkflow} className="hidden" />
          </label>
        </div>
      </div>
      
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar - Node Palette */}
        <div className="w-64 bg-gray-800 border-r border-gray-700 p-4 overflow-y-auto">
          <h2 className="text-lg font-semibold text-white mb-4">Node Palette</h2>
          <div className="space-y-3">
            {[
              { type: 'startNode', label: 'Start Node', icon: Circle, color: 'green' },
              { type: 'taskNode', label: 'Task Node', icon: CheckCircle, color: 'blue' },
              { type: 'approvalNode', label: 'Approval Node', icon: UserCheck, color: 'purple' },
              { type: 'automatedNode', label: 'Automated Step', icon: Zap, color: 'yellow' },
              { type: 'endNode', label: 'End Node', icon: XCircle, color: 'red' },
            ].map(({ type, label, icon: Icon }) => (
              <button
                key={type}
                onClick={() => addNode(type)}
                className="w-full flex items-center gap-3 px-4 py-3 bg-gray-700 hover:bg-gray-600 border border-gray-600 rounded-lg transition-colors text-white"
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{label}</span>
              </button>
            ))}
          </div>
          
          {selectedNode && (
            <button
              onClick={deleteSelected}
              className="w-full mt-4 flex items-center justify-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              Delete Selected
            </button>
          )}
        </div>
        
        {/* Canvas */}
        <div className="flex-1 relative">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeClick={onNodeClick}
            onPaneClick={onPaneClick}
            nodeTypes={nodeTypes}
            fitView
            className="bg-gray-900"
          >
            <Background color="#374151" gap={16} />
            <Controls className="bg-gray-800 border border-gray-700" />
            <MiniMap 
              nodeColor={(node) => {
                const colors = {
                  startNode: '#10b981',
                  taskNode: '#3b82f6',
                  approvalNode: '#a855f7',
                  automatedNode: '#eab308',
                  endNode: '#ef4444'
                };
                return colors[node.type] || '#6b7280';
              }}
              className="bg-gray-800 border border-gray-700"
            />
          </ReactFlow>
        </div>
        
        {/* Right Panel - Node Config */}
        {selectedNode && (
          <div className="w-80 bg-gray-800 border-l border-gray-700 p-6 overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white">Node Configuration</h2>
              <button
                onClick={() => setSelectedNode(null)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            <div className="mb-4 p-3 bg-gray-700 rounded-lg">
              <div className="text-sm text-gray-400">Node Type</div>
              <div className="text-white font-medium capitalize">
                {selectedNode.type.replace('Node', ' Node')}
              </div>
            </div>
            {renderNodeForm()}
          </div>
        )}
      </div>
      
      {/* Simulator Modal */}
      {showSimulator && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-white">Workflow Simulation</h2>
              <button
                onClick={() => setShowSimulator(false)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            
            {simulating ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                <div className="text-gray-300">Running simulation...</div>
              </div>
            ) : simulationResult ? (
              <div>
                {simulationResult.error ? (
                  <div className="bg-red-900 border border-red-700 rounded-lg p-4 mb-4">
                    <div className="text-red-300 font-medium">Error</div>
                    <div className="text-red-200">{simulationResult.error}</div>
                  </div>
                ) : (
                  <>
                    <div className="bg-green-900 border border-green-700 rounded-lg p-4 mb-4">
                      <div className="text-green-300 font-medium">Success</div>
                      <div className="text-green-200">{simulationResult.summary}</div>
                    </div>
                    
                    <div className="space-y-3">
                      <h3 className="text-lg font-semibold text-white">Execution Steps</h3>
                      {simulationResult.steps.map((step, index) => (
                        <div key={index} className="bg-gray-700 rounded-lg p-4">
                          <div className="flex items-start gap-3">
                            <div className="flex-shrink-0 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                              {index + 1}
                            </div>
                            <div className="flex-1">
                              <div className="text-white font-medium mb-1">{step.nodeName}</div>
                              <div className="text-gray-300 text-sm">{step.message}</div>
                              <div className="mt-2">
                                <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                                  step.status === 'completed' 
                                    ? 'bg-green-900 text-green-300' 
                                    : 'bg-yellow-900 text-yellow-300'
                                }`}>
                                  {step.status}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
}