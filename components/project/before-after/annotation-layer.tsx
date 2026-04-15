"use client"

import type { Annotation } from "./types"
import { AnnotationDot } from "./annotation-dot"

type Variant = "before" | "after"

/** Overlays annotation dots on top of an image.
 *  The layer itself is pointer-events:none so clicks pass through to the
 *  image underneath; individual dots opt back in with pointer-events:auto. */
export function AnnotationLayer({
  annotations,
  variant,
  activeAnnotation,
  highlightedIds,
  zoom = 1,
  onAnnotationActivate,
  onDismiss,
  onMove,
}: {
  annotations: Annotation[]
  variant: Variant
  /** ID of the currently active (tooltip-visible) annotation, or null */
  activeAnnotation: string | null
  /** IDs of dots that should show a highlight ring (linked pair partner) */
  highlightedIds: string[]
  /** Current zoom level — passed through to dots for inverse scaling */
  zoom?: number
  onAnnotationActivate: (id: string) => void
  onDismiss: () => void
  /** Admin mode: callback when a dot is dragged to a new position */
  onMove?: (id: string, x: number, y: number) => void
}) {
  // Don't render the layer at all if there are no annotations
  if (annotations.length === 0) return null

  return (
    <div data-annotation-layer className="absolute inset-0 z-20 pointer-events-none">
      {annotations.map((annotation) => (
        <AnnotationDot
          key={annotation.id}
          annotation={annotation}
          variant={variant}
          isActive={activeAnnotation === annotation.id}
          isHighlighted={highlightedIds.includes(annotation.id)}
          zoom={zoom}
          onActivate={() => onAnnotationActivate(annotation.id)}
          onDismiss={onDismiss}
          onMove={onMove ? (x, y) => onMove(annotation.id, x, y) : undefined}
        />
      ))}
    </div>
  )
}
