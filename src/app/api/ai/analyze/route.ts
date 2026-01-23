import { streamText } from 'ai';
import { deepseek, giantSystemPrompt } from '@/lib/ai-agent';
import { db, leadAnalysis } from '@/db';
import { eq } from 'drizzle-orm';

export const runtime = 'edge';

/**
 * AI Lead Analysis Endpoint
 *
 * POST /api/ai/analyze
 * Body: { email: string, companyUrl: string }
 *
 * This endpoint:
 * 1. Accepts a lead's email and company URL
 * 2. Uses DeepSeek to analyze the company website
 * 3. Generates brand vibe analysis and marketing gap recommendations
 * 4. Stores the analysis in the custom Drizzle table
 * 5. Streams the response back to the client
 */
export async function POST(req: Request) {
  try {
    const { email, companyUrl } = await req.json();

    if (!email || !companyUrl) {
      return new Response('Missing email or companyUrl', { status: 400 });
    }

    // Check if we already have an analysis for this lead
    const existing = await db
      .select()
      .from(leadAnalysis)
      .where(eq(leadAnalysis.leadEmail, email))
      .limit(1);

    if (existing.length > 0) {
      return Response.json({
        cached: true,
        analysis: existing[0].analysis,
      });
    }

    // Stream AI analysis
    const result = streamText({
      model: deepseek('deepseek-chat'),
      system: giantSystemPrompt,
      messages: [
        {
          role: 'user',
          content: `Analyze this company website: ${companyUrl}

          Please provide:
          1. Brand vibe (1-2 sentences about their overall aesthetic and positioning)
          2. 3-5 specific marketing gaps or opportunities you notice
          3. Your recommendation for which services would help them most
          4. A confidence score (0-100) for your recommendations

          Format your response as JSON.`,
        },
      ],
      temperature: 0.7,
      maxTokens: 1000,
    });

    // Parse the streamed result
    const fullText = await result.text;
    let analysisData;

    try {
      // Try to extract JSON from the response
      const jsonMatch = fullText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        analysisData = JSON.parse(jsonMatch[0]);
      } else {
        // Fallback structure
        analysisData = {
          brandVibe: 'Unable to fully analyze',
          missingGaps: ['Analysis incomplete'],
          giantRecommendation: fullText,
          confidenceScore: 50,
        };
      }
    } catch (parseError) {
      analysisData = {
        brandVibe: 'Analysis in progress',
        missingGaps: ['Parsing incomplete'],
        giantRecommendation: fullText,
        confidenceScore: 50,
      };
    }

    // Store in database
    await db.insert(leadAnalysis).values({
      leadEmail: email,
      companyUrl,
      analysis: analysisData,
      // Note: embedding generation would happen here with OpenAI's API
      // embedding: await generateEmbedding(fullText),
    });

    return Response.json({
      success: true,
      analysis: analysisData,
    });
  } catch (error) {
    console.error('AI Analysis error:', error);
    return new Response('Analysis failed', { status: 500 });
  }
}
