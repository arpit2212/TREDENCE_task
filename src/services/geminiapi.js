// Gemini AI API Integration for Workflow Generation

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/models/gemini-1.5-flash';

// Helper to get API key from environment or parameter
const getApiKey = (providedKey) => {
  return providedKey || import.meta.env.VITE_GEMINI_API_KEY;
};

/**
 * Generate a complete workflow from a text description
 */
export const generateWorkflowWithAI = async (prompt, apiKey) => {
  const finalApiKey = getApiKey(apiKey);
  
  if (!finalApiKey) {
    throw new Error('Gemini API key is required. Please configure it in the AI Assistant panel or in your .env file.');
  }

  const systemPrompt = `You are an expert HR workflow designer. Generate a workflow based on the user's description.
  
Return ONLY a valid JSON object with this exact structure (no markdown, no code blocks, no extra text):
{
  "nodes": [
    {
      "id": "unique_id",
      "type": "start|task|approval|automated|end",
      "position": {"x": number, "y": number},
      "data": {
        // For start: { "title": string, "metadata": {} }
        // For task: { "title": string, "description": string, "assignee": string, "dueDate": string, "customFields": {} }
        // For approval: { "title": string, "approverRole": string, "autoApproveThreshold": number|null }
        // For automated: { "title": string, "action": string, "actionLabel": string, "parameters": {} }
        // For end: { "endMessage": string, "generateSummary": boolean }
      }
    }
  ],
  "edges": [
    {
      "id": "unique_edge_id",
      "source": "source_node_id",
      "target": "target_node_id",
      "type": "smoothstep",
      "animated": true
    }
  ]
}

Rules:
1. Always start with a "start" node and end with an "end" node
2. Position nodes in a logical flow (x: 0-800, y increases by 150-200 per level)
3. Create realistic node data based on the workflow type
4. Connect nodes sequentially with edges
5. Use appropriate node types for each step
6. For automated actions, use realistic action IDs like "send_email", "generate_doc", etc.
7. Return ONLY the JSON, no explanations or markdown`;

  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${finalApiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: `${systemPrompt}\n\nUser Request: ${prompt}`
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 2048,
        }
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Failed to generate workflow');
    }

    const data = await response.json();
    const generatedText = data.candidates[0]?.content?.parts[0]?.text;

    if (!generatedText) {
      throw new Error('No response from AI');
    }

    // Extract JSON from response (handle markdown code blocks)
    let jsonText = generatedText.trim();
    if (jsonText.startsWith('```json')) {
      jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    } else if (jsonText.startsWith('```')) {
      jsonText = jsonText.replace(/```\n?/g, '');
    }

    const workflow = JSON.parse(jsonText);

    // Validate workflow structure
    if (!workflow.nodes || !Array.isArray(workflow.nodes)) {
      throw new Error('Invalid workflow structure: missing nodes array');
    }

    // Ensure edges exist
    if (!workflow.edges) {
      workflow.edges = [];
    }

    return workflow;
  } catch (error) {
    console.error('Gemini API Error:', error);
    throw new Error(error.message || 'Failed to generate workflow with AI');
  }
};

/**
 * Improve an existing workflow
 */
export const improveWorkflowWithAI = async (currentWorkflow, apiKey) => {
  const finalApiKey = getApiKey(apiKey);
  
  if (!finalApiKey) {
    throw new Error('Gemini API key is required.');
  }

  const systemPrompt = `You are an expert HR workflow optimizer. Analyze the current workflow and improve it.

Current workflow:
${JSON.stringify(currentWorkflow, null, 2)}

Provide an improved version with:
1. Better node organization and positioning
2. Additional helpful nodes if missing critical steps
3. Improved node titles and descriptions
4. Better assignee suggestions
5. Optimized connections

Return ONLY a valid JSON object with the same structure as the input (nodes and edges arrays).`;

  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${finalApiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: systemPrompt }]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 2048,
        }
      })
    });

    if (!response.ok) {
      throw new Error('Failed to improve workflow');
    }

    const data = await response.json();
    const generatedText = data.candidates[0]?.content?.parts[0]?.text;

    // Extract JSON
    let jsonText = generatedText.trim();
    if (jsonText.startsWith('```json')) {
      jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    } else if (jsonText.startsWith('```')) {
      jsonText = jsonText.replace(/```\n?/g, '');
    }

    const improvedWorkflow = JSON.parse(jsonText);
    return improvedWorkflow;
  } catch (error) {
    console.error('Gemini API Error:', error);
    throw new Error('Failed to improve workflow with AI');
  }
};

/**
 * Get suggestions for next steps in the workflow
 */
export const suggestNextSteps = async (currentWorkflow, apiKey) => {
  const finalApiKey = getApiKey(apiKey);
  
  if (!finalApiKey) {
    throw new Error('Gemini API key is required.');
  }

  const systemPrompt = `You are an expert HR workflow consultant. Analyze this workflow and provide 3-5 specific suggestions for improvement or next steps.

Current workflow:
${JSON.stringify(currentWorkflow, null, 2)}

Provide suggestions as a JSON array of strings. Each suggestion should be specific and actionable.
Return ONLY a JSON array like: ["suggestion 1", "suggestion 2", "suggestion 3"]`;

  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${finalApiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: systemPrompt }]
          }
        ],
        generationConfig: {
          temperature: 0.8,
          maxOutputTokens: 1024,
        }
      })
    });

    if (!response.ok) {
      throw new Error('Failed to get suggestions');
    }

    const data = await response.json();
    const generatedText = data.candidates[0]?.content?.parts[0]?.text;

    // Extract JSON
    let jsonText = generatedText.trim();
    if (jsonText.startsWith('```json')) {
      jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    } else if (jsonText.startsWith('```')) {
      jsonText = jsonText.replace(/```\n?/g, '');
    }

    const suggestions = JSON.parse(jsonText);
    return Array.isArray(suggestions) ? suggestions : [suggestions];
  } catch (error) {
    console.error('Gemini API Error:', error);
    throw new Error('Failed to get AI suggestions');
  }
};