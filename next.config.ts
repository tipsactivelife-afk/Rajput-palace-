import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // On Vercel, serverless functions only get the node_modules that
  // Vercel's automatic Output File Tracing (OFT) detects as used. OFT
  // occasionally fails to trace ESM packages that rely on package.json
  // "exports" maps (like @supabase/supabase-js and its sub-packages:
  // auth-js, realtime-js, postgrest-js, storage-js, functions-js), even
  // though they're correctly listed in "dependencies" and statically
  // imported in the code. That produces
  // "ERR_MODULE_NOT_FOUND: Cannot find package '@supabase/supabase-js'"
  // at runtime in /var/task/server.mjs despite working locally.
  //
  // outputFileTracingIncludes forces Vercel to include the whole package
  // folder for every route, regardless of what OFT itself detects.
  outputFileTracingIncludes: {
    "/**": ["./node_modules/@supabase/**"],
  },
};

export default nextConfig;
