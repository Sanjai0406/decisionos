import { AIConfig } from '../types';

interface AIRequest {
  prompt: string;
  context?: string;
  config?: AIConfig;
}

interface AIResponse {
  content: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

export async function callAI(request: AIRequest): Promise<AIResponse> {
  const apiKey = process.env.EXPO_PUBLIC_AI_API_KEY;
  const baseUrl = process.env.EXPO_PUBLIC_AI_BASE_URL || 'https://api.openai.com/v1';
  const model = process.env.EXPO_PUBLIC_AI_MODEL || 'gpt-4-turbo';
  
  if (!apiKey || apiKey === 'YOUR_API_KEY') {
    // Return mock response for demo
    return {
      content: generateMockResponse(request.prompt),
    };
  }
  
  try {
    const response = await fetch(`${baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: [
          {
            role: 'system',
            content: getSystemPrompt(),
          },
          {
            role: 'user',
            content: request.context 
              ? `Context: ${request.context}\n\nQuestion: ${request.prompt}`
              : request.prompt,
          },
        ],
        temperature: request.config?.temperature || 0.7,
        max_tokens: request.config?.maxTokens || 2000,
      }),
    });
    
    const data = await response.json();
    
    return {
      content: data.choices[0].message.content,
      usage: {
        promptTokens: data.usage?.prompt_tokens || 0,
        completionTokens: data.usage?.completion_tokens || 0,
        totalTokens: data.usage?.total_tokens || 0,
      },
    };
  } catch (error) {
    console.error('AI API Error:', error);
    return {
      content: generateMockResponse(request.prompt),
    };
  }
}

function getSystemPrompt(): string {
  return `You are DecisionOS, an AI Decision Copilot. Your role is to HELP users make decisions, not make decisions for them.

CORE PRINCIPLES:
1. Always distinguish between FACTS, ASSUMPTIONS, USER PREFERENCES, ESTIMATES, and UNCERTAINTIES
2. Never present assumptions as facts
3. Never fabricate sources, specifications, or evidence
4. Support the user's agency in decision-making
5. Identify missing information that could change the decision
6. Be transparent about confidence levels and limitations

RESPONSE FORMAT:
- Use clear headings and bullet points
- Highlight trade-offs explicitly
- Ask clarifying questions when needed
- Provide structured analysis when comparing options
- Always indicate the type of information (fact/assumption/estimate)

Remember: You are helping the user understand their decision, not making the decision for them.`;
}

function generateMockResponse(prompt: string): string {
  const lower = prompt.toLowerCase();
  
  if (lower.includes('risk')) {
    return `Based on my analysis, here are the key risks to consider:

**Financial Risks:**
- Price fluctuations in the market (Assumption)
- Potential hidden costs like accessories or warranties (Estimate)

**Reliability Risks:**
- Long-term durability varies by brand (Fact)
- Software support timelines differ (Fact)

**Opportunity Cost:**
- Choosing one option means forgoing benefits from alternatives (Analysis)

Would you like me to elaborate on any specific risk category?`;
  }
  
  if (lower.includes('compare')) {
    return `Here's a structured comparison:

**Option A:**
- ✅ Superior camera quality
- ✅ Better battery endurance
- ⚠️ Higher price point
- ❌ Average gaming performance

**Option B:**
- ✅ Best value for money
- ✅ Strong performance
- ⚠️ Brand perception varies
- ❌ Software experience concerns

**Option C:**
- ✅ Balanced specifications
- ✅ Premium design
- ⚠️ Average camera
- ❌ Smaller battery

Which aspect would you like me to analyze in more detail?`;
  }
  
  return `I understand you're working on this decision. Let me help you analyze it systematically.

**Key Factors to Consider:**
1. Your priorities and how they rank
2. Trade-offs between options
3. Risks and uncertainties
4. Missing information that could change the outcome

What specific aspect would you like to explore first?`;
}

// Prompt templates for different analysis types
export const promptTemplates = {
  decisionAnalyzer: (context: string) => `
Analyze this decision request:
"${context}"

Provide:
1. Decision Category
2. Decision Goal
3. Key Constraints
4. Potential Alternatives
5. Missing Information
6. Important Factors to Consider
`,
  
  priorityDiscovery: (context: string) => `
Based on this decision context:
"${context}"

Help discover priorities by:
1. Identifying what matters most
2. Suggesting priority weights
3. Highlighting potential conflicts
4. Asking clarifying questions
`,
  
  tradeOffAnalysis: (options: string[], priorities: string[]) => `
Compare these options:
${options.map((o, i) => `${i + 1}. ${o}`).join('\n')}

Based on these priorities:
${priorities.map((p, i) => `${i + 1}. ${p}`).join('\n')}

Provide:
1. Gains for each option
2. Losses/Sacrifices for each option
3. Key trade-offs
`,
  
  riskAnalysis: (context: string) => `
Analyze risks for this decision:
"${context}"

Identify risks in these categories:
- Financial Risk
- Compatibility Risk
- Reliability Risk
- Time Risk
- Privacy Risk
- Lock-in Risk
- Availability Risk
- Opportunity Cost

For each risk, provide:
- Risk description
- Reason
- Evidence type (Fact/Assumption/Estimate)
- Potential impact
- Uncertainty level
`,
  
  devilAdvocate: (currentChoice: string) => `
Challenge this current thinking:
"${currentChoice}"

Provide:
1. What assumption might be wrong?
2. What is being overlooked?
3. What would a skeptic say?
4. Is this actually important to the original goal?
`,
  
  scenarioSimulation: (scenario: string, context: string) => `
Simulate this scenario: "${scenario}"
For decision: "${context}"

Explain:
1. How trade-offs change
2. Which option becomes more favorable
3. New risks to consider
4. Key assumptions in this scenario
`,
};
