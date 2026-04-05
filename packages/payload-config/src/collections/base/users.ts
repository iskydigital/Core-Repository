import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  auth: true,
  admin: {
    useAsTitle: 'email',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'role',
      type: 'select',
      options: ['super-admin', 'admin', 'client', 'support'],
      required: true,
      defaultValue: 'client',
    },
    {
      name: 'tenant_id',
      type: 'text',
    },
    {
      name: 'client_id',
      type: 'text',
    },
  ],
}
