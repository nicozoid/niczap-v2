import Image from "next/image"
import { getProject } from "@/data/projects"

// NextProject renders the navigation footer at the bottom of each project page.
// The label "Next project" sits between two horizontal rules — a typographic device
// from the v1 site that creates a clean visual divider without being heavy.
// Uses plain <a> tags instead of Next.js <Link> so clicking triggers a full page
// reload — this makes the transition feel like navigating to a new page rather than
// an in-page scroll.
// The next project's title is looked up automatically from the href.
export function NextProject({
  href,
  imageSrc,
  imageAlt,
  label = "Next project",
}: {
  href: string
  imageSrc: string
  imageAlt: string
  label?: string
}) {
  // Look up the next project's title from the central registry
  const nextProject = getProject(href)

  return (
    <div className="my-20">

      {/* Decorative rule + label + rule row.
          items-center vertically aligns the lines with the text baseline area. */}
      <div className="flex items-center gap-4 mb-10">
        {/* flex-1 makes these <div>s stretch to fill the remaining horizontal space */}
        <div className="flex-1 border-t border-foreground/40" />
        <a
          href={href}
          className="text-2xl font-medium whitespace-nowrap hover:opacity-50 transition-opacity"
        >
          {label}
        </a>
        <div className="flex-1 border-t border-foreground/40" />
      </div>

      {/* Thumbnail — 70% wide, centred, matches v1's .thumbnail treatment */}
      <a href={href} className="block">
        <Image
          src={imageSrc}
          alt={imageAlt}
          width={0}
          height={0}
          sizes="70vw"
          className="w-[70%] h-auto mx-auto hover:opacity-80 transition-opacity"
        />
      </a>

      {/* Project title link below the image */}
      <a
        href={href}
        className="block text-center mt-4 text-lg text-muted-foreground hover:text-foreground transition-colors"
      >
        {nextProject.title}
      </a>

    </div>
  )
}
