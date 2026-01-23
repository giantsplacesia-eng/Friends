import type { NextConfig } from 'next';
import { withPayload } from '@payloadcms/next/withPayload';

const nextConfig: NextConfig = {
  experimental: {
    reactCompiler: false,
  },
  images: {
    domains: ['localhost'],
  },
};

export default withPayload(nextConfig);
