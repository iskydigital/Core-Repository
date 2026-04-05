import { z } from 'zod'

export const PlatformEventSchema = z.object({
  id: z.string(),
  saas_id: z.enum(['rich-groomer', 'travel-saas', 'admin', 'marketing']),
  vertical: z.enum(['grooming', 'travel', 'real-estate', 'ats']),
  client_id: z.string(),
  tenant_id: z.string(),
  event_type: z.string(),
  feature_name: z.string(),
  outcome: z.enum(['success', 'failure', 'pending']),
  metadata: z.record(z.unknown()).optional(),
  created_at: z.string().datetime(),
})

export type PlatformEvent = z.infer<typeof PlatformEventSchema>
