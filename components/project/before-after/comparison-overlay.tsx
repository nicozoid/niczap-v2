"use client"

import { useState, useCallback, useEffect, useRef } from "react"
import { RiCloseLine, RiFullscreenLine, RiSettings3Line, RiZoomInLine, RiZoomOutLine } from "@remixicon/react"
import type { ComparisonData } from "./types"
import { AnnotationLayer } from "./annotation-layer"
import { ZoomContainer } from "./zoom-container"

/** Overlay button with a custom tooltip that appears below on hover. */
function OverlayButton({
  onClick,
  label,
  className,
  children,
}: {
  onClick: (e: React.MouseEvent) => void
  label: string
  className?: string
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group/btn relative cursor-pointer rounded-full p-2 transition-colors text-white ${className ?? "bg-black/40 hover:bg-black/30"}`}
      aria-label={label}
    >
      {children}
      {/* Custom tooltip — CSS-only, appears below the button on hover */}
      <span className="pointer-events-none absolute left-1/2 top-full mt-2 -translate-x-1/2 rounded bg-black/85 px-2 py-1 text-xs text-white whitespace-nowrap opacity-0 transition-opacity group-hover/btn:opacity-100">
        {label}
      </span>
    </button>
  )
}

/** Full-screen overlay for the before/after comparison.
 *
 *  Layout decision:
 *  - If both images fit side-by-side at ≥37% of their natural width → side-by-side
 *  - Otherwise → tabbed view (Before / After tabs, one image at a time)
 *
 *  Zoom: scroll wheel or pinch to zoom in (1x–5x). Reset button returns to 1x. */
export function ComparisonOverlay({
  data,
  activeAnnotation,
  highlightedIds,
  onAnnotationActivate,
  onDismiss,
  onClose,
  isAdmin,
  onToggleAdmin,
  onAdminPlaceDot,
}: {
  data: ComparisonData
  activeAnnotation: string | null
  highlightedIds: string[]
  onAnnotationActivate: (id: string) => void
  onDismiss: () => void
  onClose: () => void
  isAdmin: boolean
  /** Callback to toggle admin mode on/off (dev only) */
  onToggleAdmin?: () => void
  onAdminPlaceDot?: (data: ComparisonData) => void
}) {
  // Stacked (vertical) vs side-by-side — matches the inline view's md: breakpoint (768px)
  const [useStacked, setUseStacked] = useState(false)
  // Zoom levels — one per image so they can be zoomed independently
  const [beforeZoom, setBeforeZoom] = useState(1)
  const [afterZoom, setAfterZoom] = useState(1)

  // Check layout on mount and resize — simple width check, no image measurement needed
  const checkLayout = useCallback(() => {
    setUseStacked(window.innerWidth < 768)
  }, [])

  useEffect(() => {
    checkLayout()
    window.addEventListener("resize", checkLayout)
    return () => window.removeEventListener("resize", checkLayout)
  }, [checkLayout])

  // Record when images load (still needed for admin click placement)
  const onBeforeLoad = useCallback(() => {}, [])
  const onAfterLoad = useCallback(() => {}, [])

  // Reset zoom for both images
  const resetZoom = useCallback(() => {
    setBeforeZoom(1)
    setAfterZoom(1)
  }, [])

  // Zoom both images in or out by a step factor, clamped to 1x–5x
  const zoomIn = useCallback(() => {
    const step = (z: number) => Math.min(z * 1.3, 5)
    setBeforeZoom(step)
    setAfterZoom(step)
  }, [])
  const zoomOut = useCallback(() => {
    const step = (z: number) => Math.max(z * 0.7, 1)
    setBeforeZoom(step)
    setAfterZoom(step)
  }, [])

  const isZoomed = beforeZoom > 1 || afterZoom > 1

  // Track mousedown time so we can distinguish a quick click from a hold-down.
  // Only quick clicks (< 300ms) should place admin dots.
  const mouseDownTime = useRef(0)

  // Handle click on image in admin mode to place a dot.
  // Places immediately with a placeholder label — edit the text in the admin panel.
  const handleAdminClick = useCallback(
    (variant: "before" | "after", e: React.MouseEvent<HTMLImageElement>) => {
      if (!isAdmin || !onAdminPlaceDot) return
      // Ignore hold-downs — only place a dot on a short press
      if (Date.now() - mouseDownTime.current > 300) return
      const img = e.currentTarget
      const rect = img.getBoundingClientRect()
      const x = ((e.clientX - rect.left) / rect.width) * 100
      const y = ((e.clientY - rect.top) / rect.height) * 100

      const id = `${variant[0]}${Date.now()}`
      const newAnnotation = {
        id,
        x: Math.round(x * 10) / 10,
        y: Math.round(y * 10) / 10,
        label: "NEW ANNOTATION — EDIT IN ADMIN PANEL",
      }
      onAdminPlaceDot({
        ...data,
        [variant]: {
          ...data[variant],
          annotations: [...data[variant].annotations, newAnnotation],
        },
      })
    },
    [isAdmin, onAdminPlaceDot, data]
  )

  // Admin mode: reposition a dot by updating its x/y in the data
  const handleMoveAnnotation = useCallback(
    (variant: "before" | "after", id: string, x: number, y: number) => {
      if (!onAdminPlaceDot) return
      onAdminPlaceDot({
        ...data,
        [variant]: {
          ...data[variant],
          annotations: data[variant].annotations.map((a) =>
            a.id === id ? { ...a, x, y } : a
          ),
        },
      })
    },
    [data, onAdminPlaceDot]
  )

  /** Renders a single image with its annotation layer. Used in both
   *  side-by-side and tabbed layouts. */
  const renderImage = (
    variant: "before" | "after",
    zoom: number,
    onLoad: (e: React.SyntheticEvent<HTMLImageElement>) => void
  ) => {
    const side = data[variant]
    return (
      <div className="relative">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={side.src}
          alt={side.alt}
          className="block w-full h-auto"
          onLoad={onLoad}
          onMouseDown={() => { mouseDownTime.current = Date.now() }}
          onClick={(e) => {
            // In admin mode, clicking places a dot
            if (isAdmin) {
              e.stopPropagation()
              handleAdminClick(variant, e)
            } else {
              // Otherwise, dismiss any active annotation (but don't close overlay)
              e.stopPropagation()
              onDismiss()
            }
          }}
        />
        <AnnotationLayer
          annotations={side.annotations}
          variant={variant}
          activeAnnotation={activeAnnotation}
          highlightedIds={highlightedIds}
          zoom={zoom}
          onAnnotationActivate={onAnnotationActivate}
          onDismiss={onDismiss}
          onMove={isAdmin ? (id, x, y) => handleMoveAnnotation(variant, id, x, y) : undefined}
        />
      </div>
    )
  }

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80"
      onClick={onClose}
    >
      {/* Dev-only admin mode toggle — top-left corner */}
      {process.env.NODE_ENV === "development" && onToggleAdmin && (
        <div className="fixed top-4 left-4 z-50" onClick={(e) => e.stopPropagation()}>
          <OverlayButton
            onClick={() => onToggleAdmin()}
            label="Edit annotations"
            className={isAdmin ? "bg-yellow-500/80 hover:bg-yellow-500" : "bg-black/40 hover:bg-black/30"}
          >
            <RiSettings3Line className="w-8 h-8" />
          </OverlayButton>
        </div>
      )}

      {/* Toolbar — top-right button group */}
      <div className="fixed top-4 right-4 z-50 flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
        {isZoomed && (
          <OverlayButton onClick={resetZoom} label="Fit to screen">
            <RiFullscreenLine className="w-8 h-8" />
          </OverlayButton>
        )}
        <OverlayButton onClick={zoomOut} label="Zoom out">
          <RiZoomOutLine className="w-8 h-8" />
        </OverlayButton>
        <OverlayButton onClick={zoomIn} label="Zoom in">
          <RiZoomInLine className="w-8 h-8" />
        </OverlayButton>
        <OverlayButton onClick={onClose} label="Close">
          <RiCloseLine className="w-8 h-8" />
        </OverlayButton>
      </div>

      {/* Content area — clicks on the background/padding pass through to
          the backdrop's onClose handler. Only images and interactive elements
          (tabs, buttons) stop propagation to prevent accidental closes. */}
      {/* Content area — scrollable, clicks on padding close the overlay */}
      <div
        className="h-full overflow-y-auto flex justify-center items-start px-0 py-14"
      >
        <div className="w-full">
          {/* Stacked on small screens (flex-col), side-by-side on wide screens (flex-row) */}
          <div className={`flex w-full ${useStacked ? "flex-col gap-4" : "flex-row gap-6 max-w-[95vw] mx-auto items-start"}`}>
            <ZoomContainer
              zoom={beforeZoom}
              onZoomChange={setBeforeZoom}
              className={useStacked ? "w-full" : "flex-1 min-w-0 flex items-center justify-center"}
            >
              {(z) => renderImage("before", z, onBeforeLoad)}
            </ZoomContainer>

            <ZoomContainer
              zoom={afterZoom}
              onZoomChange={setAfterZoom}
              className={useStacked ? "w-full" : "flex-1 min-w-0 flex items-center justify-center"}
            >
              {(z) => renderImage("after", z, onAfterLoad)}
            </ZoomContainer>
          </div>
        </div>
      </div>
    </div>
  )
}
