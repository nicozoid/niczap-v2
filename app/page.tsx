"use client"

import { ProjectCard } from "@/components/project-card"
import { Card } from "@/components/ui/card"
import { FillText } from "@/components/fill-text"
import { projects } from "@/data/projects"

export default function Page() {
  // Filter out projects marked as hidden (e.g. research) — their pages still work via direct URL
  const visibleProjects = projects.filter((p) => !p.hidden)

  return (
    // h-dvh: fills the full viewport height on desktop (dvh accounts for mobile browser chrome)
    <main className="md:h-dvh">

      {/* Mobile: 1 column, each card has a fixed 380px height — simple vertical stack.
          md and up: 2 columns, 3 explicit equal rows (grid-rows-3 = repeat(3, 1fr)),
          h-full makes the grid stretch to fill the full main height — so 6 cards tile the viewport. */}
      <div className="grid grid-cols-1 auto-rows-[380px] md:grid-cols-2 md:grid-rows-3 md:h-full md:auto-rows-auto">

        {/* Typography card — no image, pure text. Sits first in the grid alongside a project card.
            flex + flex-col lets us stack the two text lines vertically with space between them.
            justify-between pushes the second line to the bottom of the card. */}
        {/* [container-type:inline-size] makes this card a CSS container,
            so cqw units inside it are relative to this card's width, not the viewport */}
        <Card className="flex items-start p-8">
          {/* ReactFitty measures its container and scales the font to fill the available width.
              wrapText allows the text to wrap across lines rather than being forced onto one. */}
          <FillText className="font-semibold leading-snug">
            {/* text-lime by default; reverts to semi-opaque when an image card is hovered.
                group-hover/images: fires when any element inside the group/images wrapper is hovered. */}
            <span className="opacity-40">Nicolas Holzapfel&apos;s portfolio. </span>
            Over a decade of turning big, messy tech into tools for humans. My thing: grappling with complexity, putting chaos to order, shipping quality fast. <a href="https://linkedin.com/in/niczap" target="_blank" rel="noopener noreferrer" className="opacity-40 hover:opacity-100 hover:!text-[hsl(118,62%,65%)]">linkedin.com/in/niczap</a><span className="opacity-40">. </span><a href="mailto:nicolas@niczap.design" className="opacity-40 hover:opacity-100 hover:!text-[hsl(118,62%,65%)]">nicolas@niczap.design</a><span className="opacity-40">.</span>
          </FillText>
        </Card>

        {/* Total grid items = projects + 1 (the text card above).
            If that's odd, the last row has a gap — so stretch the last card across both columns. */}
        {visibleProjects.map((project, index) => (
          <ProjectCard
            key={project.href}
            {...project}
            className={
              (visibleProjects.length + 1) % 2 !== 0 && index === visibleProjects.length - 1
                ? "md:col-span-2"
                : ""
            }
          />
        ))}

      </div>

    </main>
  )
}
