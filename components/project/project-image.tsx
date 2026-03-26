import Image from "next/image"

// StandaloneImage: a full-width image within the container, with consistent vertical spacing.
// This is the default image treatment — used for the majority of project page images.
export function StandaloneImage({ src, alt, maxWidth }: { src: string; alt: string; maxWidth?: number }) {
  return (
    // my-12 matches the ~50px vertical margin used in v1
    // If maxWidth is provided, it constrains the image width via inline style
    // (inline style because Tailwind can't handle dynamic pixel values passed as props)
    <div className="my-12 mx-auto" style={maxWidth ? { maxWidth } : undefined}>
      {/* Next.js <Image> requires width and height props. Setting both to 0 and then
          overriding with className is the standard pattern for responsive images
          where you want 100% width and automatic height. sizes tells the browser
          what viewport fraction the image will occupy, so it downloads the right size. */}
      <Image
        src={src}
        alt={alt}
        width={0}
        height={0}
        sizes="100vw"
        className="w-full h-auto"
      />
    </div>
  )
}

// FullBleedImage: breaks out of the container to span the full viewport width.
// Used sparingly for large, high-impact shots (e.g. overview spreads).
// The .full-bleed CSS class (defined in globals.css) handles the breakout trick:
// position: relative + left: 50% + transform: translateX(-50%)
export function FullBleedImage({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="my-12 full-bleed">
      <Image
        src={src}
        alt={alt}
        width={0}
        height={0}
        sizes="100vw"
        className="w-full h-auto"
      />
    </div>
  )
}
