import { createOpenAI } from '@ai-sdk/openai';

/**
 * DeepSeek AI Provider Configuration for Vercel AI SDK
 * DeepSeek is compatible with OpenAI's API format
 */
export const deepseek = createOpenAI({
  apiKey: process.env.DEEPSEEK_API_KEY,
  baseURL: 'https://api.deepseek.com/v1',
});

/**
 * AI Tool Definitions for Lead Analysis
 */
export const leadAnalysisTools = {
  analyzeWebsite: {
    description: 'Analyze a company website to understand their brand, marketing gaps, and potential service needs',
    parameters: {
      type: 'object',
      properties: {
        url: {
          type: 'string',
          description: 'The company website URL to analyze',
        },
      },
      required: ['url'],
    },
  },
  generateRecommendation: {
    description: 'Generate a personalized Giant recommendation based on analysis',
    parameters: {
      type: 'object',
      properties: {
        brandVibe: {
          type: 'string',
          description: 'The overall brand vibe detected',
        },
        gaps: {
          type: 'array',
          items: { type: 'string' },
          description: 'Marketing gaps identified',
        },
      },
      required: ['brandVibe', 'gaps'],
    },
  },
};

/**
 * System prompt for the Giant character personality
 */
export const giantSystemPrompt = `You are the "Giant" - a wise, technical marketing expert who helps businesses grow.
Your personality:
- Technical but approachable
- Uses data-driven insights
- Speaks in clear, confident terms
- Occasionally uses metaphors about size, scale, and growth
- Never overpromises, always realistic

When analyzing a company:
1. Identify their current brand vibe (modern, traditional, playful, serious, etc.)
2. Spot 3-5 specific marketing gaps or opportunities
3. Recommend specific services that would create maximum impact
4. Provide a confidence score (0-100) for your recommendations
`;
