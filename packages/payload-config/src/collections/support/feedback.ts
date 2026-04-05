import type { CollectionConfig } from 'payload'

export const Feedback: CollectionConfig = {
  slug: 'feedback',
  admin: {
    useAsTitle: 'description',
  },
  fields: [
    { name: 'client_id', type: 'text', required: true },
    { name: 'saas_id', type: 'text', required: true },
    { name: 'page_url', type: 'text' },
    { name: 'feature', type: 'text' },
    { name: 'description', type: 'textarea', required: true },
    {
      name: 'severity',
      type: 'select',
      options: ['broken', 'confusing', 'suggestion'],
      required: true,
    },
    {
      name: 'status',
      type: 'select',
      options: ['open', 'reviewing', 'resolved', 'shipped'],
      defaultValue: 'open',
    },
    { name: 'screenshot', type: 'upload', relationTo: 'media' },
  ],
}
