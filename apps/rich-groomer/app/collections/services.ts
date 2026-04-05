import type { CollectionConfig } from 'payload'

export const Services: CollectionConfig = {
  slug: 'services',
  admin: { useAsTitle: 'name' },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'description', type: 'textarea' },
    { name: 'price_range_low', type: 'number' },
    { name: 'price_range_high', type: 'number' },
    { name: 'duration_minutes', type: 'number' },
    { name: 'category', type: 'select', options: ['bath', 'groom', 'nail', 'teeth', 'addon'] },
  ],
}
