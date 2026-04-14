import type { Metadata } from "next"
import { ProjectLayout } from "@/components/project/project-layout"
import { ProjectTitle } from "@/components/project/project-title"
import { ContentSection } from "@/components/project/content-section"
import { StandaloneImage } from "@/components/project/project-image"
import { ProjectReflections } from "@/components/project/project-reflections"
import { NextProject } from "@/components/project/next-project"
import { getProject } from "@/data/projects"

const project = getProject("/fintech-design")

export const metadata: Metadata = {
  title: `${project.title} | Nicolas Holzapfel`,
}

export default function SigTechAppPage() {
  return (
    <ProjectLayout>

      <ProjectTitle
        title={project.title}
        subtitle={project.description}
      />

      <ContentSection label="Context">
        <p>
          I joined SigTech as the founding designer and built a design and content team from scratch,
          focused on improving the platform used daily by professional quants to develop algorithmic
          trading strategies.
        </p>
      </ContentSection>

      <StandaloneImage
        src="/images/sigtech-app/sigtech+before.png"
        alt="SigTech platform before redesign"
      />

      <ContentSection label="A proliferative kitchen sink of a design">
        <p>
          At the centre of the SigTech platform is a deep Python library developed over many years.
          The web UI for accessing it had evolved ad-hoc, without branding or design strategy. I
          began by interviewing internal and external users to understand how each part of the UI was
          being used (or not used).
        </p>
      </ContentSection>

      <ContentSection label="→ Comprehensive rebrand & redesign">
        <p>
          With a clear understanding of how each UI was used, I led a structured redesign focused on
          usability and hierarchy. A major issue was the lack of structure — app-wide tools were
          mixed in with project-specific features on the same screens, making navigation confusing. I
          reorganised key layouts to better reflect how users worked across the platform. I also
          unified the platform's visual language, which later evolved further as we rebranded the
          product more broadly.
        </p>
      </ContentSection>

      <StandaloneImage src="/images/sigtech-app/st+set+up+research.png" alt="" />
      <StandaloneImage src="/images/sigtech-app/st+strategy+deployment.png" alt="" />
      <StandaloneImage src="/images/sigtech-app/data+browser+with+chart.png" alt="" />
      <StandaloneImage src="/images/sigtech-app/st+schema.png" alt="" />

      <ProjectReflections
        wins={[
          "Applied core design principles — usability, aesthetics, and branding — across the entire platform.",
          "Created an intuitive information architecture that clarified how different features relate to one another.",
        ]}
        learnings={[
          "Some UIs were used with high frequency, making speed just as critical as clarity. I initially under-prioritised this.",
          "The data browser design would have been stronger had I developed a deeper understanding of financial instruments earlier; this knowledge came later in my time at SigTech.",
        ]}
      />

      <NextProject
        href="/trains-to-green"
        imageSrc="/images/heros/trainstogreen-hero-art-green.png"
        imageAlt="Trains to Green hiking app"
        label="Back to first project"
      />

    </ProjectLayout>
  )
}
