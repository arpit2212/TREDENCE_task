import { useState, useCallback } from 'react';

export const useWorkflowState = () => {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [selectedNode, setSelectedNode] = useState(null);

  const addNode = useCallback((nodeData) => {
    setNodes((prevNodes) => [...prevNodes, nodeData]);
  }, []);

  const updateNode = useCallback((nodeId, updates) => {
    setNodes((prevNodes) =>
      prevNodes.map((node) =>
        node.id === nodeId ? { ...node, ...updates } : node
      )
    );
  }, []);

  const deleteNode = useCallback((nodeId) => {
    setNodes((prevNodes) => prevNodes.filter((node) => node.id !== nodeId));
    setEdges((prevEdges) =>
      prevEdges.filter(
        (edge) => edge.source !== nodeId && edge.target !== nodeId
      )
    );
    if (selectedNode?.id === nodeId) {
      setSelectedNode(null);
    }
  }, [selectedNode]);

  const addEdge = useCallback((edgeData) => {
    setEdges((prevEdges) => [...prevEdges, edgeData]);
  }, []);

  const deleteEdge = useCallback((edgeId) => {
    setEdges((prevEdges) => prevEdges.filter((edge) => edge.id !== edgeId));
  }, []);

  const clearWorkflow = useCallback(() => {
    setNodes([]);
    setEdges([]);
    setSelectedNode(null);
  }, []);

  const loadWorkflow = useCallback((workflowData) => {
    setNodes(workflowData.nodes || []);
    setEdges(workflowData.edges || []);
    setSelectedNode(null);
  }, []);

  return {
    nodes,
    edges,
    selectedNode,
    setNodes,
    setEdges,
    setSelectedNode,
    addNode,
    updateNode,
    deleteNode,
    addEdge,
    deleteEdge,
    clearWorkflow,
    loadWorkflow,
  };
};  