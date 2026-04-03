// SectionIntro renders a full-width introductory paragraph that sits outside
// the two-column ContentSection layout. The block is horizontally centred
// with prose-content styling so it matches the rest of the page's text.
// Typically placed right after a SectionDivider, before the first ContentSection.
export function SectionIntro({ children }: { children: React.ReactNode }) {
  return (
    // mx-auto centres the block; prose-content gives it the same paragraph
    // styling as ContentSection children; flex lets the child fill naturally.
    <div className="mx-auto prose-content flex">
      {children}
    </div>
  )
}
