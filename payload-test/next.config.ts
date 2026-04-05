import type { NextConfig } from 'next'
import { withPayload } from '@payloadcms/next/withPayload'

const nextConfig: NextConfig = {
  allowedDevOrigins: ['31.97.148.228'],
}

export default withPayload(nextConfig)
