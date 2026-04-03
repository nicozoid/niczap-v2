/** @type {import('next').NextConfig} */
const nextConfig = {
  // Pin the Turbopack root to this directory so worktrees with their own
  // lockfile don't confuse workspace detection.
  turbopack: {
    root: process.cwd(),
  },
}

export default nextConfig
