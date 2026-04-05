import { z } from 'zod'

export const UsageSummarySchema = z.object({
  client_id: z.string(),
  saas_id: z.string(),
  billing_cycle: z.string(),
  voice_minutes_used: z.number().default(0),
  voice_minutes_included: z.number().default(0),
  voice_overage_minutes: z.number().default(0),
  chat_conversations: z.number().default(0),
  pseo_pages_live: z.number().default(0),
  pseo_pages_indexed: z.number().default(0),
  api_cost_usd: z.number().default(0),
  threshold_50_fired: z.boolean().default(false),
  threshold_80_fired: z.boolean().default(false),
  threshold_95_fired: z.boolean().default(false),
  threshold_100_fired: z.boolean().default(false),
  updated_at: z.string().datetime(),
})

export type UsageSummary = z.infer<typeof UsageSummarySchema>
