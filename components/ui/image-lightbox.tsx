"use client"

import { useState, useCallback, useEffect } from "react"
import Image from "next/image"
import { RiCloseLine } from "@remixicon/react"

// ImageLightbox wraps an image so that clicking it opens a full-screen overlay
// showing the image at its "actual size" — i.e. native pixels divided by the
// display's devicePixelRatio, so @2x retina images look correct.
// The overlay is scrollable if the image exceeds the viewport.
// Reusable across all project pages.
export function ImageLightbox({
  src,
  alt,
  maxWidth,
  retina,
}: {
  src: string
  alt: string
  /** Optional inline max-width constraint for the thumbnail (in px) */
  maxWidth?: number
  /** Set to true when the image is a @2x retina export. Divides rendered size
   *  by devicePixelRatio so it displays at its intended design size.
   *  Default false — image renders at natural pixel size. */
  retina?: boolean
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
    document.body.style.overflow = open ? "hidden" : ""
    return () => { document.body.style.overflow = "" }
  }, [open])

  return (
    <>
      {/* Thumbnail — cursor indicates it's clickable */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="block cursor-pointer"
        style={maxWidth ? { maxWidth } : undefined}
      >
        <Image
          src={src}
          alt={alt}
          width={0}
          height={0}
          sizes="100vw"
          /* w-full keeps the image responsive to container width;
             max-h-[750px] caps tall images; w-auto + object-contain
             ensure the image shrinks proportionally when height-capped
             rather than stretching */
          className="w-full h-auto max-h-[750px] object-contain"
        />
      </button>

      {/* Full-screen overlay — scrollable if image exceeds viewport */}
      {open && (
        <div
          className="fixed inset-0 z-50 bg-black/80 cursor-pointer overflow-auto scrollbar-visible"
          onClick={close}
        >
          {/* Close button */}
          <button
            type="button"
            onClick={close}
            className="fixed top-4 right-4 z-10 cursor-pointer rounded-full p-2 transition-colors text-white bg-black/40 hover:bg-black/60"
            aria-label="Close"
          >
            <RiCloseLine className="w-8 h-8" />
          </button>

          {/* Inner wrapper: min-h-full so it's at least viewport height (centering
              short images), but grows taller for large images (keeping scrollability).
              flex + items-center + justify-center handles vertical & horizontal centering. */}
          <div className="min-h-full min-w-full w-fit flex items-center p-12">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={src}
              alt={alt}
              className="block"
              style={{ maxWidth: "none", margin: "0 auto" }}
              onClick={(e) => e.stopPropagation()}
              onLoad={(e) => {
                const img = e.currentTarget
                // Only divide by devicePixelRatio for @2x retina exports;
                // regular 1× images render at their natural pixel size.
                const scale = retina ? (window.devicePixelRatio || 1) : 1
                img.style.width = `${img.naturalWidth / scale}px`
                img.style.height = `${img.naturalHeight / scale}px`
              }}
            />
          </div>
        </div>
      )}
    </>
  )
}
