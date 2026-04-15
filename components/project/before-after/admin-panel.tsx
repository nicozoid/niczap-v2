"use client"

import { useState, useCallback, useMemo, useRef } from "react"
import { RiDeleteBin2Line, RiCloseLine, RiDraggable } from "@remixicon/react"
import type { ComparisonData, Annotation } from "./types"

/** Dev-only floating panel for editing annotation dots.
 *
 *  Dynamically imported (next/dynamic) so it's tree-shaken from production.
 *  Activate with ?admin=true query param.
 *
 *  Click "Save" to write changes to disk via /api/save-annotations.
 */
export default function AdminPanel({
  data,
  onChange,
}: {
  data: ComparisonData
  onChange: (data: ComparisonData) => void
}) {
  // --- Dragging ---
  const [position, setPosition] = useState({ x: 16, y: window.innerHeight - 16 })
  const [anchored, setAnchored] = useState<"bottom-left"| null>("bottom-left")
  const dragRef = useRef<{ startX: number; startY: number; originX: number; originY: number } | null>(null)

  const onDragStart = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    const panel = (e.currentTarget as HTMLElement).closest("[data-admin-panel]") as HTMLElement
    if (!panel) return
    const rect = panel.getBoundingClientRect()
    dragRef.current = { startX: e.clientX, startY: e.clientY, originX: rect.left, originY: rect.top }
    setAnchored(null)

    const onMove = (ev: MouseEvent) => {
      if (!dragRef.current) return
      const dx = ev.clientX - dragRef.current.startX
      const dy = ev.clientY - dragRef.current.startY
      setPosition({ x: dragRef.current.originX + dx, y: dragRef.current.originY + dy })
    }
    const onUp = () => {
      dragRef.current = null
      window.removeEventListener("mousemove", onMove)
      window.removeEventListener("mouseup", onUp)
    }
    window.addEventListener("mousemove", onMove)
    window.addEventListener("mouseup", onUp)
  }, [])

  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle")

  const saveToDisk = useCallback(() => {
    if (!data.dataFile) {
      console.error("[Admin] No dataFile on ComparisonData — can't save.", data)
      setSaveStatus("error")
      setTimeout(() => setSaveStatus("idle"), 2000)
      return
    }
    setSaveStatus("saving")
    fetch("/api/save-annotations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        dataFile: data.dataFile,
        annotations: {
          before: data.before.annotations,
          after: data.after.annotations,
          linkedPairs: data.linkedPairs,
        },
      }),
    })
      .then(async (res) => {
        if (!res.ok) {
          const body = await res.text()
          console.error("[Admin] Save failed:", res.status, body)
        }
        setSaveStatus(res.ok ? "saved" : "error")
        setTimeout(() => setSaveStatus("idle"), 2000)
      })
      .catch((err) => {
        console.error("[Admin] Save fetch error:", err)
        setSaveStatus("error")
        setTimeout(() => setSaveStatus("idle"), 2000)
      })
  }, [data])

  // Pairing mode: which annotation is looking for its twin, and what type is it
  const [pairingId, setPairingId] = useState<string | null>(null)
  const [pairingVariant, setPairingVariant] = useState<"before" | "after" | null>(null)

  // IDs already in a linked pair — each annotation can only be in one pair
  const pairedIds = new Set(
    (data.linkedPairs || []).flat()
  )

  // --- Derived data: split annotations into couples and singles ---

  const couples = useMemo(() => {
    if (!data.linkedPairs) return []
    return data.linkedPairs.map(([beforeId, afterId]) => {
      const beforeAnn = data.before.annotations.find((a) => a.id === beforeId)
      const afterAnn = data.after.annotations.find((a) => a.id === afterId)
      return { beforeAnn, afterAnn, beforeId, afterId }
    }).filter((c) => c.beforeAnn && c.afterAnn)
  }, [data])

  const singlesBefore = useMemo(
    () => data.before.annotations.filter((a) => !pairedIds.has(a.id)),
    [data.before.annotations, pairedIds]
  )

  const singlesAfter = useMemo(
    () => data.after.annotations.filter((a) => !pairedIds.has(a.id)),
    [data.after.annotations, pairedIds]
  )

  // --- Callbacks ---

  const deleteAnnotation = useCallback(
    (variant: "before" | "after", id: string) => {
      onChange({
        ...data,
        [variant]: {
          ...data[variant],
          annotations: data[variant].annotations.filter((a) => a.id !== id),
        },
        linkedPairs: (data.linkedPairs || []).filter(
          ([b, a]) => b !== id && a !== id
        ),
      })
    },
    [data, onChange]
  )

  // Unpair a couple — removes the link but keeps both annotations as singles
  const unpair = useCallback(
    (beforeId: string, afterId: string) => {
      onChange({
        ...data,
        linkedPairs: (data.linkedPairs || []).filter(
          ([b, a]) => !(b === beforeId && a === afterId)
        ),
      })
    },
    [data, onChange]
  )

  // Start pairing mode from a specific annotation
  const startPairing = useCallback((id: string, variant: "before" | "after") => {
    setPairingId(id)
    setPairingVariant(variant)
  }, [])

  const cancelPairing = useCallback(() => {
    setPairingId(null)
    setPairingVariant(null)
  }, [])

  // Complete a pair — always store as [beforeId, afterId]
  const completePair = useCallback(
    (targetId: string) => {
      if (!pairingId || !pairingVariant) return
      const pair: [string, string] = pairingVariant === "before"
        ? [pairingId, targetId]
        : [targetId, pairingId]
      onChange({
        ...data,
        linkedPairs: [...(data.linkedPairs || []), pair],
      })
      cancelPairing()
    },
    [data, onChange, pairingId, pairingVariant, cancelPairing]
  )

  const updateLabel = useCallback(
    (variant: "before" | "after", id: string, label: string) => {
      onChange({
        ...data,
        [variant]: {
          ...data[variant],
          annotations: data[variant].annotations.map((a) =>
            a.id === id ? { ...a, label } : a
          ),
        },
      })
    },
    [data, onChange]
  )

  // Is pairing mode active?
  const isPairing = pairingId !== null

  /** A single annotation row: colored circle + text input + trash icon */
  const renderRow = (variant: "before" | "after", a: Annotation) => (
    <div key={a.id} className="flex items-center gap-1.5">
      {variant === "before" ? (
        <span className="shrink-0 w-2.5 h-2.5 rounded-full bg-[var(--negative)]" />
      ) : (
        <span className="shrink-0 w-2.5 h-2.5 rounded-full bg-[var(--positive)]" />
      )}
      <input
        type="text"
        value={a.label}
        onChange={(e) => updateLabel(variant, a.id, e.target.value)}
        className="flex-1 min-w-0 px-1.5 py-0.5 border border-gray-200 rounded text-xs"
      />
      <button
        type="button"
        onClick={() => deleteAnnotation(variant, a.id)}
        className="shrink-0 p-0.5 rounded hover:bg-red-50 text-gray-400 hover:text-red-500 cursor-pointer"
        title="Delete annotation"
      >
        <RiDeleteBin2Line className="w-3.5 h-3.5" />
      </button>
    </div>
  )

  return (
    <div
      data-admin-panel
      className="fixed z-[60] w-80 max-w-4xl md:w-full max-h-[60vh] overflow-y-auto rounded-lg bg-white text-black text-xs shadow-2xl border border-gray-200 p-3 space-y-3"
      style={anchored === "bottom-left"
        ? { bottom: 16, left: 16 }
        : { top: position.y, left: position.x }
      }
    >
      {/* Drag handle + title + save button */}
      <div
        className="flex items-center justify-between cursor-grab active:cursor-grabbing select-none"
        onMouseDown={onDragStart}
      >
        <div className="flex items-center gap-1">
          <RiDraggable className="w-4 h-4 text-gray-400 shrink-0" />
          <h3 className="font-bold text-sm">Edit annotations</h3>
        </div>
        <button
          type="button"
          onClick={saveToDisk}
          disabled={saveStatus === "saving"}
          className={`px-3 py-1 rounded cursor-pointer text-xs font-medium transition-colors ${
            saveStatus === "saved" ? "bg-green-600 text-white" :
            saveStatus === "error" ? "bg-red-600 text-white" :
            saveStatus === "saving" ? "bg-gray-300 text-gray-500" :
            "bg-blue-600 text-white hover:bg-blue-700"
          }`}
        >
          {saveStatus === "saving" ? "Saving..." :
           saveStatus === "saved" ? "Saved!" :
           saveStatus === "error" ? "Error — retry" :
           "Save"}
        </button>
      </div>

      {/* --- Singles: unpaired annotations --- */}
      {(singlesBefore.length > 0 || singlesAfter.length > 0) && (
        <div className="space-y-1">
          <h4 className="font-semibold text-gray-700 mb-1">Singles</h4>

          {singlesBefore.map((a) => (
            <div key={a.id} className="flex items-center gap-1">
              <div className="flex-1 min-w-0">
                {renderRow("before", a)}
              </div>
              {/* This annotation is the one in pairing mode */}
              {pairingId === a.id ? (
                <div className="flex items-center gap-0.5">
                  <span className="shrink-0 px-1.5 py-0.5 rounded bg-yellow-300 text-[10px]">
                    Choose twin
                  </span>
                  <button
                    type="button"
                    onClick={cancelPairing}
                    className="shrink-0 p-0.5 rounded hover:bg-gray-200 cursor-pointer"
                    title="Cancel"
                  >
                    <RiCloseLine className="w-3 h-3" />
                  </button>
                </div>
              ) : isPairing && pairingVariant === "after" ? (
                /* Pairing from an After annotation — this Before is a compatible target */
                <button
                  type="button"
                  onClick={() => completePair(a.id)}
                  className="shrink-0 px-1.5 py-0.5 rounded bg-yellow-300 hover:bg-yellow-400 cursor-pointer text-[10px]"
                >
                  Select
                </button>
              ) : !isPairing ? (
                /* Normal state — show Pair button */
                <button
                  type="button"
                  onClick={() => startPairing(a.id, "before")}
                  className="shrink-0 px-1.5 py-0.5 rounded bg-gray-100 hover:bg-gray-200 cursor-pointer text-[10px]"
                >
                  Pair
                </button>
              ) : null}
            </div>
          ))}

          {singlesAfter.map((a) => (
            <div key={a.id} className="flex items-center gap-1">
              <div className="flex-1 min-w-0">
                {renderRow("after", a)}
              </div>
              {/* This annotation is the one in pairing mode */}
              {pairingId === a.id ? (
                <div className="flex items-center gap-0.5">
                  <span className="shrink-0 px-1.5 py-0.5 rounded bg-yellow-300 text-[10px]">
                    Choose twin
                  </span>
                  <button
                    type="button"
                    onClick={cancelPairing}
                    className="shrink-0 p-0.5 rounded hover:bg-gray-200 cursor-pointer"
                    title="Cancel"
                  >
                    <RiCloseLine className="w-3 h-3" />
                  </button>
                </div>
              ) : isPairing && pairingVariant === "before" ? (
                /* Pairing from a Before annotation — this After is a compatible target */
                <button
                  type="button"
                  onClick={() => completePair(a.id)}
                  className="shrink-0 px-1.5 py-0.5 rounded bg-yellow-300 hover:bg-yellow-400 cursor-pointer text-[10px]"
                >
                  Select
                </button>
              ) : !isPairing ? (
                /* Normal state — show Pair button */
                <button
                  type="button"
                  onClick={() => startPairing(a.id, "after")}
                  className="shrink-0 px-1.5 py-0.5 rounded bg-gray-100 hover:bg-gray-200 cursor-pointer text-[10px]"
                >
                  Pair
                </button>
              ) : null}
            </div>
          ))}
        </div>
      )}

      {/* --- Couples: linked before↔after pairs --- */}
      {couples.length > 0 && (
        <div className="space-y-1">
          <h4 className="font-semibold text-gray-700 mb-1">Couples</h4>
          {couples.map(({ beforeAnn, afterAnn, beforeId, afterId }) => (
            <div key={beforeId} className="space-y-1 pb-2 mb-2 border-b border-gray-100 last:border-0 last:pb-0 last:mb-0">
              {renderRow("before", beforeAnn!)}
              <div className="flex items-center gap-1">
                <div className="flex-1 min-w-0">
                  {renderRow("after", afterAnn!)}
                </div>
                {!isPairing && (
                  <button
                    type="button"
                    onClick={() => unpair(beforeId, afterId)}
                    className="shrink-0 px-1.5 py-0.5 rounded bg-gray-100 hover:bg-gray-200 cursor-pointer text-[10px]"
                    title="Unpair these annotations"
                  >
                    Unpair
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
