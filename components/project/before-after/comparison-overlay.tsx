"use client"

import { useState, useCallback, useEffect, useRef } from "react"
import { RiCloseLine, RiFullscreenLine, RiSettings3Line, RiZoomInLine, RiZoomOutLine } from "@remixicon/react"
import type { ComparisonData } from "./types"
import { AnnotationLayer } from "./annotation-layer"
import { ZoomContainer } from "./zoom-container"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"

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
  // Whether to use tabs instead of side-by-side (set after measuring images)
  const [useTabs, setUseTabs] = useState(false)
  // Zoom levels — one per image so they can be zoomed independently
  const [beforeZoom, setBeforeZoom] = useState(1)
  const [afterZoom, setAfterZoom] = useState(1)
  // Natural image dimensions (from onLoad)
  const beforeDims = useRef({ w: 0, h: 0 })
  const afterDims = useRef({ w: 0, h: 0 })
  // Track how many images have loaded
  const [loadCount, setLoadCount] = useState(0)

  // --- Layout decision: side-by-side vs tabs ---
  const checkLayout = useCallback(() => {
    const viewportW = window.innerWidth

    // Below Tailwind's sm breakpoint (640px) → always use tabs
    if (viewportW < 640) {
      setUseTabs(true)
      return
    }

    // Wait until both images have loaded so we know their natural dimensions
    if (beforeDims.current.w === 0 || afterDims.current.w === 0) return

    const viewportH = window.innerHeight
    const padding = 96 // 48px on each side (p-12)
    const gap = 24 // gap between the two images
    const availableW = viewportW - padding - gap
    const availableH = viewportH - padding

    // Retina-adjusted natural size
    const scale = data.retina ? (window.devicePixelRatio || 1) : 1
    const naturalW = beforeDims.current.w / scale

    // Each image gets half the available width in side-by-side mode
    const perImageW = availableW / 2

    // How much the image would be scaled down to fit
    const naturalH = beforeDims.current.h / scale
    const displayScale = Math.min(perImageW / naturalW, availableH / naturalH, 1)
    const displayW = naturalW * displayScale

    // If displayed width is less than 37% of natural → images are too small for side-by-side
    setUseTabs(displayW < naturalW * 0.37)
  }, [data.retina])

  // Re-check layout on window resize
  useEffect(() => {
    checkLayout()
    window.addEventListener("resize", checkLayout)
    return () => window.removeEventListener("resize", checkLayout)
  }, [checkLayout, loadCount])

  // Record natural dimensions when images load
  const onBeforeLoad = useCallback(
    (e: React.SyntheticEvent<HTMLImageElement>) => {
      const img = e.currentTarget
      beforeDims.current = { w: img.naturalWidth, h: img.naturalHeight }
      setLoadCount((c) => c + 1)
    },
    []
  )
  const onAfterLoad = useCallback(
    (e: React.SyntheticEvent<HTMLImageElement>) => {
      const img = e.currentTarget
      afterDims.current = { w: img.naturalWidth, h: img.naturalHeight }
      setLoadCount((c) => c + 1)
    },
    []
  )

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

  // Handle click on image in admin mode to place a dot.
  // Places immediately with a placeholder label — edit the text in the admin panel.
  const handleAdminClick = useCallback(
    (variant: "before" | "after", e: React.MouseEvent<HTMLImageElement>) => {
      if (!isAdmin || !onAdminPlaceDot) return
      const img = e.currentTarget
      const rect = img.getBoundingClientRect()
      const x = ((e.clientX - rect.left) / rect.width) * 100
      const y = ((e.clientY - rect.top) / rect.height) * 100

      const id = `${variant[0]}${Date.now()}`
      const newAnnotation = {
        id,
        x: Math.round(x * 10) / 10,
        y: Math.round(y * 10) / 10,
        label: "New annotation — edit in admin panel",
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
      <div
        className={`h-full flex justify-center ${
          useTabs ? "items-start px-0 py-14" : "items-center px-0 py-14"
        }`}
      >
        {/* Safe zone: clicks inside this wrapper don't close the overlay.
            Covers the tabs/images but NOT the outer padding area. */}
        <div className={useTabs ? "w-full py-4" : "p-8"} onClick={(e) => e.stopPropagation()}>
        {useTabs ? (
          /* --- Tabbed layout (viewport too narrow for side-by-side) --- */
          <Tabs
            defaultValue="before"
            className="w-full"
          >
            <TabsList className="mx-auto mb-4 bg-black/40 text-white/60">
              <TabsTrigger value="before" className="cursor-pointer text-white/60 hover:text-white/60 data-active:text-white data-active:bg-white/10 dark:data-active:bg-white/10 dark:data-active:text-white dark:text-white/60 dark:hover:text-white/60 not-data-active:hover:text-white not-data-active:hover:bg-white/5">
                Before
              </TabsTrigger>
              <TabsTrigger value="after" className="cursor-pointer text-white/60 hover:text-white/60 data-active:text-white data-active:bg-white/10 dark:data-active:bg-white/10 dark:data-active:text-white dark:text-white/60 dark:hover:text-white/60 not-data-active:hover:text-white not-data-active:hover:bg-white/5">
                After
              </TabsTrigger>
            </TabsList>

            <TabsContent value="before">
              <ZoomContainer
                zoom={beforeZoom}
                onZoomChange={setBeforeZoom}
                className="w-full flex items-center justify-center"
              >
                {(z) => renderImage("before", z, onBeforeLoad)}
              </ZoomContainer>
            </TabsContent>

            <TabsContent value="after">
              <ZoomContainer
                zoom={afterZoom}
                onZoomChange={setAfterZoom}
                className="w-full flex items-center justify-center"
              >
                {(z) => renderImage("after", z, onAfterLoad)}
              </ZoomContainer>
            </TabsContent>
          </Tabs>
        ) : (
          /* --- Side-by-side layout --- */
          <div className="flex gap-6 w-full max-w-[95vw] items-start">
            <ZoomContainer
              zoom={beforeZoom}
              onZoomChange={setBeforeZoom}
              className="flex-1 min-w-0 flex items-center justify-center"
            >
              {(z) => renderImage("before", z, onBeforeLoad)}
            </ZoomContainer>

            <ZoomContainer
              zoom={afterZoom}
              onZoomChange={setAfterZoom}
              className="flex-1 min-w-0 flex items-center justify-center"
            >
              {(z) => renderImage("after", z, onAfterLoad)}
            </ZoomContainer>
          </div>
        )}
        </div>
      </div>
    </div>
  )
}
