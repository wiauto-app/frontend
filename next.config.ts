import type { NextConfig } from "next";

const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL;
const strapiRemote = strapiUrl
  ? (() => {
      const url = new URL(strapiUrl);
      return {
        protocol: url.protocol.replace(":", "") as "http" | "https",
        hostname: url.hostname,
        ...(url.port ? { port: url.port } : {}),
        pathname: "/uploads/**",
      };
    })()
  : null;

const nextConfig: NextConfig = {
  output: 'standalone',
  experimental:{
    optimizePackageImports: ['package-name'],
  },
  logging:{
    browserToTerminal:false
  },
  images: {
    qualities: [40,50,60,70,80, 90, 100],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "1337",
        pathname: "/uploads/**",
      },
      {
        protocol: "http",
        hostname: "localhost",
      },
      {
        protocol: "https",
        hostname: "media.wiauto.es",
      
      },
      ...(strapiRemote ? [strapiRemote] : []),
    ],
  },
};

export default nextConfig;
