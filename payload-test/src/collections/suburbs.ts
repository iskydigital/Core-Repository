import type { CollectionConfig } from 'payload'

export const Suburbs: CollectionConfig = {
  slug: 'suburbs',
  admin: {
    useAsTitle: 'name',
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'state', type: 'text', required: true },
    { name: 'zip_codes', type: 'array', fields: [{ name: 'zip', type: 'text' }] },
    { name: 'nearby_freeways', type: 'array', fields: [{ name: 'freeway', type: 'text' }] },
    { name: 'competitor_density', type: 'select', options: ['low', 'medium', 'high'] },
    { name: 'priority_score', type: 'number', defaultValue: 0 },
    { name: 'seasonal_context', type: 'textarea' },
    { name: 'local_signals_updated', type: 'date' },
  ],
}
