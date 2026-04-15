import { NextResponse } from "next/server"
import fs from "fs/promises"
import path from "path"

/** Dev-only API route: writes annotation data back to a TypeScript data file.
 *  Only available in development — returns 403 in production. */
export async function POST(req: Request) {
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json({ error: "Not available in production" }, { status: 403 })
  }

  const { dataFile, annotations } = await req.json()

  // dataFile is relative to project root, e.g. "data/comparisons/yareta-profile.ts"
  // Validate it's within data/comparisons/ to prevent arbitrary file writes
  if (!dataFile || !dataFile.startsWith("data/comparisons/") || !dataFile.endsWith(".ts")) {
    return NextResponse.json({ error: "Invalid data file path" }, { status: 400 })
  }

  const filePath = path.join(process.cwd(), dataFile)

  // Read the existing file to preserve the export name, src, alt, and retina fields
  const existing = await fs.readFile(filePath, "utf-8")

  // Extract the export variable name (e.g. "yaretaProfileComparison")
  const exportMatch = existing.match(/export const (\w+)/)
  if (!exportMatch) {
    return NextResponse.json({ error: "Could not find export in data file" }, { status: 400 })
  }
  const exportName = exportMatch[1]

  // Extract src, alt, and retina from the existing file via regex
  // (avoids importing the TS file at runtime)
  const beforeSrcMatch = existing.match(/before:\s*\{[^}]*src:\s*"([^"]+)"/)
  const beforeAltMatch = existing.match(/before:\s*\{[^}]*alt:\s*"([^"]+)"/)
  const afterBlock = existing.match(/after:\s*\{[^}]*src:\s*"([^"]+)"[^}]*alt:\s*"([^"]+)"/)
  const retinaMatch = existing.match(/retina:\s*(true|false)/)
  const dataFileMatch = existing.match(/dataFile:\s*"([^"]+)"/)

  const beforeSrc = beforeSrcMatch?.[1] ?? ""
  const beforeAlt = beforeAltMatch?.[1] ?? ""
  const afterSrc = afterBlock?.[1] ?? ""
  const afterAlt = afterBlock?.[2] ?? ""
  const retina = retinaMatch?.[1] === "true"

  // Format annotations as readable TypeScript
  const formatAnnotations = (anns: { id: string; x: number; y: number; label: string }[]) => {
    if (anns.length === 0) return "[]"
    const lines = anns.map(
      (a) => `      { id: "${a.id}", x: ${a.x}, y: ${a.y}, label: "${a.label.replace(/"/g, '\\"')}" },`
    )
    return `[\n${lines.join("\n")}\n    ]`
  }

  const formatLinkedPairs = (pairs: [string, string][]) => {
    if (!pairs || pairs.length === 0) return "[]"
    const lines = pairs.map(([b, a]) => `    ["${b}", "${a}"],`)
    return `[\n${lines.join("\n")}\n  ]`
  }

  const output = `import type { ComparisonData } from "@/components/project/before-after/types"

export const ${exportName}: ComparisonData = {
  before: {
    src: "${beforeSrc}",
    alt: "${beforeAlt}",
    annotations: ${formatAnnotations(annotations.before)},
  },
  after: {
    src: "${afterSrc}",
    alt: "${afterAlt}",
    annotations: ${formatAnnotations(annotations.after)},
  },
  linkedPairs: ${formatLinkedPairs(annotations.linkedPairs)},${retina ? "\n  retina: true," : ""}
  dataFile: "${dataFile}",
}
`

  await fs.writeFile(filePath, output, "utf-8")

  return NextResponse.json({ ok: true })
}
