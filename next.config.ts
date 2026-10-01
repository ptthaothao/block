import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "avatars.githubusercontent.com" },
      { protocol: "https", hostname: "*.supabase.co", pathname: "/storage/v1/object/public/**" },
    ],
  },
  // The CMS moved from /dashboard to /cms; keep old bookmarks and links working.
  async redirects() {
    return [{ source: "/dashboard/:path*", destination: "/cms/:path*", permanent: true }];
  },
};

export default nextConfig;
