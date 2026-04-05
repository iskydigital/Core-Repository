import { z } from 'zod'

export const providers = [
  'anthropic',
  'gemini',
  'retell',
  'recraft',
  'perplexity',
  'resend',
  'onesignal',
  'twilio',
] as const

export type Provider = typeof providers[number]

export const CallContextSchema = z.object({
  client_id: z.string(),
  saas_id: z.enum(['rich-groomer', 'travel-saas', 'admin', 'marketing']),
  tenant_id: z.string(),
  feature: z.string(),
  model: z.string().optional(),
})

export type CallContext = z.infer<typeof CallContextSchema>

export async function callAPI(
  provider: Provider,
  payload: unknown,
  context: CallContext
): Promise<unknown> {
  const validated = CallContextSchema.parse(context)

  const logEntry = {
    provider,
    ...validated,
    timestamp: new Date().toISOString(),
    status: 'pending',
  }

  console.log('[isky-gateway]', JSON.stringify(logEntry))

  // Provider routing happens here in sprint 2
  // Each provider gets its own handler module
  throw new Error(`Provider ${provider} handler not yet implemented`)
}
