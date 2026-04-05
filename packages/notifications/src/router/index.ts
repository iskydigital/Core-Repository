export type NotificationChannel = 'email' | 'push' | 'sms'
export type NotificationUrgency = 'low' | 'medium' | 'high' | 'critical'

export interface NotificationPayload {
  client_id: string
  subject: string
  body: string
  urgency: NotificationUrgency
  channels?: NotificationChannel[]
}

export function resolveChannels(urgency: NotificationUrgency): NotificationChannel[] {
  switch (urgency) {
    case 'critical': return ['email', 'push', 'sms']
    case 'high': return ['email', 'push']
    case 'medium': return ['email', 'push']
    case 'low': return ['email']
    default: return ['email']
  }
}
