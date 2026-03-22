import type { Metadata } from "next"
import { ProjectLayout } from "@/components/project/project-layout"
import { ProjectTitle } from "@/components/project/project-title"
import { ContentSection } from "@/components/project/content-section"
import { StandaloneImage } from "@/components/project/project-image"
import { ProjectReflections } from "@/components/project/project-reflections"
import { NextProject } from "@/components/project/next-project"

export const metadata: Metadata = {
  title: "Researching & strategising UX for quants | Nicolas Holzapfel",
}

export default function SigResearchPage() {
  return (
    <ProjectLayout>

      <ProjectTitle
        title="Researching & strategising UX for quants"
        subtitle="Bringing complex user experience to the company consciousness — and fixing the top issue with a game-like onboarding."
      />

      <ContentSection label="Context">
        <p>
          Thinking beyond UI design, I aimed to build a shared, holistic view of the full user
          experience. I noticed that valuable insights, often held by individuals in support and
          account management, weren't reaching the wider team. I took the initiative to capture and
          share this knowledge, helping the company better understand and serve its users.
        </p>
      </ContentSection>

      {/* The hero image is used here as a standalone content image, not just a hero thumbnail */}
      <StandaloneImage src="/images/heros/research-hero-violet.png" alt="" />

      <ContentSection label="Database of user issues">
        <p>
          I combined this with insights from my own user interviews and platform usage data to build
          a comprehensive database of UX issues. This allowed me to identify and rank the most
          critical problems and propose a focused strategy to address them.
        </p>
      </ContentSection>

      <ContentSection label="Learning-curve as the no. 1 UX issue">
        <p>
          56% of users cited the steep learning curve (or lack of time/motivation to overcome it)
          as their biggest barrier — above any missing feature or technical bug. The less technical
          the user, the less satisfied they were.
        </p>
      </ContentSection>

      <ContentSection label="Tech writing to the rescue">
        <p>
          The core challenge was a decade-old, complex Python library at the heart of the platform.
          I successfully pushed for hiring a small tech-writing team to create step-by-step beginner
          tutorials. To deepen my own understanding, I learned basic Python and wrote several of the
          first guides myself.
        </p>
      </ContentSection>

      <ContentSection label="Prioritisation">
        <p>
          Overhauling all documentation was impossible, so I focused on the asset classes most
          critical to our users and business (futures, FX, volatility, swaps, equities). By designing
          game-like onboarding journeys for these five, new users could get started quickly — and be
          motivated to explore the rest through standard docs.
        </p>
      </ContentSection>

      <StandaloneImage src="/images/sig-research/research-02.png" alt="" />

      <ContentSection label="Content principles">
        {/* The intro sentence lives in the right column here — same visual result as v1
            where it appeared below the h2 in the left column */}
        <p>
          To shape the learning experience, I defined five principles inspired by gaming UX.
        </p>
        {/* ol for the numbered principles — numbered lists signal an ordered, deliberate sequence */}
        <ol>
          <li><strong>Puzzles, not walkthroughs:</strong> Minimise reading — let users learn by doing. Keep text to the essentials, with explainers reserved for reference and advanced topics.</li>
          <li><strong>Hide complexity:</strong> Introduce one narrow concept per puzzle. Keep extra detail hidden to avoid overwhelming users.</li>
          <li><strong>Make me think</strong> (but not too much): Require enough thought to grasp the concept, but keep puzzles achievable — too much difficulty demotivates.</li>
          <li><strong>Build anticipation:</strong> Motivate users by previewing outcomes (e.g. "by the end you'll…" or screenshots of what they'll produce).</li>
          <li><strong>Clear progress:</strong> Provide instant feedback and a visible sense of advancement as users move through the journey.</li>
        </ol>
      </ContentSection>

      <StandaloneImage src="/images/sig-research/research-03.png" alt="" />

      <ContentSection label="The student to usability test pipeline">
        <p>
          To keep improving the experience, I set up regular usability testing by offering free
          platform access to financial engineering students in exchange for participating in observed
          sessions. This provided valuable insight into the critical first hour of the user journey
          and helped uncover early friction points that weren't visible through internal use alone.
        </p>
      </ContentSection>

      <ProjectReflections
        wins={[
          "The initiative to break siloes and share user insights was a success — even account managers realised they'd incorrectly assumed others had the same customer knowledge they held.",
          "The project drove a major improvement in documentation quality, setting a new standard for future product launches.",
          "User feedback on the new tutorials was highly positive, with beginners reporting a smoother, less intimidating onboarding experience.",
        ]}
        learnings={[
          "The comprehensive user-issue database remained a one-off effort rather than becoming a sustained process, as teams had differing priorities and shifting workflows.",
          "Many more problems were documented than addressed, highlighting the need to better align insights with delivery capacity.",
          "Tutorial production moved slower than expected, highlighting the importance of aligning expertise and resourcing early.",
        ]}
      />

      <NextProject
        href="/spatialos"
        imageSrc="/images/heros/spatialos-hero-green.png"
        imageAlt="SpatialOS dev tools redesign"
      />

    </ProjectLayout>
  )
}
