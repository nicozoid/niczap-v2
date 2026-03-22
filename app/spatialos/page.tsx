import type { Metadata } from "next"
import { ProjectLayout } from "@/components/project/project-layout"
import { ProjectTitle } from "@/components/project/project-title"
import { ContentSection } from "@/components/project/content-section"
import { StandaloneImage } from "@/components/project/project-image"
import { ProjectReflections } from "@/components/project/project-reflections"
import { EndOfProjects } from "@/components/project/end-of-projects"

export const metadata: Metadata = {
  title: "Redesigning dev tools for massively multiplayer games | Nicolas Holzapfel",
}

export default function SpatialOSPage() {
  return (
    <ProjectLayout>

      <ProjectTitle
        title="Redesigning dev tools for massively multiplayer games"
        subtitle="Overhauling a family of UIs for testing and deploying online games with uniquely massive CPU demands on player and NPC scale, density and complexity"
      />

      <ContentSection label="Context">
        <p>
          The SpatialOS web console enables game developers to test, profile, debug, and deploy
          their game instances. Starting in 2016, I led a long-term effort to improve the console's
          usability and consistency — bringing clarity to what had become a complex,
          organically-emergent interface.
        </p>
      </ContentSection>

      <StandaloneImage src="/images/heros/spatialos-hero-green.png" alt="SpatialOS web console" />

      <ContentSection label="User research">
        <p>
          I kicked off the project with a series of user interviews to uncover key workflows and
          usability issues. The findings were captured in a one-page flowchart.
        </p>
      </ContentSection>

      <StandaloneImage src="/images/spatialos/spatialos-02.png" alt="" />

      <ContentSection label="Improvements">
        <p>A few examples of the kind of changes made as a consequence:</p>
      </ContentSection>

      <StandaloneImage src="/images/spatialos/spatialos-03.png" alt="" />
      <StandaloneImage src="/images/spatialos/spatialos-04.png" alt="" />
      <StandaloneImage src="/images/spatialos/spatialos-05.png" alt="" />

      <ProjectReflections
        wins={[
          "Established a clear structural vision for the app, replacing ad-hoc growth with a cohesive plan.",
          "Improved alignment between design, front-end development, and user needs.",
        ]}
        learnings={[
          "Progress was slow, as improvements had to fit between feature-driven priorities.",
          "Some team misalignments persisted.",
        ]}
      />

      {/* EndOfProjects replaces NextProject on the final page — same visual treatment,
          different content: a wrap-up message and contact links */}
      <EndOfProjects />

    </ProjectLayout>
  )
}
