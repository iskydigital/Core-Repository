import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { Users } from '@isky/payload-config/collections/base/users'
import { Tenants } from '@isky/payload-config/collections/base/tenants'
import { ApiCalls } from '@isky/payload-config/collections/base/api-calls'
import { Suburbs } from './app/collections/suburbs'
import { Breeds } from './app/collections/breeds'
import { Services } from './app/collections/services'
import { PseoPages } from './app/collections/pseo-pages'
import { VoiceSessions } from './app/collections/voice-sessions'
import { Bookings } from './app/collections/bookings'

export default buildConfig({
  admin: {
    user: 'users',
  },
  collections: [
    Users,
    Tenants,
    ApiCalls,
    Suburbs,
    Breeds,
    Services,
    PseoPages,
    VoiceSessions,
    Bookings,
  ],
  editor: lexicalEditor({}),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: 'payload-types.ts',
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI || '',
    },
  }),
})
