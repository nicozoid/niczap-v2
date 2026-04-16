"use client"

import { useState, useCallback, useRef, useEffect } from "react"

/** Wraps content with scroll-wheel zoom and drag-to-pan, like a PDF viewer
 *  or Google Maps. The entire content area is one pannable canvas.
 *
 *  At zoom 1x: content scrolls normally if it overflows (overflow: auto).
 *  At zoom >1x: overflow is hidden, drag-to-pan is active.
 *
 *  Uses CSS transform: scale() so child elements (images, annotation layers)
 *  scale naturally. Individual annotation dots apply inverse scale to stay
 *  constant size. */
export function ZoomContainer({
  children,
  zoom,
  onZoomChange,
  className,
}: {
  children: (zoom: number) => React.ReactNode
  /** Controlled zoom level */
  zoom: number
  /** Called when the user scrolls/pinches to change zoom */
  onZoomChange: (zoom: number) => void
  className?: string
}) {
  // Pan offset in CSS pixels (only relevant when zoom > 1)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  // Track whether the user is currently dragging to pan
  const isDragging = useRef(false)
  const dragStart = useRef({ x: 0, y: 0 })
  const panStart = useRef({ x: 0, y: 0 })
  // Ref for the container element
  const containerRef = useRef<HTMLDivElement>(null)
  // Track pinch gesture distance for mobile
  const lastPinchDistance = useRef<number | null>(null)
  // Track whether a drag/pan occurred, to suppress the subsequent click event
  // (prevents pan gestures from accidentally closing the overlay backdrop)
  const didPan = useRef(false)

  // Reset pan when zoom returns to 1
  useEffect(() => {
    if (zoom === 1) setPan({ x: 0, y: 0 })
  }, [zoom])

  // --- Scroll wheel zoom ---
  const onWheel = useCallback(
    (e: React.WheelEvent) => {
      e.preventDefault()
      // deltaY > 0 means scrolling down → zoom out; < 0 → zoom in
      const factor = e.deltaY > 0 ? 0.9 : 1.1
      onZoomChange(Math.max(1, Math.min(zoom * factor, 5)))
    },
    [zoom, onZoomChange]
  )

  // --- Drag to pan (mouse) ---
  const onMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (zoom <= 1) return // No panning at 1x
      e.preventDefault()
      isDragging.current = true
      didPan.current = false
      dragStart.current = { x: e.clientX, y: e.clientY }
      panStart.current = { ...pan }
    },
    [zoom, pan]
  )

  const onMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!isDragging.current) return
      didPan.current = true
      setPan({
        x: panStart.current.x + (e.clientX - dragStart.current.x) / zoom,
        y: panStart.current.y + (e.clientY - dragStart.current.y) / zoom,
      })
    },
    [zoom]
  )

  const onMouseUp = useCallback(() => {
    isDragging.current = false
  }, [])

  // --- Touch events for mobile pinch-to-zoom and drag ---
  const onTouchStart = useCallback(
    (e: React.TouchEvent) => {
      if (e.touches.length === 2) {
        // Start pinch gesture — record initial distance between fingers
        const dx = e.touches[0].clientX - e.touches[1].clientX
        const dy = e.touches[0].clientY - e.touches[1].clientY
        lastPinchDistance.current = Math.sqrt(dx * dx + dy * dy)
      } else if (e.touches.length === 1 && zoom > 1) {
        // Single finger drag for panning (only when zoomed in)
        isDragging.current = true
        didPan.current = false
        dragStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }
        panStart.current = { ...pan }
      }
    },
    [zoom, pan]
  )

  const onTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (e.touches.length === 2 && lastPinchDistance.current !== null) {
        // Pinch zoom: compare current finger distance to initial
        const dx = e.touches[0].clientX - e.touches[1].clientX
        const dy = e.touches[0].clientY - e.touches[1].clientY
        const distance = Math.sqrt(dx * dx + dy * dy)
        const scale = distance / lastPinchDistance.current
        onZoomChange(Math.max(1, Math.min(zoom * scale, 5)))
        lastPinchDistance.current = distance
      } else if (e.touches.length === 1 && isDragging.current) {
        // Single finger pan
        didPan.current = true
        setPan({
          x: panStart.current.x + (e.touches[0].clientX - dragStart.current.x) / zoom,
          y: panStart.current.y + (e.touches[0].clientY - dragStart.current.y) / zoom,
        })
      }
    },
    [zoom, onZoomChange]
  )

  const onTouchEnd = useCallback(() => {
    isDragging.current = false
    lastPinchDistance.current = null
  }, [])

  // Smooth transition only when resetting to 1x (not during active zooming)
  const isResetting = zoom === 1 && pan.x === 0 && pan.y === 0

  return (
    <div
      ref={containerRef}
      className={className}
      // At 1x: allow normal scrolling (e.g. stacked images on mobile).
      // At >1x: clip overflow and handle panning via drag.
      style={{
        overflow: zoom > 1 ? "hidden" : "auto",
        touchAction: zoom > 1 ? "none" : "auto",
      }}
      onWheel={onWheel}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseUp}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      onClick={(e) => {
        // After a drag-to-pan gesture the browser fires a click — stop it
        // from bubbling up (e.g. closing an overlay backdrop)
        if (didPan.current) {
          e.stopPropagation()
          didPan.current = false
        }
      }}
    >
      <div
        style={{
          transform: `scale(${zoom}) translate(${pan.x}px, ${pan.y}px)`,
          transformOrigin: "center center",
          transition: isResetting ? "transform 0.3s ease" : "none",
          cursor: zoom > 1 ? (isDragging.current ? "grabbing" : "grab") : "default",
          // Fill the viewport so content can be centered and zooming
          // expands into the full available space
          minHeight: "100%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Render function pattern: children receives the current zoom level
            so annotation dots can apply inverse scaling */}
        {children(zoom)}
      </div>
    </div>
  )
}
