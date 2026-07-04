import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Don't bundle these packages — let Node.js load them natively.
  // This fixes pdfjs-dist's internal worker resolution in server routes.
  serverExternalPackages: ["pdfjs-dist", "pdf-parse"],
};

export default nextConfig;
