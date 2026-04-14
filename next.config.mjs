import { resolve, dirname } from "path"
import { fileURLToPath } from "url"
import { readFileSync } from "fs"

// In a git worktree, node_modules lives in the main repo, not here.
// Read the .git file to find the real repo root so Turbopack can resolve packages.
const __dirname = dirname(fileURLToPath(import.meta.url))
function getRepoRoot() {
  try {
    const gitPath = resolve(__dirname, ".git")
    const content = readFileSync(gitPath, "utf8")
    // Worktree .git is a file like: "gitdir: /path/to/main/.git/worktrees/name"
    if (content.startsWith("gitdir:")) {
      const gitdir = content.replace("gitdir:", "").trim()
      // Walk up from .git/worktrees/<name> to the repo root
      return resolve(gitdir, "../../..")
    }
  } catch {
    // Not a worktree — fall through
  }
  return __dirname
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {
    root: getRepoRoot(),
  },
}

export default nextConfig
