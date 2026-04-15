/** A single annotation dot positioned on an image.
 *  x/y are percentages (0–100) of the image's width/height,
 *  so they scale correctly at any display size or zoom level. */
export type Annotation = {
  id: string
  /** Horizontal position as a percentage (0–100) of image width */
  x: number
  /** Vertical position as a percentage (0–100) of image height */
  y: number
  /** Text shown when the dot is hovered (desktop) or tapped (mobile) */
  label: string
}

/** Everything needed to render a before/after comparison. */
export type ComparisonData = {
  before: {
    src: string
    alt: string
    annotations: Annotation[]
  }
  after: {
    src: string
    alt: string
    annotations: Annotation[]
  }
  /** Pairs of annotation IDs that refer to the same design change.
   *  Each tuple is [beforeAnnotationId, afterAnnotationId].
   *  Hovering one highlights the other. */
  linkedPairs?: [string, string][]
  /** Set true when images are @2x retina exports — divides rendered
   *  size by devicePixelRatio so they display at intended design size. */
  retina?: boolean
  /** Path to the data file relative to project root, e.g. "data/comparisons/yareta-profile.ts".
   *  Used by admin mode to auto-save annotation changes back to disk. */
  dataFile?: string
}
