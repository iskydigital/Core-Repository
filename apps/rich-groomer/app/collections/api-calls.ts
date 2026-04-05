import type { CollectionConfig } from 'payload'

export const ApiCalls: CollectionConfig = {
  slug: 'api-calls',
  admin: {
    useAsTitle: 'provider',
  },
  fields: [
    { name: 'client_id', type: 'text', required: true },
    { name: 'saas_id', type: 'text', required: true },
    { name: 'tenant_id', type: 'text', required: true },
    { name: 'provider', type: 'text', required: true },
    { name: 'feature', type: 'text', required: true },
    { name: 'model', type: 'text' },
    { name: 'input_tokens', type: 'number' },
    { name: 'output_tokens', type: 'number' },
    { name: 'duration_ms', type: 'number' },
    { name: 'cost_usd', type: 'number' },
    { name: 'outcome', type: 'select', options: ['success', 'fallback', 'error'] },
    { name: 'metadata', type: 'json' },
  ],
}
