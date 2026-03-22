// ContentSection is the workhorse component used for every text block on a project page.
// It creates a two-column layout: a short label on the left (~1/3 width) and
// the content on the right (~2/3 width). On mobile they stack vertically.
export function ContentSection({
  label,
  children,
}: {
  label: string
  // children can be anything: <p>, <ul>, <ol>, <strong>, etc.
  children: React.ReactNode
}) {
  return (
    // my-12 creates consistent vertical rhythm between sections on the page.
    // flex-col on mobile → flex-row on md+
    <div className="flex flex-col md:flex-row gap-8 my-12">

      {/* Left column: the section label.
          md:flex-1 means it takes 1 "share" of available horizontal space (= ~1/3).
          shrink-0 prevents it from collapsing when the content column is wide. */}
      <div className="md:flex-1 shrink-0">
        <h2 className="text-2xl font-medium leading-snug">{label}</h2>
      </div>

      {/* Right column: the actual content.
          md:flex-[2] means it takes 2 shares (= ~2/3 width).
          prose-content (defined in globals.css) handles paragraph, list, and inline styling. */}
      <div className="md:flex-[2] prose-content">
        {children}
      </div>

    </div>
  )
}
