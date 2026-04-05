import type { CollectionConfig } from 'payload'

export const VoiceSessions: CollectionConfig = {
  slug: 'voice-sessions',
  admin: { useAsTitle: 'call_id' },
  fields: [
    { name: 'call_id', type: 'text', required: true },
    { name: 'client_id', type: 'text', required: true },
    { name: 'retell_agent_id', type: 'text' },
    { name: 'duration_seconds', type: 'number' },
    { name: 'outcome', type: 'select', options: ['booked', 'inquiry', 'missed', 'escalated'] },
    { name: 'transcript', type: 'textarea' },
    { name: 'cost_usd', type: 'number' },
    { name: 'after_hours', type: 'checkbox', defaultValue: false },
    { name: 'booking_attributed', type: 'checkbox', defaultValue: false },
  ],
}
