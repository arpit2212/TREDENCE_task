// Mock API service for automations and workflow simulation

export const getAutomations = async () => {
  // Simulate API delay
  await delay(500);

  return [
    {
      id: 'send_email',
      label: 'Send Email',
      params: ['to', 'subject', 'body'],
    },
    {
      id: 'generate_doc',
      label: 'Generate Document',
      params: ['template', 'recipient'],
    },
    {
      id: 'create_ticket',
      label: 'Create Support Ticket',
      params: ['title', 'priority', 'assignee'],
    },
    {
      id: 'send_slack',
      label: 'Send Slack Message',
      params: ['channel', 'message'],
    },
    {
      id: 'update_database',
      label: 'Update Database',
      params: ['table', 'record_id', 'fields'],
    },
    {
      id: 'generate_pdf',
      label: 'Generate PDF Report',
      params: ['template', 'data_source'],
    },
    {
      id: 'send_sms',
      label: 'Send SMS',
      params: ['phone_number', 'message'],
    },
  ];
};

export const simulateWorkflow = async (workflowData) => {
  // Simulate API delay
  await delay(1000);

  const { nodes, edges } = workflowData;
  const steps = [];
  const startTime = Date.now();

  // Find start node
  const startNode = nodes.find((node) => node.type === 'start');
  if (!startNode) {
    throw new Error('No start node found in workflow');
  }

  // Build execution order using BFS
  const executionOrder = buildExecutionOrder(startNode, nodes, edges);

  // Simulate execution of each node
  for (let i = 0; i < executionOrder.length; i++) {
    const node = executionOrder[i];
    await delay(300 + Math.random() * 400); // Random delay for realism

    const stepDuration = Math.floor(200 + Math.random() * 500);
    const step = {
      nodeId: node.id,
      nodeName: node.data.title || node.type,
      nodeType: node.type,
      status: 'completed',
      duration: stepDuration,
      message: getStepMessage(node),
    };

    steps.push(step);
  }

  const totalDuration = Date.now() - startTime;

  return {
    status: 'success',
    duration: totalDuration,
    steps,
    summary: {
      totalNodes: executionOrder.length,
      completedSteps: steps.length,
      failedSteps: 0,
    },
  };
};

// Helper function to build execution order using BFS
const buildExecutionOrder = (startNode, nodes, edges) => {
  const order = [];
  const visited = new Set();
  const queue = [startNode];

  // Build adjacency list
  const adjacencyList = {};
  nodes.forEach((node) => {
    adjacencyList[node.id] = [];
  });
  edges.forEach((edge) => {
    adjacencyList[edge.source].push(edge.target);
  });

  while (queue.length > 0) {
    const currentNode = queue.shift();

    if (visited.has(currentNode.id)) {
      continue;
    }

    visited.add(currentNode.id);
    order.push(currentNode);

    // Add connected nodes to queue
    const connectedNodeIds = adjacencyList[currentNode.id] || [];
    connectedNodeIds.forEach((nodeId) => {
      const nextNode = nodes.find((n) => n.id === nodeId);
      if (nextNode && !visited.has(nodeId)) {
        queue.push(nextNode);
      }
    });
  }

  return order;
};

// Generate appropriate messages for each node type
const getStepMessage = (node) => {
  const messages = {
    start: `Workflow initiated: ${node.data.title}`,
    task: `Task assigned to ${node.data.assignee || 'unassigned'}: ${node.data.title}`,
    approval: `Approval requested from ${node.data.approverRole || 'approver'}: ${node.data.title}`,
    automated: `Automated action executed: ${node.data.actionLabel || node.data.action || 'action'}`,
    end: `Workflow completed: ${node.data.endMessage || 'Success'}`,
  };

  return messages[node.type] || `Executed: ${node.data.title}`;
};

// Utility function for delay
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));