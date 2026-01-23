import { pgTable, serial, text, jsonb, timestamp } from 'drizzle-orm/pg-core';

/**
 * Custom Drizzle Schema for "Agentic" features
 * This runs alongside Payload's own schema (managed separately)
 * Use this for AI-enhanced tables that need custom logic
 *
 * NOTE: Vector embeddings are commented out until pgvector extension is enabled in Supabase
 * To enable: Go to Supabase Dashboard > Database > Extensions > Enable "vector"
 */

export const leadAnalysis = pgTable('lead_analysis', {
  id: serial('id').primaryKey(),
  leadEmail: text('lead_email').notNull().unique(),
  companyUrl: text('company_url'),

  // AI-generated deep-dive analysis
  analysis: jsonb('analysis').$type<{
    brandVibe: string;
    missingGaps: string[];
    giantRecommendation: string;
    confidenceScore: number;
  }>(),

  // Vector embedding for semantic search (1536 dimensions for OpenAI text-embedding-3-small)
  // This allows matching leads to similar past case studies
  // TODO: Uncomment when pgvector extension is enabled in Supabase
  // embedding: vector('embedding', { dimensions: 1536 }),

  // Metadata
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export type LeadAnalysis = typeof leadAnalysis.$inferSelect;
export type NewLeadAnalysis = typeof leadAnalysis.$inferInsert;
