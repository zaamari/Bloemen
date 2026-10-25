import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    qualities: [75, 85],
  },
  async redirects() {
    return [{ source: "/", destination: "/nl", permanent: false }];
  },
};

export default nextConfig;
