import type { Metadata } from "next"
import { ProjectLayout } from "@/components/project/project-layout"
import { ProjectTitle } from "@/components/project/project-title"
import { ContentSection } from "@/components/project/content-section"
import { StandaloneImage } from "@/components/project/project-image"
import { ProjectReflections } from "@/components/project/project-reflections"
import { NextProject } from "@/components/project/next-project"
import { getProject } from "@/data/projects"

const project = getProject("/dave")

export const metadata: Metadata = {
  title: `${project.title} | Nicolas Holzapfel`,
}

export default function DavePage() {
  return (
    <ProjectLayout>

      <ProjectTitle
        title={project.title}
        subtitle={project.description}
      />

      <ContentSection label="Context">
        <p>
          DaVe is a web app for detecting anomalies in datasets. I co-designed the full experience
          in a cross-functional team, from shaping the MVP to refining the final interface.
        </p>
        <p>
          <strong>Team:</strong> PM, 2 designers, 1 technical writer, 1 QA, ~4 software engineers,
          ~3 data engineers, and strong CEO involvement.
        </p>
        <p>
          <strong>Business case:</strong> SigTech mainly bought raw data, cleaning and aggregating
          it for data-consumers. If we gave data owners a tool to rapidly validate and improve their
          datasets before selling, it wouldn't just create a new revenue stream — it would also save
          our data team time and improve the experience for data-consumers, creating a virtuous cycle
          for the whole business.
        </p>
        <p><em>('DaVe' = Data Validation Engine!)</em></p>
      </ContentSection>

      <StandaloneImage src="/images/dave/DaveLogo.png" alt="DaVe logo" />

      <ContentSection label="Requirements gathering">
        <p>
          Collaborating with the PM and CEO, I captured the core requirements in a written spec — a
          crucial step in surfacing hidden differences in our assumptions about our users, especially
          their level of technical knowledge.
        </p>
        <p>
          Next, I wireframed the end-to-end journey that guided engineers' plans for the build. Early
          concepts included letting users edit anomalies as well as detect them, but we quickly
          realised this was too ambitious for an MVP to be launched in only weeks. We scaled back to
          detection-only.
        </p>
      </ContentSection>

      <StandaloneImage src="/images/dave/dave+wireframe+2.png" alt="DaVe wireframes" />

      <ContentSection label="Testing core usability">
        <p>
          We created a clickable prototype of the core flow, enabling realistic, hands-on reviews
          and faster alignment across the team.
        </p>
      </ContentSection>

      <StandaloneImage src="/images/dave/dave-03.png" alt="" />
      <StandaloneImage src="/images/dave/connect+s3.png" alt="" />
      <StandaloneImage src="/images/dave/dave-main.png" alt="" />
      <StandaloneImage src="/images/dave/dave-issues.png" alt="" />

      <ContentSection label="New brand. New design system.">
        <p>
          This was the product's first product UI expression of our recent rebrand, so visual
          clarity and brand alignment were key. To support this, we designed, from scratch, a library
          of Figma components using atomic design principles.
        </p>
      </ContentSection>

      <StandaloneImage src="/images/dave/dave-system.png" alt="DaVe design system" />

      <ContentSection label="Edge cases and details">
        <p>
          With the core flow and aesthetic validated, we moved on to designing all edge cases, minor
          UIs, and UI states. We stayed at least one sprint ahead by working closely with engineers
          throughout.
        </p>
      </ContentSection>

      <StandaloneImage src="/images/dave/upload-files.png" alt="" />
      <StandaloneImage src="/images/dave/dave-z-score.png" alt="" />

      <ProjectReflections
        wins={[
          "Strong cross-functional collaboration across design, engineering, product, and QA.",
          "Fast development of first rebranded product UI.",
          "Early investment in a design system paid off, accelerating the next project.",
          "Saw initial traction (but ultimately neglected as company pivoted to AI with the release of ChatGPT plugins).",
        ]}
        learnings={[
          "Some wireframe reviews lacked thoroughness — e.g. the sequence of backend calls involved was missed — leading to avoidable rework during UI design.",
          "The initial MVP scope was too ambitious, causing inefficiencies as wireframes had to be revised midstream.",
        ]}
      />

      <NextProject
        href="/sigtech-app"
        imageSrc="/images/heros/sigtech-hero-green.png"
        imageAlt="Sample SigTech app designs"
      />

    </ProjectLayout>
  )
}
