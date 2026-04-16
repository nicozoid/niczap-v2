"use client"

import { RiArrowRightCircleFill } from "@remixicon/react"
import { cn } from "@/lib/utils"
import type { ComparisonData } from "./types"
import { AnnotationLayer } from "./annotation-layer"

/** Inline (page-embedded) view: two images side-by-side on desktop,
 *  stacked on mobile. Each image has an annotation layer overlaid.
 *  Clicking either image opens the full-screen overlay. */
export function ComparisonInline({
  data,
  activeAnnotation,
  highlightedIds,
  onAnnotationActivate,
  onDismiss,
  onOpenOverlay,
  className,
}: {
  data: ComparisonData
  activeAnnotation: string | null
  highlightedIds: string[]
  onAnnotationActivate: (id: string) => void
  onDismiss: () => void
  onOpenOverlay: () => void
  className?: string
}) {
  return (
    <div className={cn("group/compare relative flex flex-col md:flex-row md:items-start md:gap-4 my-12", className)}>
      {/* Before image */}
      <div className="relative flex-1 min-w-0 rounded-lg border border-border/40">
        {/* Badge label — uses --negative with 80% opacity */}
        <span className="absolute top-3 left-3 z-10 rounded-sm bg-[var(--negative)]/80 px-2 py-0.5 text-xs font-medium text-white tracking-[0.05em] transition-transform duration-200 group-hover/compare:scale-105">
          Before
        </span>
        {/* Clickable image — opens overlay.
            Uses plain <img> (same as overlay) so the full image displays
            at its natural aspect ratio — no cropping — and annotation
            dot % positions map correctly to the visible content. */}
        <button
          type="button"
          onClick={onOpenOverlay}
          className="block w-full cursor-pointer"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={data.before.src}
            alt={data.before.alt}
            className="block w-full h-auto"
          />
        </button>
        {/* Annotation dots overlaid on the image */}
        <AnnotationLayer
          annotations={data.before.annotations}
          variant="before"
          activeAnnotation={activeAnnotation}
          highlightedIds={highlightedIds}
          onAnnotationActivate={onAnnotationActivate}
          onDismiss={onDismiss}
        />
      </div>

      {/* Arrow icon between the two images.
          Mobile: a normal flex child centred between stacked images, with
          negative margins so it overlaps them slightly (no extra gap).
          Desktop: absolutely positioned to overlap the gap between side-by-side images. */}
      <div className="-my-3 flex items-center justify-center z-20
        md:my-0 md:absolute md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2">
        <button
          type="button"
          onClick={onOpenOverlay}
          className="cursor-pointer"
        >
          <RiArrowRightCircleFill className="w-11 h-11 text-foreground/50 rotate-90 md:rotate-0 drop-shadow-lg transition-transform duration-200 group-hover/compare:scale-105" />
        </button>
      </div>

      {/* After image */}
      <div className="relative flex-1 min-w-0 rounded-lg border border-border/40">
        {/* Badge label — uses --positive with 90% opacity */}
        <span className="absolute top-3 left-3 z-10 rounded-sm bg-[var(--positive)]/90 px-2 py-0.5 text-xs font-medium text-black tracking-[0.05em] transition-transform duration-200 group-hover/compare:scale-105">
          After
        </span>
        <button
          type="button"
          onClick={onOpenOverlay}
          className="block w-full cursor-pointer"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={data.after.src}
            alt={data.after.alt}
            className="block w-full h-auto"
          />
        </button>
        <AnnotationLayer
          annotations={data.after.annotations}
          variant="after"
          activeAnnotation={activeAnnotation}
          highlightedIds={highlightedIds}
          onAnnotationActivate={onAnnotationActivate}
          onDismiss={onDismiss}
        />
      </div>
    </div>
  )
}
