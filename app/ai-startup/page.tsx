import type { Metadata } from "next"
import { ProjectLayout } from "@/components/project/project-layout"
import { ProjectTitle } from "@/components/project/project-title"
import { ContentSection } from "@/components/project/content-section"
import { StandaloneImage } from "@/components/project/project-image"
import { ImageLightbox } from "@/components/ui/image-lightbox"
import { NextProject } from "@/components/project/next-project"
import { ProjectReflections } from "@/components/project/project-reflections"
import { getProject } from "@/data/projects"
import { ImageCarousel } from "@/components/ui/image-carousel"
import { BeforeAfterComparison } from "@/components/project/before-after/before-after-comparison"
import { yaretaProfileComparison } from "@/data/comparisons/yareta-profile"

const project = getProject("/ai-startup")

// 8 redesign screens — @2x retina exports, ordered by filename number
const redesignScreenshots = [
  { src: "/images/yareta/redesign/10 Dashboard populated.png", alt: "Redesign — Dashboard populated" },
  { src: "/images/yareta/redesign/20 Colleague analysis.png", alt: "Redesign — Colleague analysis" },
  { src: "/images/yareta/redesign/40 candidate.png", alt: "Redesign — Candidate" },
  { src: "/images/yareta/redesign/43 candidate kanban.png", alt: "Redesign — Candidate kanban" },
  { src: "/images/yareta/redesign/45 Benchmark.png", alt: "Redesign — Benchmark" },
  { src: "/images/yareta/redesign/50 yareta figma overview.png", alt: "Redesign — Yareta Figma overview" },
  { src: "/images/yareta/redesign/60 Onboarding flow v2.png", alt: "Redesign — Onboarding flow v2" },
  { src: "/images/yareta/redesign/70 Dashboard empty.png", alt: "Redesign — Dashboard empty" },
]

// All 11 screenshots from the original Yareta UI, ordered by filename number
const yaretaScreenshots = [
  { src: "/images/yareta/original-ui/image 6.png", alt: "Yareta UI screenshot 1" },
  { src: "/images/yareta/original-ui/image 3.png", alt: "Yareta UI screenshot 2" },
  { src: "/images/yareta/original-ui/image 5.png", alt: "Yareta UI screenshot 3" },
  { src: "/images/yareta/original-ui/image 8.png", alt: "Yareta UI screenshot 4" },
  { src: "/images/yareta/original-ui/image 9.png", alt: "Yareta UI screenshot 5" },
  { src: "/images/yareta/original-ui/image 10.png", alt: "Yareta UI screenshot 6" },
  { src: "/images/yareta/original-ui/image 13.png", alt: "Yareta UI screenshot 7" },
  { src: "/images/yareta/original-ui/image 14.png", alt: "Yareta UI screenshot 8" },
  { src: "/images/yareta/original-ui/image 15.png", alt: "Yareta UI screenshot 9" },
  { src: "/images/yareta/original-ui/image 16.png", alt: "Yareta UI screenshot 10" },
  { src: "/images/yareta/original-ui/image 18.png", alt: "Yareta UI screenshot 11" },
]

export const metadata: Metadata = {
  title: `${project.title} | Nicolas Holzapfel`,
}

