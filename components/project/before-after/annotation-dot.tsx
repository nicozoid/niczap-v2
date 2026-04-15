"use client"

import { useCallback, useRef } from "react"
import type { Annotation } from "./types"

/** Variant determines the dot colour: green for "before", red for "after". */
type Variant = "before" | "after"

export function AnnotationDot({
  annotation,
  variant,
  isActive,
  isHighlighted,
  zoom = 1,
  onActivate,
  onDismiss,
  onMove,
}: {
  annotation: Annotation
  variant: Variant
  /** True when this dot's tooltip is currently showing */
  isActive: boolean
  /** True when this dot's linked partner is active (shows a highlight ring) */
  isHighlighted: boolean
  /** Current zoom level — dots apply inverse scale to stay constant pixel size */
  zoom?: number
  onActivate: () => void
  onDismiss: () => void
  /** Admin mode: callback to reposition the dot (x%, y%) */
  onMove?: (x: number, y: number) => void
}) {
  // Decide which side the tooltip opens on based on the dot's position.
  // Near left edge → open right. Near right edge → open left.
  // Middle zone (25–75%) → open below (or above if near bottom), centered horizontally.
  // This prevents tooltips from clipping against the image edges.
  const opensRight = annotation.x < 25
  const opensLeft = annotation.x > 75
  const opensVertically = !opensRight && !opensLeft
  const opensAbove = opensVertically && annotation.y > 75
  // For horizontal tooltips: fine-tune vertical alignment
  const nearTop = annotation.y < 15
  const nearBottom = annotation.y > 85

  // On desktop: hover shows tooltip. On mobile: tap toggles it.
  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      // Stop the click from bubbling to the image (which would open the overlay)
      e.stopPropagation()
      // Suppress click if we just finished dragging
      if (isDragging.current) return
      if (isActive) {
        onDismiss()
      } else {
        onActivate()
      }
    },
    [isActive, onActivate, onDismiss]
  )

  // --- Drag to reposition (admin mode only) ---
  const isDragging = useRef(false)

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (!onMove) return
      e.preventDefault()
      e.stopPropagation()

      const startX = e.clientX
      const startY = e.clientY
      const startAnnX = annotation.x
      const startAnnY = annotation.y

      // Find the annotation layer (absolute inset-0 parent) to get image dimensions
      const layer = (e.currentTarget as HTMLElement).closest("[data-annotation-layer]") as HTMLElement
      if (!layer) return
      const layerRect = layer.getBoundingClientRect()

      isDragging.current = false

      const onMouseMove = (ev: MouseEvent) => {
        isDragging.current = true
        const dx = (ev.clientX - startX) / layerRect.width * 100 / zoom
        const dy = (ev.clientY - startY) / layerRect.height * 100 / zoom
        const newX = Math.round(Math.min(100, Math.max(0, startAnnX + dx)) * 10) / 10
        const newY = Math.round(Math.min(100, Math.max(0, startAnnY + dy)) * 10) / 10
        onMove(newX, newY)
      }

      const onMouseUp = () => {
        window.removeEventListener("mousemove", onMouseMove)
        window.removeEventListener("mouseup", onMouseUp)
        // If we dragged, suppress the click that follows
        if (isDragging.current) {
          setTimeout(() => { isDragging.current = false }, 0)
        }
      }

      window.addEventListener("mousemove", onMouseMove)
      window.addEventListener("mouseup", onMouseUp)
    },
    [onMove, annotation.x, annotation.y, zoom]
  )

  const handleMouseEnter = useCallback(() => {
    onActivate()
  }, [onActivate])

  const handleMouseLeave = useCallback(() => {
    onDismiss()
  }, [onDismiss])

  // Pick colour and pulse animation based on variant and active/highlighted state.
  // Idle: very slow subtle glow (4s). Active/highlighted: faster prominent glow (2s).
  const isEngaged = isActive || isHighlighted
  const dotColor =
    variant === "before"
      ? `bg-[var(--negative)] ${isEngaged ? "animate-[pulse-dot-red_2s_ease-in-out_infinite]" : "animate-[pulse-dot-red-idle_4s_ease-in-out_infinite]"}`
      : `bg-[var(--positive)] ${isEngaged ? "animate-[pulse-dot-green_2s_ease-in-out_infinite]" : "animate-[pulse-dot-green-idle_4s_ease-in-out_infinite]"}`

  // Highlight ring when the linked partner dot is active
  const highlightRing = isHighlighted ? "ring-2 ring-white/60" : ""

  return (
    <div
      className={`absolute ${isActive || isHighlighted ? "z-30" : "z-0"}`}
      style={{
        left: `${annotation.x}%`,
        top: `${annotation.y}%`,
        // Inverse scale keeps the dot at a constant pixel size regardless of zoom
        transform: `translate(-50%, -50%) scale(${1 / zoom})`,
        // Transform origin centred so the inverse scale shrinks/grows from the dot's centre
        transformOrigin: "center center",
      }}
    >
      {/* Hit area is double the visible dot size for easier tapping */}
      <button
        type="button"
        onClick={handleClick}
        onMouseDown={onMove ? handleMouseDown : undefined}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={`pointer-events-auto w-6 h-6 flex items-center justify-center ${onMove ? "cursor-grab active:cursor-grabbing" : "cursor-pointer"}`}
        aria-label={annotation.label}
      >
        <span
          className={`block w-3 h-3 rounded-full
            border border-white/40 ${dotColor} ${highlightRing}
            transition-[box-shadow] hover:scale-110`}
        />
      </button>

      {/* Tooltip — shown when this dot is active OR its linked partner is active */}
      {(isActive || isHighlighted) && (
        <div
          className={`pointer-events-auto absolute z-10 w-max max-w-64
            text-xs font-medium px-3 py-1.5 rounded-sm shadow-lg
            bg-gray-950 text-white
            ${variant === "before" ? "border border-[var(--negative)]" : "border border-[var(--positive)]"}
            ${opensVertically
              // Middle zone: center horizontally, open above or below
              ? `left-1/2 -translate-x-1/2 ${opensAbove ? "bottom-full mb-2" : "top-full mt-2"}`
              // Edge zone: open left or right, with vertical fine-tuning
              : `${opensLeft ? "right-full mr-2" : "left-full ml-2"} ${nearBottom ? "bottom-0" : nearTop ? "top-2" : "top-1/2 -translate-y-1/2"}`
            }`}
        >
          {annotation.label}
        </div>
      )}
    </div>
  )
}
