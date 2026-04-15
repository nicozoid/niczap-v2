"use client"

import { useState, useCallback, useEffect, useMemo } from "react"
import dynamic from "next/dynamic"
import type { ComparisonData } from "./types"
import { ComparisonInline } from "./comparison-inline"

// Overlay is loaded normally (it's behind a conditional render anyway)
import { ComparisonOverlay } from "./comparison-overlay"

// Admin panel is dynamically imported so it's tree-shaken from production builds.
// The import only happens when isAdmin is true AND we're in development mode.
const AdminPanel = dynamic(() => import("./admin-panel"), { ssr: false })

/** BeforeAfterComparison — the main entry point.
 *
 *  Renders two images (before/after a redesign) with annotated callout dots.
 *  - Inline mode: side-by-side on desktop, stacked on mobile
 *  - Overlay mode: fullscreen with zoom, side-by-side or tabbed
 *  - Admin mode: dev-only, lets you place/edit/delete annotation dots
 *
 *  Usage:
 *  ```tsx
 *  import { BeforeAfterComparison } from "@/components/project/before-after/before-after-comparison"
 *  import { yaretaProfileComparison } from "@/data/comparisons/yareta-profile"
 *
 *  <BeforeAfterComparison data={yaretaProfileComparison} />
 *  ```
 */
export function BeforeAfterComparison({
  data: initialData,
  className,
}: {
  data: ComparisonData
  className?: string
}) {
  // In admin mode, annotations are editable — we keep a mutable copy in state.
  // In normal mode this just mirrors the prop.
  const [editableData, setEditableData] = useState<ComparisonData>(initialData)


  // Which annotation dot currently has its tooltip visible (null = none)
  const [activeAnnotation, setActiveAnnotation] = useState<string | null>(null)

  // Is the fullscreen overlay open?
  const [overlayOpen, setOverlayOpen] = useState(false)

  // Admin mode: only in dev, activated by ?admin=true query param
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    if (process.env.NODE_ENV !== "development") return
    const params = new URLSearchParams(window.location.search)
    setIsAdmin(params.get("admin") === "true")
  }, [])

  // --- Derived state ---

  // When a dot is active, find its linked partner (if any) so we can highlight it
  const highlightedIds = useMemo(() => {
    if (!activeAnnotation || !editableData.linkedPairs) return []
    const ids: string[] = []
    for (const [beforeId, afterId] of editableData.linkedPairs) {
      if (activeAnnotation === beforeId) ids.push(afterId)
      if (activeAnnotation === afterId) ids.push(beforeId)
    }
    return ids
  }, [activeAnnotation, editableData.linkedPairs])

  // --- Callbacks ---

  const openOverlay = useCallback(() => setOverlayOpen(true), [])
  const closeOverlay = useCallback(() => {
    setOverlayOpen(false)
    setActiveAnnotation(null)
    setIsAdmin(false)
  }, [])
  const dismissAnnotation = useCallback(() => setActiveAnnotation(null), [])

  // Close overlay on Escape key
  useEffect(() => {
    if (!overlayOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeOverlay()
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [overlayOpen, closeOverlay])

  // Prevent body scroll while overlay is open
  useEffect(() => {
    document.body.style.overflow = overlayOpen ? "hidden" : ""
    return () => {
      document.body.style.overflow = ""
    }
  }, [overlayOpen])

  return (
    <>
      {/* Page-embedded inline view */}
      <ComparisonInline
        data={editableData}
        activeAnnotation={overlayOpen ? null : activeAnnotation}
        highlightedIds={overlayOpen ? [] : highlightedIds}
        onAnnotationActivate={setActiveAnnotation}
        onDismiss={dismissAnnotation}
        onOpenOverlay={openOverlay}
        className={className}
      />

      {/* Fullscreen overlay */}
      {overlayOpen && (
        <ComparisonOverlay
          data={editableData}
          activeAnnotation={activeAnnotation}
          highlightedIds={highlightedIds}
          onAnnotationActivate={setActiveAnnotation}
          onDismiss={dismissAnnotation}
          onClose={closeOverlay}
          isAdmin={isAdmin}
          onToggleAdmin={() => setIsAdmin((prev) => !prev)}
          onAdminPlaceDot={isAdmin ? setEditableData : undefined}
        />
      )}

      {/* Dev-only admin panel for placing/editing annotation dots */}
      {isAdmin && (
        <AdminPanel data={editableData} onChange={setEditableData} />
      )}
    </>
  )
}
