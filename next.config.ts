import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Cloudflare Pages: emit a fully static site to /out — no Node server needed.
  output: "export",
  // <Image> isn't used today, but the default loader needs a Node runtime;
  // disabling optimization keeps a future <Image> import working under export.
  images: { unoptimized: true },
  // Generate /about/index.html instead of /about.html so Cloudflare's static
  // hosting serves clean URLs without redirects.
  trailingSlash: true,
};

export default nextConfig;
