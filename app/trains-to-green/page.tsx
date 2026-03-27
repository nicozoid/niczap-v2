import type { Metadata } from "next"
import { ProjectLayout } from "@/components/project/project-layout"
import { ProjectTitle } from "@/components/project/project-title"
import { ContentSection } from "@/components/project/content-section"
import Image from "next/image"
import { NextProject } from "@/components/project/next-project"
import { getProject } from "@/data/projects"

// Pull title & description from the shared data file so they stay in sync with the homepage
const project = getProject("/trains-to-green")

export const metadata: Metadata = {
  title: `${project.title} | Nicolas Holzapfel`,
}

// --- Logo garden types + data ---

// Helper shorthands for the two external CDNs we use:
// - Simple Icons (SI): mono SVGs with brand colours (good for flat/monochrome marks)
// - Devicons (DI): full-colour multi-tone SVGs (better for complex coloured logos)
const SI = (slug: string) => `https://cdn.simpleicons.org/${slug}`
const DI = (name: string) =>
  `https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/${name}/${name}-original.svg`

// `darkInvert: true` applies Tailwind's `dark:invert` so black logos flip white in dark mode.
type LogoItem = { name: string; src?: string; darkInvert?: boolean }

const techStackItems: LogoItem[] = [
  { name: "React",        src: DI("react") },
  { name: "Tailwind CSS", src: DI("tailwindcss") },
  { name: "shadcn/ui",    src: SI("shadcnui"), darkInvert: true }, // black mark, needs invert
  { name: "Vercel",       src: SI("vercel"),   darkInvert: true }, // black triangle, needs invert
]

const toolItems: LogoItem[] = [
  { name: "VS Code",      src: DI("vscode") },
  { name: "Claude Code",  src: SI("anthropic"), darkInvert: true }, // black Anthropic A mark
  { name: "Figma",        src: DI("figma") },
  { name: "Midjourney",   src: "/logos/midjourney.svg" },  // local SVG — not on any CDN
  { name: "Recraft",      src: "/logos/recraft.svg" },     // local SVG — not on any CDN
]

// Renders a horizontal wrapping row of logo + label tiles.
function LogoGarden({ items }: { items: LogoItem[] }) {
  return (
    <div className="flex flex-wrap gap-6">
      {items.map(({ name, src, darkInvert }) => (
        <div key={name} className="flex flex-col items-center gap-2 w-14">
          {src ? (
            // `object-contain` keeps the image inside its box without distortion.
            // `dark:invert` flips black logos to white when the site is in dark mode.
            <img
              src={src}
              alt={name}
              width={32}
              height={32}
              className={`w-8 h-8 object-contain${darkInvert ? " dark:invert" : ""}`}
            />
          ) : (
            // Fallback tile if no logo source is available.
            <div className="w-8 h-8 rounded bg-muted flex items-center justify-center text-sm font-medium text-muted-foreground">
              {name[0]}
            </div>
          )}
          {/* Label underneath — small and muted so logos stay the visual focus */}
          <span className="text-xs text-center text-muted-foreground leading-tight">{name}</span>
        </div>
      ))}
    </div>
  )
}

// ---------------------------------

export default function TrainsToGreenPage() {
  return (
    <ProjectLayout>

      <ProjectTitle
        title={project.title}
        subtitle={project.description}
      />

      {/* Hero image + link to live site — the outer div replaces StandaloneImage's wrapper
          so we can add extra content (the text link) without double margins */}
      <div className="my-12 mx-auto" style={{ maxWidth: 800 }}>
        <a href="https://trainstogreen.niczap.design" target="_blank" rel="noopener noreferrer">
          <Image
            src="/images/heros/trainstogreen-hero-art-green.png"
            alt="Trains to Green project hero"
            width={0}
            height={0}
            sizes="100vw"
            className="w-full h-auto"
          />
        </a>
        {/* Prominent text link below the image — arrow (→) signals external link */}
        <a
          href="https://trainstogreen.niczap.design"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 block text-center text-2xl font-bold text-green-700 underline underline-offset-4 hover:opacity-70 transition-opacity"
        >
          Trains to Green app →
        </a>
      </div>

      <ContentSection label="Context">
        <p>
          Trains to Green is a simple web app to help Londoners explore the countryside by train. I created it to test out new ways of designing and developing with AI — in particular, to what extent AI and basic frontend coding skills allows me to skip Figma and design entirely within the IDE.
        </p>
      </ContentSection>

      <ContentSection label="Tech stack">
        <LogoGarden items={techStackItems} />
      </ContentSection>

      <ContentSection label="Tools">
        <LogoGarden items={toolItems} />
      </ContentSection>

      <ContentSection label="Approach">
        <p>
          The vast majority of the app was created via instructions to Claude — including interacting with the various APIs utilised (Google Maps, Mapbox, and Flickr) and building out the initial user interface. I manually edited the code only to fine-tune some of the Tailwind styling, and to make copy changes.
        </p>
        <p>
          On occasion, I did find it helpful to use Figma to play with quick visual comparisons. For this I used{" "}
          <a href="http://html.to.design" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:opacity-70 transition-opacity">html.to.design</a>
          {" "}to create a Figma design from the code (I was surprised to discover this plugin did a better job than the Figma MCP server). I used Midjourney to create the artwork and Recraft to create the logo (Recraft, unlike Midjourney, allows the creation of vector images).
        </p>
      </ContentSection>

      <ContentSection label="Conclusion">
        <p>
          Claude Opus 4.6 is absolutely stunning, and I was amazed at how far I could go without touching the code myself. I was satisfied that it&apos;s eminently possible to rapidly design and build a simple app in the IDE without losing design control. While I intend to further push this approach in solo work, the question remains for me if/how this approach could function within a team, and with a mature/advanced web app.
        </p>
      </ContentSection>

      {/* Link to the next project in the homepage grid order (Sylvera) */}
      <NextProject
        href="/sylvera"
        imageSrc="/images/heros/sylvera-hero-green.png"
        imageAlt="Sylvera project hero"
      />

    </ProjectLayout>
  )
}
