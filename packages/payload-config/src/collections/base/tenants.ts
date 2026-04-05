import type { CollectionConfig } from 'payload'

export const Tenants: CollectionConfig = {
  slug: 'tenants',
  admin: {
    useAsTitle: 'name',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'saas_id',
      type: 'select',
      options: ['rich-groomer', 'travel-saas'],
      required: true,
    },
    {
      name: 'plan_tier',
      type: 'select',
      options: ['essential', 'professional', 'domination'],
      required: true,
    },
    {
      name: 'stripe_customer_id',
      type: 'text',
    },
    {
      name: 'status',
      type: 'select',
      options: ['active', 'inactive', 'churned'],
      defaultValue: 'active',
    },
  ],
}
