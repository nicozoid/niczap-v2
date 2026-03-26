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
            src="/images/heros/trainstogreen-hero-green.png"
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
          Trains to Green is a simple web app to help Londoners explore the English countryside by train. I created it to test out new ways of designing and developing with AI — in particular, to what extent I could skip Figma entirely and design entirely within the IDE.
        </p>
        <p>
         Built with React, using the ShadCN component library & Tailwind CSS.
        </p>
        <p><strong>Tools:</strong> Visual Studio Code, Claude Code Opus 4.6, and a little bit of Figma.</p>
      </ContentSection>

      <ContentSection label="Approach">
        <p>
          The vast majority of the app was built via talking everything through with Claude — including working with the various APIs utilised(Google Maps, Mapbox, Flickr) and building out the initial user interface using ShadCN components.
        </p>
        <p>I manually edited the code only to fine-tune the Tailwind styling, and to make copy changes.</p>
        <p>When defining the checkbox states, I did find it helpful to use Figma for quick visual comparisons. For this I used [html.to.design](http://html.to.design), which I was surprised to discover did a better job than the Figma MCP server at pulling coded components into Figma.</p>
      </ContentSection>

      <ContentSection label="Conclusion">
        <p>
        Claude Opus 4.6 is absolutely stunning, and I was amazed at how far I could go without touching the code myself. I was satisfied that it’s eminently possible to rapidly design and build a simple app in the IDE without losing design control.
        </p>
        <p>It was also helpful for me to be further immersed in how exactly how a design and component system is organised within a Tailwind/ShadCN-based React project.</p>
        <p>While I intend to further push this approach in solo work, the question remains for me if/how this approach could function within a team, and with a mature/advanced web app.</p>
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
