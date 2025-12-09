import React, { useState } from 'react';
import { X, Play, CheckCircle, AlertCircle, Clock } from 'lucide-react';
import { simulateWorkflow } from '../../services/mockApi';
import { validateWorkflow } from '../../utils/workflowValidator';

const TestPanel = ({ nodes, edges, onClose }) => {
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState(null);
  const [validationErrors, setValidationErrors] = useState([]);

  const runTest = async () => {
    // Validate workflow first
    const errors = validateWorkflow(nodes, edges);
    setValidationErrors(errors);

    if (errors.length > 0) {
      return;
    }

    setIsRunning(true);
    setResults(null);

    // Simulate workflow execution
    try {
      const workflowData = { nodes, edges };
      const simulationResults = await simulateWorkflow(workflowData);
      setResults(simulationResults);
    } catch (error) {
      setValidationErrors([{ type: 'error', message: error.message }]);
    } finally {
      setIsRunning(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="text-green-400" size={16} />;
      case 'pending':
        return <Clock className="text-yellow-400" size={16} />;
      case 'error':
        return <AlertCircle className="text-red-400" size={16} />;
      default:
        return <Clock className="text-gray-400" size={16} />;
    }
  };

  return (
    <div className="fixed inset-y-0 right-0 w-96 bg-gray-900 border-l border-gray-800 shadow-2xl z-50 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-800 flex items-center justify-between bg-gradient-to-r from-purple-900/20 to-blue-900/20">
        <div>
          <h3 className="text-white font-bold text-lg">Workflow Testing</h3>
          <p className="text-gray-400 text-xs mt-1">Simulate and validate workflow</p>
        </div>
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
        >
          <X className="text-gray-400" size={20} />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {/* Workflow Stats */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-gray-800 rounded-lg p-3 border border-gray-700">
            <div className="text-gray-400 text-xs">Nodes</div>
            <div className="text-white text-2xl font-bold">{nodes.length}</div>
          </div>
          <div className="bg-gray-800 rounded-lg p-3 border border-gray-700">
            <div className="text-gray-400 text-xs">Connections</div>
            <div className="text-white text-2xl font-bold">{edges.length}</div>
          </div>
        </div>

        {/* Validation Errors */}
        {validationErrors.length > 0 && (
          <div className="mb-4 bg-red-900/20 border border-red-700 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="text-red-400" size={16} />
              <span className="text-red-400 font-semibold text-sm">Validation Errors</span>
            </div>
            <ul className="space-y-1">
              {validationErrors.map((error, idx) => (
                <li key={idx} className="text-red-300 text-xs">
                  • {error.message}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Simulation Results */}
        {results && (
          <div className="space-y-3">
            <div className="bg-gradient-to-r from-green-900/20 to-blue-900/20 border border-green-700 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="text-green-400" size={16} />
                <span className="text-green-400 font-semibold text-sm">Simulation Complete</span>
              </div>
              <div className="text-gray-300 text-xs">
                Executed {results.steps.length} steps in {results.duration}ms
              </div>
            </div>

            <div>
              <h4 className="text-white font-semibold text-sm mb-3">Execution Timeline</h4>
              <div className="space-y-2">
                {results.steps.map((step, idx) => (
                  <div
                    key={idx}
                    className="bg-gray-800 border border-gray-700 rounded-lg p-3"
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-1">{getStatusIcon(step.status)}</div>
                      <div className="flex-1">
                        <div className="text-white font-medium text-sm">
                          {step.nodeName}
                        </div>
                        <div className="text-gray-400 text-xs mt-1">
                          {step.message}
                        </div>
                        {step.duration && (
                          <div className="text-gray-500 text-xs mt-1">
                            ⏱ {step.duration}ms
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {results.summary && (
              <div className="bg-gray-800 border border-gray-700 rounded-lg p-3">
                <h4 className="text-white font-semibold text-sm mb-2">Summary</h4>
                <div className="text-gray-300 text-xs space-y-1">
                  <div>Total Duration: {results.duration}ms</div>
                  <div>Status: {results.status}</div>
                </div>
              </div>
            )}
          </div>
        )}

        {!results && validationErrors.length === 0 && !isRunning && (
          <div className="text-center py-12">
            <Play className="text-gray-600 mx-auto mb-3" size={48} />
            <p className="text-gray-400 text-sm">
              Click the button below to simulate the workflow
            </p>
          </div>
        )}

        {isRunning && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-700 border-t-purple-500 mx-auto mb-3"></div>
            <p className="text-gray-400 text-sm">Running simulation...</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-800 bg-gray-950">
        <button
          onClick={runTest}
          disabled={isRunning || nodes.length === 0}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white rounded-lg transition-colors font-medium"
        >
          {isRunning ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
              Running...
            </>
          ) : (
            <>
              <Play size={16} />
              Run Test
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default TestPanel;