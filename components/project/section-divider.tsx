// SectionDivider creates a visual chapter break between groups of ContentSections.
// It reuses the same centered-text-between-rules pattern from NextProject.
// Use it when a page has major thematic groups (e.g. "UX thinking", "Designcraft learnings").
export function SectionDivider({
  label,
  id,
  compact = false,
}: {
  label: string
  /** Optional HTML id for in-page anchor linking (e.g. id="designcraft-learnings") */
  id?: string
  /** When true, halves the bottom margin. Use when a SectionIntro follows
   *  directly — the intro provides its own spacing so the full gap is too much. */
  compact?: boolean
}) {
  return (
    <div className={`mt-20 ${compact ? "mb-13" : "mb-20"} flex items-center gap-4`} id={id}>
      <div className="flex-1 border-t border-foreground/40" />
      <h2 className="text-2xl font-medium whitespace-nowrap">{label}</h2>
      <div className="flex-1 border-t border-foreground/40" />
    </div>
  )
}
