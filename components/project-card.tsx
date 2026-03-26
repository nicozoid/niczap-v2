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
  imagePosition?: string        // Tailwind object-position class, e.g. "object-left", "object-right" (defaults to "object-center")
  className?: string            // optional extra classes from the parent (e.g. col-span-2)
}

export function ProjectCard({ title, description, imageSrc, href, imageTone = "dark", imagePosition = "object-center", className = "" }: ProjectCardProps) {
  return (
    <Card className={`relative h-full overflow-hidden ${className}`}>

      {/* group enables group-hover: on children — hovering anywhere on the link triggers them */}
      <Link href={href} className="absolute inset-0 group">

        {/* Image fills the full card */}
        <Image
          src={imageSrc}
          alt={title}
          fill
          className={`object-cover ${imagePosition} scale-[1.01] grayscale-[70%] group-hover:grayscale-0 transition-[filter] duration-500`}
        />

        {/* Shared backdrop parent — bg + blur live here so title & description
            form one seamless block. w-fit hugs the title at rest; stretches to
            full width on hover when the description reveals. */}
        <div className={`absolute top-0 left-0 w-full text-lg backdrop-blur-sm ${imageTone === "light" ? "text-black bg-white/50" : "text-white bg-black/50"}`}>

          {/* Title — no bg/backdrop here, the parent handles it */}
          <div className="font-bold px-3 py-2">
            {title}
          </div>

          {/* Description — height collapses to 0 on desktop until hovered.
              On mobile: always visible. On md+: animates in via grid-rows. */}
          <div className="md:grid md:grid-rows-[0fr] md:group-hover:grid-rows-[1fr] md:transition-[grid-template-rows] md:duration-300">
            <div className="overflow-hidden min-h-0">
              <div className="font-normal px-3 pb-2">
                {description}
              </div>
            </div>
          </div>

        </div>

      </Link>

    </Card>
  )
}
