import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { Users } from './app/collections/users'
import { Tenants } from './app/collections/tenants'
import { ApiCalls } from './app/collections/api-calls'
import { Suburbs } from './app/collections/suburbs'
import { Breeds } from './app/collections/breeds'
import { Services } from './app/collections/services'
import { PseoPages } from './app/collections/pseo-pages'
import { VoiceSessions } from './app/collections/voice-sessions'
import { Bookings } from './app/collections/bookings'

export default buildConfig({
  serverURL: 'http://31.97.148.228:3000',
  admin: {
    user: 'users',
    importMap: {
      baseDir: '/home/isky-digital/apps/rich-groomer',
    },
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
