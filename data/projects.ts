// Central registry of project metadata.
// Both the homepage cards and individual project pages import from here,
// so titles and descriptions stay in sync automatically.

export type Project = {
  /** The main heading shown on both the homepage card and the project page */
  title: string
  /** The supporting line shown below the title on both surfaces */
  description: string
  /** Path to the hero/card image */
  imageSrc: string
  /** Route for the project page, e.g. "/trains-to-green" */
  href: string
  /** Optional: tells the card component whether the image is light or dark,
   *  so it can pick a contrasting text colour */
  imageTone?: "light" | "dark"
  /** Optional: Tailwind object-position class for the card image, e.g. "object-left".
   *  Defaults to "object-center" if not set */
  imagePosition?: string
  /** If true, the project is excluded from the homepage grid but its page still works */
  hidden?: boolean
}

export const projects: Project[] = [
  {
    title: "AI-first design (personal project)",
    description:
      "Single-handedly designing & developing a web app with AI and code-literacy",
    imageSrc: "/images/heros/trainstogreen-art.png",
    href: "/trains-to-green",
    imageTone: "light",
    imagePosition: "object-left",
  },
  {
    title: "Carbon analytics product launch",
    description:
      "Transforming offline PDFs and CSVs into a new, productised in-app experience",
    imageSrc: "/images/heros/sylvera-hero.png",
    href: "/carbon-analytics",
    imageTone: "light",
  },
  {
    title: "Data product launch",
    description:
      "Designing a visual web app to make dataset anomaly detection accessible",
    imageSrc: "/images/heros/dave-hero.png",
    href: "/data-product",
    imageTone: "light",
  },
  {
    title: "Foundational design for fintech",
    description:
      "Bringing brand and UX coherence to a previously developer-led app design",
    imageSrc: "/images/heros/sigtech-hero.png",
    href: "/fintech-design",
    imageTone: "light",
  },
  {
    title: "Foundational design for AI startup",
    description: "Redesigning an early-stage AI product with lightning-fast development cycles but zero prior design involvement",
    imageSrc: "/images/heros/placeholder.png",
    href: "/ai-startup",
    hidden: true,
  },
  {
    title: "Researching & strategising UX for quants",
    description:
      "Building a research foundation for a product used exclusively by quantitative analysts",
    imageSrc: "/images/heros/research-hero.png",
    href: "/sig-research",
    hidden: true,
  },
  {
    title: "Redesigning dev tools for massively multiplayer games",
    description:
      "Rethinking the developer experience for a distributed game engine platform",
    imageSrc: "/images/heros/spatialos-hero.png",
    href: "/spatialos",
  },
]

// Helper to look up a project by its href (route path).
// Used by individual project pages to grab their own title/description.
export function getProject(href: string): Project {
  const project = projects.find((p) => p.href === href)
  if (!project) {
    throw new Error(`No project found for href: ${href}`)
  }
  return project
}
