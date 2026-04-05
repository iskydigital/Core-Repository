import type { CollectionConfig } from 'payload'

export const PseoPages: CollectionConfig = {
  slug: 'pseo-pages',
  admin: { useAsTitle: 'title' },
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'slug', type: 'text', required: true, unique: true },
    { name: 'suburb', type: 'relationship', relationTo: 'suburbs' },
    { name: 'breed', type: 'relationship', relationTo: 'breeds' },
    { name: 'service', type: 'relationship', relationTo: 'services' },
    { name: 'voice_id', type: 'select', options: ['DL01','FUN02','WTL03','EXP04','CON05','PWA06','PCP07','LI08'] },
    { name: 'content', type: 'richText' },
    { name: 'aseo_variant', type: 'textarea' },
    { name: 'meta_title', type: 'text' },
    { name: 'meta_description', type: 'text' },
    { name: 'performance_score', type: 'number', defaultValue: 0 },
    { name: 'indexation_status', type: 'select', options: ['indexed', 'crawled', 'not_indexed', 'unknown'], defaultValue: 'unknown' },
    { name: 'impressions_30d', type: 'number', defaultValue: 0 },
    { name: 'clicks_30d', type: 'number', defaultValue: 0 },
    { name: 'avg_position', type: 'number' },
    { name: 'clustering_risk_score', type: 'number', defaultValue: 0 },
    { name: 'last_refreshed', type: 'date' },
    { name: 'refresh_trigger', type: 'select', options: ['manual', 'auto', 'performance'] },
    { name: 'published', type: 'checkbox', defaultValue: false },
  ],
}
