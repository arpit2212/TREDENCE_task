import React, { useState, useCallback, useRef } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  addEdge,
  useNodesState,
  useEdgesState,
  MarkerType,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { Save, Upload, Trash2 } from 'lucide-react';

import NodeSidebar from '../components/panels/NodeSidebar';
import NodeEditPanel from '../components/panels/NodeEditPanel';
import TestPanel from '../components/panels/TestPanel';
import AIAssistantPanel from '../components/panels/AIAssistantPanel';
import { nodeTypes } from '../utils/nodeTypes';

let nodeId = 0;
const getId = () => `node_${nodeId++}`;

const WorkflowDesigner = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedNode, setSelectedNode] = useState(null);
  const [showTestPanel, setShowTestPanel] = useState(false);
  const [showAIPanel, setShowAIPanel] = useState(false);
  const reactFlowWrapper = useRef(null);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);

  const onConnect = useCallback(
    (params) => {
      const edge = {
        ...params,
        type: 'smoothstep',
        animated: true,
        style: { stroke: '#64748b', strokeWidth: 2 },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: '#64748b',
        },
      };
      setEdges((eds) => addEdge(edge, eds));
    },
    [setEdges]
  );

  const onNodeClick = useCallback((event, node) => {
    setSelectedNode(node);
  }, []);

  const onPaneClick = useCallback(() => {
    setSelectedNode(null);
  }, []);

  const updateNodeData = useCallback((nodeId, newData) => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === nodeId) {
          return { ...node, data: { ...node.data, ...newData } };
        }
        return node;
      })
    );
  }, [setNodes]);

  const deleteNode = useCallback(() => {
    if (selectedNode) {
      setNodes((nds) => nds.filter((node) => node.id !== selectedNode.id));
      setEdges((eds) => eds.filter(
        (edge) => edge.source !== selectedNode.id && edge.target !== selectedNode.id
      ));
      setSelectedNode(null);
    }
  }, [selectedNode, setNodes, setEdges]);

  const clearWorkflow = useCallback(() => {
    if (window.confirm('Are you sure you want to clear the entire workflow?')) {
      setNodes([]);
      setEdges([]);
      setSelectedNode(null);
    }
  }, [setNodes, setEdges]);

  const saveWorkflow = useCallback(() => {
    const workflow = {
      nodes,
      edges,
      metadata: {
        version: '1.0',
        createdAt: new Date().toISOString(),
      },
    };
    const dataStr = JSON.stringify(workflow, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `workflow-${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  }, [nodes, edges]);

  const loadWorkflow = useCallback((event) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const workflow = JSON.parse(e.target?.result);
          setNodes(workflow.nodes || []);
          setEdges(workflow.edges || []);
          setSelectedNode(null);
        } catch (error) {
          alert('Error loading workflow: ' + error.message);
        }
      };
      reader.readAsText(file);
    }
  }, [setNodes, setEdges]);

  // Drag and Drop handlers
  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

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

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();

      const type = event.dataTransfer.getData('application/reactflow');
      if (!type) return;

      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const newNode = {
        id: getId(),
        type,
        position,
        data: getDefaultNodeData(type),
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance, setNodes]
  );

  const handleAIGenerate = useCallback((generatedWorkflow) => {
    setNodes(generatedWorkflow.nodes || []);
    setEdges(generatedWorkflow.edges || []);
    setShowAIPanel(false);
  }, [setNodes, setEdges]);

  return (
    <div className="flex h-screen bg-gray-950">
      {/* Sidebar */}
      <NodeSidebar 
        nodes={nodes} 
        setNodes={setNodes}
        onAIAssistClick={() => setShowAIPanel(true)}
      />

      {/* Main Canvas */}
      <div className="flex-1 relative" ref={reactFlowWrapper}>
        {/* Top Toolbar */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 flex gap-2 bg-gray-900/90 backdrop-blur-sm px-4 py-2 rounded-lg border border-gray-700 shadow-xl">
          <button
            onClick={saveWorkflow}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            <Save size={16} />
            Save
          </button>
          <label className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors cursor-pointer">
            <Upload size={16} />
            Load
            <input
              type="file"
              accept=".json"
              onChange={loadWorkflow}
              className="hidden"
            />
          </label>
          <button
            onClick={() => setShowTestPanel(!showTestPanel)}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
          >
            Test Workflow
          </button>
          <button
            onClick={clearWorkflow}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
          >
            <Trash2 size={16} />
            Clear
          </button>
        </div>

        {/* React Flow Canvas */}
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={onNodeClick}
          onPaneClick={onPaneClick}
          onInit={setReactFlowInstance}
          onDrop={onDrop}
          onDragOver={onDragOver}
          nodeTypes={nodeTypes}
          fitView
          className="bg-gray-950"
        >
          <Background color="#1e293b" gap={16} size={1} />
          <Controls className="bg-gray-900 border-gray-700" />
          <MiniMap
            nodeColor={(node) => {
              const colors = {
                start: '#22c55e',
                task: '#3b82f6',
                approval: '#a855f7',
                automated: '#f97316',
                end: '#ef4444',
              };
              return colors[node.type] || '#64748b';
            }}
            className="bg-gray-900 border border-gray-700"
            maskColor="rgb(15, 23, 42, 0.8)"
          />
        </ReactFlow>
      </div>

      {/* Edit Panel */}
      {selectedNode && (
        <NodeEditPanel
          node={selectedNode}
          updateNodeData={updateNodeData}
          onClose={() => setSelectedNode(null)}
          onDelete={deleteNode}
        />
      )}

      {/* Test Panel */}
      {showTestPanel && (
        <TestPanel
          nodes={nodes}
          edges={edges}
          onClose={() => setShowTestPanel(false)}
        />
      )}

      {/* AI Assistant Panel */}
      {showAIPanel && (
        <AIAssistantPanel
          onClose={() => setShowAIPanel(false)}
          onGenerate={handleAIGenerate}
          currentNodes={nodes}
          currentEdges={edges}
        />
      )}
    </div>
  );
};

export default WorkflowDesigner;