import React, { useState } from 'react';
import { X, Sparkles, Wand2, Lightbulb, RefreshCw } from 'lucide-react';
import { generateWorkflowWithAI, improveWorkflowWithAI, suggestNextSteps } from '../../services/geminiApi';

const AIAssistantPanel = ({ onClose, onGenerate, currentNodes, currentEdges }) => {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [suggestions, setSuggestions] = useState(null);
  const [error, setError] = useState(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError('Please enter a workflow description');
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      const workflow = await generateWorkflowWithAI(prompt);
      onGenerate(workflow);
      setPrompt('');
    } catch (err) {
      setError(err.message || 'Failed to generate workflow. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleImprove = async () => {
    if (currentNodes.length === 0) {
      setError('Please create a workflow first before asking for improvements');
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      const improved = await improveWorkflowWithAI({ nodes: currentNodes, edges: currentEdges });
      onGenerate(improved);
    } catch (err) {
      setError(err.message || 'Failed to improve workflow');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSuggest = async () => {
    if (currentNodes.length === 0) {
      setError('Please create a workflow first before asking for suggestions');
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      const suggestions = await suggestNextSteps({ nodes: currentNodes, edges: currentEdges });
      setSuggestions(suggestions);
    } catch (err) {
      setError(err.message || 'Failed to get suggestions');
      setSuggestions(null);
    } finally {
      setIsGenerating(false);
    }
  };

  const quickPrompts = [
    'Create an employee onboarding workflow',
    'Build a leave approval process',
    'Design a document verification workflow',
    'Create a performance review workflow',
    'Build an expense reimbursement process',
  ];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 rounded-xl border border-gray-700 shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-800 bg-gradient-to-r from-purple-900/30 to-pink-900/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-600 rounded-lg">
                <Sparkles className="text-white" size={24} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">AI Workflow Assistant</h2>
                <p className="text-sm text-gray-400 mt-1">Powered by Google Gemini</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
            >
              <X className="text-gray-400" size={20} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Error Display */}
          {error && (
            <div className="bg-red-900/20 border border-red-700 rounded-lg p-4">
              <p className="text-red-300 text-sm">{error}</p>
            </div>
          )}

          {/* Generate Workflow */}
          <div>
            <label className="block text-white font-semibold mb-3 flex items-center gap-2">
              <Wand2 size={18} />
              Generate Workflow from Description
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe the workflow you want to create... 
              
Example: 'Create an employee onboarding workflow that includes document collection, manager approval, IT setup, and HR orientation.'"
              rows={4}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm resize-none"
            />
            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="mt-3 w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-700 disabled:to-gray-700 disabled:cursor-not-allowed text-white rounded-lg transition-all font-medium"
            >
              {isGenerating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles size={16} />
                  Generate Workflow
                </>
              )}
            </button>
          </div>

          {/* Quick Prompts */}
          <div>
            <label className="block text-white font-semibold mb-3">Quick Start Templates</label>
            <div className="grid grid-cols-1 gap-2">
              {quickPrompts.map((quickPrompt, idx) => (
                <button
                  key={idx}
                  onClick={() => setPrompt(quickPrompt)}
                  className="text-left px-4 py-2 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg text-sm text-gray-300 transition-colors"
                >
                  {quickPrompt}
                </button>
              ))}
            </div>
          </div>

          {/* AI Actions for Existing Workflow */}
          {currentNodes.length > 0 && (
            <div className="border-t border-gray-800 pt-6">
              <label className="block text-white font-semibold mb-3">
                Enhance Current Workflow
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={handleImprove}
                  disabled={isGenerating}
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white rounded-lg transition-colors text-sm"
                >
                  <RefreshCw size={16} />
                  Improve Workflow
                </button>
                <button
                  onClick={handleSuggest}
                  disabled={isGenerating}
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white rounded-lg transition-colors text-sm"
                >
                  <Lightbulb size={16} />
                  Get Suggestions
                </button>
              </div>
            </div>
          )}

          {/* Suggestions Display */}
          {suggestions && (
            <div className="bg-gradient-to-br from-green-900/20 to-blue-900/20 border border-green-700 rounded-lg p-4">
              <h3 className="text-green-400 font-semibold text-sm mb-3 flex items-center gap-2">
                <Lightbulb size={16} />
                AI Suggestions
              </h3>
              <div className="space-y-2">
                {suggestions.map((suggestion, idx) => (
                  <div key={idx} className="text-sm text-gray-300 pl-4 border-l-2 border-green-500">
                    {suggestion}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-800 bg-gray-950">
          <p className="text-xs text-gray-500 text-center">
            AI-generated workflows are suggestions. Always review and customize them for your needs.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AIAssistantPanel;