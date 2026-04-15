"use client"

import { useState, useCallback, useRef, useEffect } from "react"

/** Wraps content (image + annotation layer) with scroll-wheel zoom and
 *  drag-to-pan. Zoom range is 1x (fit-to-viewport) to 5x.
 *
 *  Uses CSS transform: scale() so the annotation layer scales naturally
 *  with the image. Individual dots apply inverse scale to stay constant size. */
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
      dragStart.current = { x: e.clientX, y: e.clientY }
      panStart.current = { ...pan }
    },
    [zoom, pan]
  )

  const onMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!isDragging.current) return
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
      // touch-action:none prevents the browser's default pinch/scroll on this element
      style={{ overflow: "hidden", touchAction: "none" }}
      onWheel={onWheel}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseUp}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      <div
        style={{
          transform: `scale(${zoom}) translate(${pan.x}px, ${pan.y}px)`,
          transformOrigin: "center center",
          transition: isResetting ? "transform 0.3s ease" : "none",
          cursor: zoom > 1 ? (isDragging.current ? "grabbing" : "grab") : "default",
        }}
      >
        {/* Render function pattern: children receives the current zoom level
            so annotation dots can apply inverse scaling */}
        {children(zoom)}
      </div>
    </div>
  )
}
