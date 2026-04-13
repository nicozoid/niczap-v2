/** @type {import('next').NextConfig} */
const nextConfig = {
  // Pin the Turbopack root to this directory so worktrees with their own
  // lockfile don't confuse workspace detection.
  turbopack: {
    root: process.cwd(),
  },

  // Permanent redirects from old project URLs to new ones.
  // 308 status code tells search engines the move is permanent.
  async redirects() {
    return [
      { source: "/sylvera", destination: "/carbon-analytics", permanent: true },
      { source: "/dave", destination: "/data-product", permanent: true },
      { source: "/sigtech-app", destination: "/fintech-design", permanent: true },
    ]
  },
}

export default nextConfig
