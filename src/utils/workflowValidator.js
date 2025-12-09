export const validateWorkflow = (nodes, edges) => {
  const errors = [];

  // Check if workflow is empty
  if (nodes.length === 0) {
    errors.push({
      type: 'error',
      message: 'Workflow is empty. Add at least one node.',
    });
    return errors;
  }

  // Check for start node
  const startNodes = nodes.filter((node) => node.type === 'start');
  if (startNodes.length === 0) {
    errors.push({
      type: 'error',
      message: 'Workflow must have a Start node.',
    });
  } else if (startNodes.length > 1) {
    errors.push({
      type: 'warning',
      message: 'Workflow has multiple Start nodes. Only one is recommended.',
    });
  }

  // Check for end node
  const endNodes = nodes.filter((node) => node.type === 'end');
  if (endNodes.length === 0) {
    errors.push({
      type: 'error',
      message: 'Workflow must have an End node.',
    });
  }

  // Check for disconnected nodes
  const connectedNodeIds = new Set();
  edges.forEach((edge) => {
    connectedNodeIds.add(edge.source);
    connectedNodeIds.add(edge.target);
  });

  const disconnectedNodes = nodes.filter(
    (node) => !connectedNodeIds.has(node.id) && nodes.length > 1
  );

  if (disconnectedNodes.length > 0) {
    errors.push({
      type: 'warning',
      message: `${disconnectedNodes.length} node(s) are not connected to the workflow.`,
    });
  }

  // Check for cycles (simple detection)
  const hasCycle = detectCycle(nodes, edges);
  if (hasCycle) {
    errors.push({
      type: 'warning',
      message: 'Workflow may contain a cycle. This could cause infinite loops.',
    });
  }

  // Validate node data
  nodes.forEach((node) => {
    switch (node.type) {
      case 'start':
        if (!node.data.title) {
          errors.push({
            type: 'error',
            message: `Start node "${node.id}" is missing a title.`,
          });
        }
        break;
      case 'task':
        if (!node.data.title) {
          errors.push({
            type: 'error',
            message: `Task node "${node.id}" is missing a title.`,
          });
        }
        break;
      case 'approval':
        if (!node.data.title) {
          errors.push({
            type: 'error',
            message: `Approval node "${node.id}" is missing a title.`,
          });
        }
        if (!node.data.approverRole) {
          errors.push({
            type: 'warning',
            message: `Approval node "${node.id}" is missing an approver role.`,
          });
        }
        break;
      case 'automated':
        if (!node.data.title) {
          errors.push({
            type: 'error',
            message: `Automated node "${node.id}" is missing a title.`,
          });
        }
        if (!node.data.action) {
          errors.push({
            type: 'error',
            message: `Automated node "${node.id}" is missing an action.`,
          });
        }
        break;
      default:
        break;
    }
  });

  return errors;
};

// Simple cycle detection using DFS
const detectCycle = (nodes, edges) => {
  const graph = {};
  const visited = new Set();
  const recStack = new Set();

  // Build adjacency list
  nodes.forEach((node) => {
    graph[node.id] = [];
  });

  edges.forEach((edge) => {
    if (graph[edge.source]) {
      graph[edge.source].push(edge.target);
    }
  });

  const hasCycleUtil = (nodeId) => {
    visited.add(nodeId);
    recStack.add(nodeId);

    const neighbors = graph[nodeId] || [];
    for (const neighbor of neighbors) {
      if (!visited.has(neighbor)) {
        if (hasCycleUtil(neighbor)) {
          return true;
        }
      } else if (recStack.has(neighbor)) {
        return true;
      }
    }

    recStack.delete(nodeId);
    return false;
  };

  for (const nodeId of Object.keys(graph)) {
    if (!visited.has(nodeId)) {
      if (hasCycleUtil(nodeId)) {
        return true;
      }
    }
  }

  return false;
};