export default function YaretaPage() {
  return (
    <ProjectLayout>

      <ProjectTitle
        title={project.title}
        subtitle={project.description}
      />

      <StandaloneImage src="/images/heros/yareta-hero-violet.png" alt="Yareta redesign overview" />

      <ContentSection label="Context">
        <p>
          Yareta is a seed-funded startup providing predictive AI insights on candidates
          and employees. Users upload everyday work documents, meeting transcripts, videos,
          presentations, CVs etc, and get AI-powered behavioural insights benchmarked
          against the company&apos;s custom benchmarks.
        </p>
        <p>
          The insights were powerful but their UI was confusing clients. I worked with
          Yareta&apos;s CEO, Product Success Manager, and Founding Psychologist to completely
          redesign the UX in just 8 working days.
        </p>
      </ContentSection>

      <ContentSection label="Original UIs">
        <p>
          The original UI had been designed and developed by a non-designer using Lovable.
          The UX was characterised by unnecessary complexity, clutter and fragmented flows.
          The problems had become obvious during recent client trials, and Yareta realised
          designer input was essential before the next round of client trials.
        </p>
      </ContentSection>

      <ImageCarousel images={yaretaScreenshots} />

      <ContentSection label="UX audit">
        <p>
          I began by analysing the existing builds, understanding the functionality, and
          cataloging the UX issues. Key problems included:
        </p>
        <ul>
          <li>Overwhelmingly busy UIs with weak hierarchy — rarely clear where the user should be focusing.</li>
          <li>Confusing and misleading hierarchy — e.g. hugely emphasising &quot;meeting date&quot; on a profile page that isn&apos;t tied to any one particular meeting — compounded by unnecessary use of ambiguous feature names (e.g. &quot;Success Profile&quot;, &quot;Success Builder&quot;)</li>
          <li>Maze-like navigation structure — user can&apos;t get an overview of what&apos;s available.</li>
          <li>Weak and unattractive brand — no strong personality coming through.</li>
          <li>Confusing copy — e.g. &quot;ongoing&quot; as a section title for an overall assessment of a given person, not tied to particular document.</li>
          <li>No reassurance about privacy and data access, a key concern for this sector.</li>
        </ul>
      </ContentSection>

      <ContentSection label="UX architecture">
        <p>
          Moving on to solutions, I began by agreeing with the CEO who the core target
          user was and what the &quot;red route&quot; — the optimal user flow — should look like
          at a high level. From there I was able to propose a complete reworking of the
          app structure.
        </p>
        <p>
          Due to the specific needs of a major tech corp that Yareta was pitching to,
          the red route centred around a head of HR struggling to hire candidates who
          matched with the company&apos;s specific culture. The user needed to quickly
          experience candidate analysis, and to be guided through creating{" "}
          <em>company-specific</em> assessment benchmarks.
        </p>
      </ContentSection>

      <div className="my-12">
        <ImageLightbox src="/images/yareta/ux-architecture/red-route.png" alt="Red route diagram" retina />
      </div>
      <div className="my-12">
        <ImageLightbox src="/images/yareta/ux-architecture/app-structure.png" alt="App structure diagram" retina />
      </div>

      <ContentSection label="Redesign">
        <p>
          Using the existing barebones marketing brand, and a shadcn/ui-based Figma
          library (because Lovable is trained principally on shadcn/ui), I created a
          basic design system and got stuck into designing the red route UI.
        </p>
        <p>
          My focus was on reducing the number of clicks to the &quot;wow&quot; moment, creating
          a clear navigation structure, and developing an attractive look-and-feel, with
          each page embodying a decisive and informative hierarchy.
        </p>
        <p>
          The design went through several rounds of iterations, first mainly from
          Yareta&apos;s in-house psychologist, and her experience of client needs, and then
          based on initial client feedback. The biggest change I made was to replace the
          multi-step onboarding wizard with empty states, after I realised that the
          initial onboarding was an unnecessary complication.
        </p>
      </ContentSection>

      <ImageCarousel images={redesignScreenshots} retina />

      <ContentSection label="Deep dive">
        <p>
          To illustrate how I overhauled the app, I'll walk through the
          transformation of a single screen. The first challenge was separating
          the genuinely useful content from the noise — Lovable's vibe-coded
          output had buried real functionality under layers of visual and
          structural bloat. Once I'd identified what actually mattered, I could
          reorganise the content and flows around real user needs. More often
          than not, that meant cutting. What looked like a feature-rich
          interface was largely unnecessary bloat.
        </p>
      </ContentSection>

      <BeforeAfterComparison data={yaretaProfileComparison} />

      <ProjectReflections
        bulleted={false}
        wins={[
          "The designs defined the remaking of the product via Lovable, and was immediately used in pitches, leading to the company's biggest month-to-month deal so far, and a paid trial with a major tech corp.",
          <blockquote className="relative pl-14 text-lg font-medium italic leading-relaxed">
            <span className="absolute left-0 top-0 text-7xl font-serif leading-none text-muted-foreground/40" aria-hidden="true">&ldquo;</span>
            First sale of the new product today. First pitch of it also.<br />100% success rate. They LOVED it
          </blockquote>,
        ]}
        learnings={[
          <>Due to budget constraints I had limited involvement in the implementation of the designs via Lovable. Combined with the inherent limitations of vibe-coding, this resulted in deviations from the intended UX. This experience pushed me to learn frontend development so I can deliver <a href="/trains-to-green">design as code</a> rather than as a Figma file.</>,
        ]}
      />

      <NextProject
        href="/carbon-analytics"
        imageSrc="/images/heros/sylvera-hero-green.png"
        imageAlt="Sylvera app designs"
      />

    </ProjectLayout>
  )
}
