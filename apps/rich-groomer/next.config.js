import { withPayload } from '@payloadcms/next/withPayload'

/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: ['31.97.148.228'],
}

export default withPayload(nextConfig, {
  configPath: '/home/isky-digital/apps/rich-groomer/payload.config.ts',
})
