import Link from "next/link"

// ProjectLayout wraps every project page with a consistent max-width container
// and the back-navigation header. Import this in every app/[project]/page.tsx.
export function ProjectLayout({ children }: { children: React.ReactNode }) {
  return (
    // Horizontal padding scales from 24px on mobile to 56px (px-14) on larger screens,
    // matching the spacing used in the v1 site.
    <div className="px-6 sm:px-14 pb-24">
      {/* max-w-[1140px] matches the v1 container width. mx-auto centres it. */}
      <div className="max-w-[1140px] mx-auto">

        {/* Back-nav header — plain text link, muted colour to stay out of the way */}
        <header className="py-8">
          <Link
            href="/"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Nicolas Holzapfel — Portfolio
          </Link>
        </header>

        {children}

      </div>
    </div>
  )
}
