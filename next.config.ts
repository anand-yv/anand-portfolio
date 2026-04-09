import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  experimental: {
    optimizePackageImports: [
      "lucide-react",
      "@radix-ui/react-separator",
      "@radix-ui/react-slot",
      "@radix-ui/react-dialog",
    ],
  },
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
};

export default nextConfig;
