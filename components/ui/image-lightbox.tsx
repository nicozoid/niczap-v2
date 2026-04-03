"use client"

import { useState, useCallback, useEffect } from "react"
import Image from "next/image"

// ImageLightbox wraps an image so that clicking it opens a full-screen overlay
// showing the image at its natural size. Click anywhere or press Escape to close.
// Reusable across all project pages.
export function ImageLightbox({
  src,
  alt,
  maxWidth,
}: {
  src: string
  alt: string
  /** Optional inline max-width constraint for the thumbnail (in px) */
  maxWidth?: number
}) {
  const [open, setOpen] = useState(false)

  const close = useCallback(() => setOpen(false), [])

  // Close on Escape key
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close()
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [open, close])

  // Prevent body scroll while the overlay is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [open])

  return (
    <>
      {/* Thumbnail — cursor indicates it's clickable */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="block cursor-zoom-in"
        style={maxWidth ? { maxWidth } : undefined}
      >
        <Image
          src={src}
          alt={alt}
          width={0}
          height={0}
          sizes="100vw"
          className="w-full h-auto"
        />
      </button>

      {/* Full-screen overlay — click anywhere to close */}
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 cursor-zoom-out"
          onClick={close}
        >
          {/* object-contain keeps the image within viewport bounds
              while displaying it as large as possible. p-8 gives breathing room. */}
          <Image
            src={src}
            alt={alt}
            width={0}
            height={0}
            sizes="100vw"
            className="max-w-[90vw] max-h-[90vh] w-auto h-auto object-contain"
          />
        </div>
      )}
    </>
  )
}
