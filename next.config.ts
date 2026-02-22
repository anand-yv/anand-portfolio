import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  output: "export",
  experimental: {
    optimizePackageImports: [
      "lucide-react",
      "@radix-ui/react-separator",
      "@radix-ui/react-slot",
      "@radix-ui/react-dialog",
    ],
  },
  images: {
    unoptimized: true, // Required for static export
  },
  trailingSlash: true,
};

export default nextConfig;
