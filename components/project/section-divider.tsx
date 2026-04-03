// SectionDivider creates a visual chapter break between groups of ContentSections.
// It reuses the same centered-text-between-rules pattern from NextProject.
// Use it when a page has major thematic groups (e.g. "UX thinking", "Designcraft learnings").
export function SectionDivider({
  label,
  id,
}: {
  label: string
  /** Optional HTML id for in-page anchor linking (e.g. id="designcraft-learnings") */
  id?: string
}) {
  return (
    <div className="my-20 flex items-center gap-4" id={id}>
      <div className="flex-1 border-t border-foreground/40" />
      <h2 className="text-2xl font-medium whitespace-nowrap">{label}</h2>
      <div className="flex-1 border-t border-foreground/40" />
    </div>
  )
}
