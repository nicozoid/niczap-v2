// Import Next.js components for routing and optimised images
import Link from "next/link"
import Image from "next/image"

import { Card } from "@/components/ui/card"

// TypeScript interface: defines the shape of the props this component accepts.
interface ProjectCardProps {
  title: string
  description: string
  imageSrc: string
  href: string
  imageTone?: "light" | "dark"  // light = light image → black text; dark = dark image → white text
}

export function ProjectCard({ title, description, imageSrc, href, imageTone = "dark" }: ProjectCardProps) {
  return (
    <Card className="relative h-full overflow-hidden">

      {/* group enables group-hover: on children — hovering anywhere on the link triggers them */}
      <Link href={href} className="absolute inset-0 group">

        {/* Image fills the full card */}
        <Image
          src={imageSrc}
          alt={title}
          fill
          className="object-cover grayscale-[70%] group-hover:grayscale-0 transition-[filter] duration-500"
        />

        {/* Transparent wrapper — just stacks title and description vertically.
            No backdrop here so its width doesn't matter. */}
        <div className={`absolute top-0 left-0 w-full text-lg ${imageTone === "light" ? "text-black" : "text-white"}`}>

          {/* Title: w-max makes it hug the text, backdrop only covers this */}
          <div className={`w-fit max-w-full backdrop-blur-sm font-bold px-3 py-2 ${imageTone === "light" ? "bg-white/50" : "bg-black/50"}`}>
            {title}
          </div>

          {/* Description: its own backdrop element, independently sized.
              Height collapses to 0 when not hovered — doesn't affect title width. */}
          {/* Grid rows collapses height to zero instantly (duration-0) so no invisible gap below title */}
          {/* On mobile: always visible, wraps normally — no hover/animation needed.
              On md+: collapses to zero height until hovered, then animates in. */}
          <div className="md:grid md:grid-rows-[0fr] md:group-hover:grid-rows-[1fr] md:transition-[grid-template-rows] md:duration-300">
            <div className="overflow-hidden min-h-0">
              <div className={`overflow-hidden backdrop-blur-sm font-normal px-3 pb-2 ${imageTone === "light" ? "bg-white/50" : "bg-black/50"}`}>
                {description}
              </div>
            </div>
          </div>

        </div>

      </Link>

    </Card>
  )
}
