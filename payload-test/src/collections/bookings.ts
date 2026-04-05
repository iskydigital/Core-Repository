import type { CollectionConfig } from 'payload'

export const Bookings: CollectionConfig = {
  slug: 'bookings',
  admin: { useAsTitle: 'booking_id' },
  fields: [
    { name: 'booking_id', type: 'text', required: true },
    { name: 'client_id', type: 'text', required: true },
    { name: 'pet_name', type: 'text' },
    { name: 'service', type: 'relationship', relationTo: 'services' },
    { name: 'attribution_source', type: 'select', options: ['voice', 'chat', 'pseo', 'direct', 'social'] },
    { name: 'revenue', type: 'number' },
    { name: 'booked_at', type: 'date' },
  ],
}
