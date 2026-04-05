import type { CollectionConfig } from 'payload'

export const Breeds: CollectionConfig = {
  slug: 'breeds',
  admin: { useAsTitle: 'name' },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'coat_type', type: 'text' },
    { name: 'grooming_difficulty', type: 'select', options: ['easy', 'medium', 'hard'] },
    { name: 'grooming_frequency_weeks', type: 'number' },
    { name: 'seasonal_shedding', type: 'checkbox' },
    { name: 'temperament_notes', type: 'textarea' },
    { name: 'aseo_talking_points', type: 'textarea' },
  ],
}
