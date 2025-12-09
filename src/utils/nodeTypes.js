import StartNode from '../components/nodes/StartNode';
import TaskNode from '../components/nodes/TaskNode';
import ApprovalNode from '../components/nodes/ApprovalNode';
import AutomatedNode from '../components/nodes/AutomatedNode';
import EndNode from '../components/nodes/EndNode';

export const nodeTypes = {
  start: StartNode,
  task: TaskNode,
  approval: ApprovalNode,
  automated: AutomatedNode,
  end: EndNode,
};