import type { Metadata } from "next"
import { ProjectLayout } from "@/components/project/project-layout"
import { ProjectTitle } from "@/components/project/project-title"
import { ContentSection } from "@/components/project/content-section"
import { StandaloneImage, FullBleedImage } from "@/components/project/project-image"
import { ProjectReflections } from "@/components/project/project-reflections"
import { NextProject } from "@/components/project/next-project"

// Next.js reads this export to set the <title> and <meta description> for the page
export const metadata: Metadata = {
  title: "Productising a core business stream | Nicolas Holzapfel",
}

export default function SylveraPage() {
  return (
    <ProjectLayout>

      <ProjectTitle
        title="Productising a core business stream"
        subtitle="Transforming offline PDFs and CSVs into a new, productised in-app experience"
      />

      <ContentSection label="Context">
        <p>
          Demand for Sylvera's early-stage market expertise was surging, but the solution lived
          entirely offline in CSVs and PDFs — making it hard to scale or sell as a renewing
          subscription. Our five-person squad (GM, PM, myself as designer, & 2 engineers) set out
          to bring these insights into the platform as a core, interactive feature.
        </p>
        <p>
          Our first step was exploring how text-heavy, ~50-page reports could be turned into
          experiences worthy of a modern SaaS platform.
        </p>
      </ContentSection>

      <StandaloneImage
        src="/images/sylvera/pdf-page.png"
        alt="Original PDF format of Sylvera early stage reports"
      />

      <ContentSection label="Details when needed, not upfront">
        <p>
          To reduce cognitive load and move away from the PDFs' "wall of data" approach, I surfaced
          key insights through charts and interactions, deferring technical detail to tooltips and
          footnotes for on-demand access.
        </p>
      </ContentSection>

      <StandaloneImage src="/images/sylvera/deliveryrisk+topcharts.png" alt="" />
      <StandaloneImage src="/images/sylvera/MortalityRate-flat-03.png" alt="" />

      <ContentSection label="Tools not text">
        <p>
          The report's recommended actions were redesigned into an interactive planning tool within
          the SaaS platform, enabling users to model trade-offs, forecast outcomes, and make
          data-informed decisions to strengthen project performance.
        </p>
      </ContentSection>

      <StandaloneImage src="/images/sylvera/deliveryrisk+waterfall.png" alt="" />

      <ContentSection label="Making the cut">
        <p>
          The exploratory phase ended with a tough reality: an engineer-light squad and impending
          quarterly goals. To deliver as quickly as possible, we focused the MVP on bringing a CSV
          of early-stage project data into the platform as an interactive table. Relatively
          unglamorous, but the right decision:
        </p>
        <ul>
          <li>The content would be continuously added-to, driving logins and justifying subscriptions.</li>
          <li>We could reuse existing frontend components, giving the best return on limited engineering resource.</li>
        </ul>
      </ContentSection>

      <ContentSection label="Design system for rapid delivery">
        <p>
          Leveraging a flexible, front-end-aligned table component I'd recently designed for the
          Sylvera design system, I was able to help deliver a scalable UI for the catalogue in
          record time. I streamlined the layout by merging related CSV fields into multi-element
          columns — minimising horizontal scrolling and making side-by-side comparison effortless.
        </p>
        <p>
          Column order was optimised around the decisions users needed to make once they'd narrowed
          their list to a shortlist, ensuring the most relevant data was always in view.
        </p>
        <p>
          Ideally, we'd have shipped an alternative card view for scannability, but speed-of-delivery
          had to win out.
        </p>
      </ContentSection>

      <StandaloneImage src="/images/sylvera/ESC3.png" alt="" />

      <ContentSection label="The best UI is the one you don't think about">
        <p>
          Catalogue filters used sliders — often a source of frustration. To avoid this, I defined
          their behaviour in detail, from increment scale to micro-interactions. The result was a
          seamless flow that kept users focused on exploring opportunities, not wrestling with controls.
        </p>
      </ContentSection>

      <StandaloneImage src="/images/sylvera/filters.png" alt="" />

      <ContentSection label="Macro-components for faster dev cycles">
        <p>
          Where possible, the early-stage project page design mirrored the mature-project structure
          while accommodating its unique data points. I used the opportunity to harmonise all
          existing project page designs, distilling seven distinct page types into a single flexible
          design-plus-frontend responsive component. This cut design and engineering overhead and
          sped up later dev cycles.
        </p>
      </ContentSection>

      <StandaloneImage src="/images/sylvera/ESC+page.png" alt="" />
      <FullBleedImage src="/images/sylvera/Project+pages.png" alt="" />

      <ProjectReflections
        wins={[
          "Our OKR was three early-stage sales in the quarter. With the productised experience launched, we more than doubled that — closing seven deals and proving the value of the strategy.",
          "The harmonised project page component cut dev and design cycles and improved UX consistency across the platform.",
          "The project was such a success that the company org structure was overhauled to replicate the success of our team.",
        ]}
        learnings={[
          "The original design vision was overly ambitious, forcing large scope cuts to deliver an MVP within the quarter. I could have anticipated this and invested less polish and detail in the initial exploratory designs.",
          "Embedding filters in column headers would have made the table cleaner and easier to use. The above-table placement came from the original vision, which allowed for switching between table and card views with shared filters above both. In hindsight, I could have anticipated that competing priorities might drop the card view, and focused on perfecting the table experience from the start.",
        ]}
      />

      <NextProject
        href="/dave"
        imageSrc="/images/heros/dave-hero-violet.png"
        imageAlt="Sample DaVe app designs"
      />

    </ProjectLayout>
  )
}
