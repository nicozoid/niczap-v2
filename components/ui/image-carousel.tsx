"use client"

import { useState, useCallback, useEffect, useRef } from "react"
import Image from "next/image"
import { RiArrowLeftSLine, RiArrowRightSLine, RiCloseLine } from "@remixicon/react"

// How many images to show in the collage grid.
// The first image is large (left column), the rest fill a 2×2 grid on the right.
// Any remaining images are only visible in the overlay.
const COLLAGE_COUNT = 5

// ImageCarousel shows a collage grid of images. Clicking any image opens a
// fullscreen overlay carousel with prev/next navigation, thumbnails, and a counter.
// Reusable across any page that needs a multi-image gallery.
export function ImageCarousel({
  images,
  retina,
}: {
  images: { src: string; alt: string }[]
  /** Set to true when images are @2x retina exports. Divides rendered size
   *  by devicePixelRatio so they display at their intended design size.
   *  Default false — images render at natural pixel size. */
  retina?: boolean
}) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [overlayOpen, setOverlayOpen] = useState(false)
  const overlayRef = useRef<HTMLDivElement>(null)

  // Infinite loop navigation via modulo
  const goPrev = useCallback(
    () => setCurrentIndex((i) => (i - 1 + images.length) % images.length),
    [images.length],
  )
  const goNext = useCallback(
    () => setCurrentIndex((i) => (i + 1) % images.length),
    [images.length],
  )

  // Open overlay at a specific image
  const openAt = (index: number) => {
    setCurrentIndex(index)
    setOverlayOpen(true)
  }
  const closeOverlay = useCallback(() => setOverlayOpen(false), [])

  // Reset scroll position when switching images
  useEffect(() => {
    if (overlayRef.current) {
      overlayRef.current.scrollTop = 0
      overlayRef.current.scrollLeft = 0
    }
  }, [currentIndex])

  // Keyboard: Escape closes overlay, arrows navigate
  useEffect(() => {
    if (!overlayOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeOverlay()
      if (e.key === "ArrowLeft") goPrev()
      if (e.key === "ArrowRight") goNext()
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [overlayOpen, closeOverlay, goPrev, goNext])

  // Lock body scroll while overlay is open
  useEffect(() => {
    document.body.style.overflow = overlayOpen ? "hidden" : ""
    return () => { document.body.style.overflow = "" }
  }, [overlayOpen])

  // Split images into the hero (large left image) and the grid thumbnails (right column)
  const collageImages = images.slice(0, COLLAGE_COUNT)
  const heroImage = collageImages[0]
  const gridImages = collageImages.slice(1)

  return (
    <>
      {/* ──────────────────── COLLAGE GRID ──────────────────── */}

      {/* ── Mobile: single image + dot indicators (below md) ── */}
      <div className="my-12 md:hidden">
        <button
          type="button"
          onClick={() => openAt(0)}
          className="w-full aspect-[4/3] cursor-pointer overflow-hidden relative rounded-lg border border-black/10"
        >
          <Image
            src={heroImage.src}
            alt={heroImage.alt}
            fill
            sizes="100vw"
            className="object-cover object-left-top"
          />
        </button>

        {/* Dot indicators — one per image, tappable to jump into the overlay */}
        {images.length > 1 && (
          <div className="flex justify-center gap-1.5 mt-3">
            {images.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => openAt(i)}
                className={`w-2 h-2 rounded-full cursor-pointer transition-colors ${
                  i === 0
                    ? "bg-black"                /* highlight the visible image */
                    : "bg-black/25"             /* dim the rest */
                }`}
                aria-label={`View image ${i + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* ── Desktop: Klook-style collage (md and above) ── */}
      <div className="my-12 hidden md:block">
        {/* Two-column layout: full-height hero on the left, 2×2 grid on the right */}
        <div className="flex gap-1.5 h-[500px]">

          {/* Hero image — left column, full height, ~60% width */}
          <button
            type="button"
            onClick={() => openAt(0)}
            className="flex-[3] min-w-0 cursor-pointer overflow-hidden relative rounded-lg border border-black/10"
          >
            <Image
              src={heroImage.src}
              alt={heroImage.alt}
              fill
              sizes="60vw"
              className="object-cover object-left-top"
            />
          </button>

          {/* Right column — 2×2 grid of equally-sized images.
              Each cell is a clickable thumbnail. */}
          <div className="flex-[2] min-w-0 grid grid-cols-2 grid-rows-2 gap-1.5">
            {gridImages.map((image, i) => (
              <button
                key={i}
                type="button"
                onClick={() => openAt(i + 1)}
                className="cursor-pointer overflow-hidden relative rounded-lg border border-black/10"
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  sizes="20vw"
                  className="object-cover object-left-top"
                />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ──────────────────── FULLSCREEN OVERLAY ──────────────────── */}
      {overlayOpen && (
        <div
          ref={overlayRef}
          className="fixed inset-0 z-50 bg-black/80 cursor-pointer overflow-auto scrollbar-visible"
          onClick={closeOverlay}
        >
          {/* Close button */}
          <button
            type="button"
            onClick={closeOverlay}
            className="fixed top-4 right-4 z-10 cursor-pointer rounded-full p-2 transition-colors text-white bg-black/40 hover:bg-black/60"
            aria-label="Close gallery"
          >
            <RiCloseLine className="w-8 h-8" />
          </button>

          {/* Previous arrow — always dark so it's visible on both light images and dark bg */}
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); goPrev() }}
            className="fixed left-3 top-1/2 -translate-y-1/2 z-10 cursor-pointer rounded-full p-2 transition-colors text-white bg-black/40 hover:bg-black/60"
            aria-label="Previous image"
          >
            <RiArrowLeftSLine className="w-6 h-6" />
          </button>

          {/* Next arrow — always dark */}
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); goNext() }}
            className="fixed right-3 top-1/2 -translate-y-1/2 z-10 cursor-pointer rounded-full p-2 transition-colors text-white bg-black/40 hover:bg-black/60"
            aria-label="Next image"
          >
            <RiArrowRightSLine className="w-6 h-6" />
          </button>

          {/* Inner wrapper: min-h-full so it's at least viewport height (centering
              short images), but grows taller for large images (keeping scrollability). */}
          <div className="min-h-full min-w-full w-fit flex items-center p-12">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={images[currentIndex].src}
              alt={images[currentIndex].alt}
              className="block"
              style={{ maxWidth: "none", margin: "0 auto" }}
              onClick={(e) => e.stopPropagation()}
              onLoad={(e) => {
                const img = e.currentTarget
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
