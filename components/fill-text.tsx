"use client"

import { useRef, useEffect, useState } from "react"

interface FillTextProps {
  children: React.ReactNode
  className?: string
}

// Scales text to fill its container in both width and height.
// Works by binary-searching the font size: try a midpoint, measure if it fits,
// then narrow the search range until we find the largest size that fits.
// A ResizeObserver re-runs the calculation whenever the container changes size.
export function FillText({ children, className }: FillTextProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLDivElement>(null)
  // Start invisible to avoid a flash of unsized text before the effect runs
  const [fontSize, setFontSize] = useState<number | null>(null)

  useEffect(() => {
    const fit = () => {
      const container = containerRef.current
      const text = textRef.current
      if (!container || !text) return

      const maxW = container.clientWidth
      const maxH = container.clientHeight

      // If the container hasn't been laid out yet, bail out.
      // The ResizeObserver will fire again once it has real dimensions.
      if (maxH <= 0 || maxW <= 0) return

      let low = 1
      let high = 600

      // Binary search: find the largest font size where text still fits
      while (high - low > 1) {
        const mid = Math.round((low + high) / 2)
        text.style.fontSize = `${mid}px`
        const fits = text.scrollHeight <= maxH && text.scrollWidth <= maxW
        if (fits) {
          low = mid
        } else {
          high = mid
        }
      }

      // Directly update the DOM to the correct size immediately.
      // Without this, if `low` hasn't changed since the last render, React will
      // skip the re-render and leave text.style.fontSize at whatever the last
      // binary search iteration set it to — which is low+1, causing overflow.
      text.style.fontSize = `${low}px`
      setFontSize(low)
    }

    fit()

    // Re-run whenever the container is resized (e.g. browser window resize)
    const observer = new ResizeObserver(fit)
    if (containerRef.current) observer.observe(containerRef.current)
    return () => observer.disconnect()
  }, [])

  return (
    // Container must have a defined size for scrollHeight/scrollWidth comparisons to work
    <div ref={containerRef} className={`w-full h-full overflow-hidden ${className ?? ""}`}>
      <div
        ref={textRef}
        // Invisible until the first size calculation completes, then fade in
        className={fontSize === null ? "invisible" : "visible"}
        style={{ fontSize: fontSize ?? 16 }}
      >
        {children}
      </div>
    </div>
  )
}
