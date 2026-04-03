import type { Metadata } from "next"
import { ProjectLayout } from "@/components/project/project-layout"
import { ProjectTitle } from "@/components/project/project-title"
import { ContentSection } from "@/components/project/content-section"
import { SectionDivider } from "@/components/project/section-divider"
import { SectionIntro } from "@/components/project/section-intro"
import { ImageLightbox } from "@/components/ui/image-lightbox"
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
  { name: "React",                    src: DI("react") },
  { name: "Tailwind",                 src: DI("tailwindcss") },
  { name: "shadcn/ui",                src: SI("shadcnui"),    darkInvert: true },
  { name: "Vercel",                   src: SI("vercel"),      darkInvert: true },
  { name: "Next.js",                  src: SI("nextdotjs"),   darkInvert: true },
  { name: "Google Maps API",          src: SI("googlemaps") },
  { name: "Flickr API",               src: SI("flickr") },
  { name: "Mapbox",                   src: SI("mapbox"),      darkInvert: true },
]

const toolItems: LogoItem[] = [
  { name: "VS Code",        src: DI("vscode") },
  { name: "Claude Code",    src: SI("anthropic"), darkInvert: true },
  { name: "Figma",          src: DI("figma") },
  { name: "Midjourney",     src: "/logos/midjourney.svg" },
  { name: "Recraft",        src: "/logos/recraft.svg" },
  { name: "Hugeicons" },  // no CDN source — renders fallback tile
  { name: "Mapbox Studio",  src: SI("mapbox"),    darkInvert: true },
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

      {/* Hero image + links to live site and GitHub */}
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

        {/* App link + GitHub link stacked, centred */}
        <div className="mt-5 flex flex-col items-center gap-2">
          <a
            href="https://trainstogreen.niczap.design"
            target="_blank"
            rel="noopener noreferrer"
            className="text-2xl font-bold text-green-700 underline underline-offset-4 hover:opacity-70 transition-opacity"
          >
            Trains to Green app &rarr;
          </a>
          <a
            href="https://github.com/nicozoid/trainstogreen"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-muted-foreground underline underline-offset-2 hover:opacity-70 transition-opacity"
          >
            github.com/nicozoid/trainstogreen
          </a>
        </div>

      </div>

      {/* ------------------------------------------------------------------ */}
      {/* CONTEXT                                                             */}
      {/* ------------------------------------------------------------------ */}

      <SectionDivider label="Context" compact />

      <SectionIntro>
        <p>
          Trains to Green is a simple web app developed in my spare time to solve a niche problem for London hikers and to challenge myself to adopt new ways of working enabled by the latest LLM models.
        </p>
      </SectionIntro>

      <ContentSection label="UX goals">
        <p>
          London is surrounded by beautiful countryside — including 2 national parks and 7 national landscapes. The dense regional rail network facilitates easy day hikes even for the nearly-half of Londoners without a car. Unfortunately, after the top-10 web articles have been exhausted, there&apos;s simply no easy way to discover hike-worthy rail stations and compare between them. This is the UX problem which Trains to Green solves.
        </p>
      </ContentSection>

      <ContentSection label="Learning goals">
        <p>
          In addition to making a useful app, I wanted to immerse myself in the emerging design workflows that AI makes possible:
        </p>
        <ul>
          <li>How much design control/fidelity does an AI-first approach give me?</li>
          <li>Can I avoid the cookie-cutter &ldquo;LLM look&rdquo; and produce an opinionated, distinctive UI?</li>
          <li>Can I maintain a consistent design system in the coding environment?</li>
          <li><a href="#designcraft-learnings" className="underline underline-offset-2 hover:opacity-70 transition-opacity">etc</a></li>
        </ul>
      </ContentSection>

      {/* ------------------------------------------------------------------ */}
      {/* TECH & TOOLS                                                        */}
      {/* ------------------------------------------------------------------ */}

      <ContentSection label="Tech stack">
        <LogoGarden items={techStackItems} />
        <p className="mt-6">
          The React + Tailwind + shadcn/ui combo is the default tech stack used in nearly all AI tools. AI works with it much more effectively than other stacks. In addition, and not coincidentally, the shadcn/ui component library is completely customisable, so I could go as far as I liked in giving it a distinctive brand.
        </p>
        <p>
          Vercel and Next.js I chose simply for their strong reputations, and because the combo is known to require only minimal configuration. Google Maps Directions API was used to calculate the travel-times from central London, the Flickr API was used to pull the photographs, and Mapbox was used (unsurprisingly&hellip;) to get the map.
        </p>
      </ContentSection>

      <ContentSection label="Tools">
        <LogoGarden items={toolItems} />
        <p className="mt-6">
          I set up the project manually via the terminal, opened up VS Code and then used a combination of hand-coding and the Claude Code VS Code plugin to build. Later on I switched to mainly using the Claude Code desktop app and only hand-coding occasional Tailwind CSS and copy changes.
        </p>
        <p>
          I used Midjourney to generate the flagship artwork (see the top of this page) and Recraft to create the logo (since Midjourney can&apos;t create vectors). I used Hugeicons for icons and Mapbox Studio to customise and recolour the map.
        </p>
      </ContentSection>

      {/* ------------------------------------------------------------------ */}
      {/* UX THINKING                                                         */}
      {/* ------------------------------------------------------------------ */}

      <SectionDivider label="UX thinking" />

      <ContentSection label="Utility">
        <p>
          The app addresses the central user need (&ldquo;where should I go for a day hike by train&rdquo;) by allowing users to compare rail stations by travel-time and the desirability of nearby hikes — via ratings and Flickr photos.
        </p>
        <p>
          The app also makes it easier to plan station-to-station walks, through the &ldquo;easy hike&rdquo; and &ldquo;epic hike&rdquo; radii that surround the stations on-hover.
        </p>
      </ContentSection>

      {/* Screenshot showing the easy-hike / epic-hike radii — aligned to the
          right 2/3 column via a hidden-label ContentSection. Click to enlarge. */}
      <ContentSection label="Station radii" hideLabel>
        <ImageLightbox
          src="/images/trainstogreen/station-radii.png"
          alt="Station radii showing easy hike and epic hike distances"
          maxWidth={500}
        />
      </ContentSection>

      <ContentSection label="Escapism">
        <p>
          My intention is that using the app should be a pleasurable experience where users can imagine themselves enjoying the peace, beauty and novelty of the countryside. I didn&apos;t want it to feel like a purely functional utility. To this end, the UI is defined by friendly rounded edges and slightly exaggerated padding and sizes, to give a comfortable, accessible feeling. I applied a palette of bright nature colours (green, aquamarine and cream) across both the UI and the map.
        </p>
        <p>
          Beyond colour, my main customisation of the map was to radically declutter it — I&apos;ve removed all roads and other labelling, both to allow the user to concentrate on the purpose of the app, and to create a peaceful and attractive view of the countryside. The visual contrast between urban and rural areas has been heightened to help users view how urban a hiking area is.
        </p>
        <p>
          The photos in each station are a key part of inspiring the users. The photos are pulled from Flickr via location+tag-based filtering script, but I also added an admin-mode so I could manually curate the photos at highlighted stations.
        </p>
        <p>
          Finally, I added a number of subtle micro-animations — e.g. the train on the slider animates-in on app-load, the checkbox icon gets drawn, and the station-icons grow and shrink. Nothing abruptly appears or disappears — the intention is that everything should feel organic and smooth.
        </p>
      </ContentSection>

      <ContentSection label="Mobile">
        <p>
          As a simple and relaxing app, I wanted it to work well on mobile devices. Examples of optimisations for this medium include:
        </p>
        <ul>
          <li>Greater spacing and font-size on mobile, to accommodate the imprecision of tapping rather than clicking.</li>
          <li>The stations&apos; photos are full-bleed, so that photos can make full use of the limited available space.</li>
          <li>On first load, the map is positioned such that most stations are visible despite the filter taking up most of the screen, and only top-rated stations are visible, to avoid cluttering the limited space.</li>
        </ul>
      </ContentSection>

      <ContentSection label="UX testing & iteration">
        <p>
          I informally tested the first version of the app on friends and family, identifying the following issues:
        </p>
        <ul>
          <li>It wasn&apos;t clear that the app is specifically about train stations, not simply hiking spots. To fix this I created an introductory overlay and repeated the word &ldquo;station&rdquo; throughout the app.</li>
          <li>I initially had a station-search feature, but realised from observation that this just created confusion about how the app is to be used, and was an unnecessary distraction from the key use case. I restricted the search function to admin-mode, where it was of use to my testing.</li>
        </ul>
      </ContentSection>

      <ContentSection label="Future UX improvements">
        <p>
          Aside from various micro-improvements to improve the look and feel, my priorities for improvement are:
        </p>
        <ul>
          <li>A choice of specific origin points for calculating travel-time as opposed to just using a vague &ldquo;central London&rdquo; origin point (in fact Farringdon Station, which is roughly equidistant from all the London terminals). This improvement is constrained by the expense of calls on the Google Maps Directions API.</li>
          <li>More filters and info to help with choosing destination stations, e.g. direct-train-only filters, nearby points-of-interest like stately homes and nature reserves, restaurants, terrain filters, and terrain descriptions.</li>
        </ul>
      </ContentSection>

      {/* ------------------------------------------------------------------ */}
      {/* DESIGNCRAFT LEARNINGS                                               */}
      {/* ------------------------------------------------------------------ */}

      <SectionDivider label="Designcraft learnings" id="designcraft-learnings" compact />

      <SectionIntro>
        <p>
          A key goal for this project was to explore AI-enabled design workflows in light of February&apos;s breakthrough in model capabilities. Here's a Q&A with myself to work through my reflections:
        </p>
      </SectionIntro>

      <ContentSection label="Can I skip Figma and design directly in the coding environment?">
        <p>
          Pretty much! It was so easy and quick to make changes using Claude that I didn&apos;t feel the need. I popped into Figma only to compose the brand palette, make tweaks to assets, and, once, to get a clear overview of the different checkbox states side-by-side (I used the{" "}
          <a href="http://html.to.design" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:opacity-70 transition-opacity">html.to.design</a>
          {" "}plugin to pull the UI into Figma for this — surprisingly it did a better job of this than the Figma MCP server).
        </p>
        <p>
          Of course Trains to Green is a UI-lite app and I was building on shadcn/ui component templates (dialogs, buttons, input fields, tooltips). With a more complex app I may have had a very different experience.
        </p>
      </ContentSection>

      <ContentSection label="How much design control/fidelity does an AI-first approach give me?">
        <p>
          With Claude, I never felt limited by misunderstandings and imprecision (utterly different from my experience last year with vibe-coding tools like Lovable and Replit). I had more design fidelity than in a traditional workflow since I could go directly to implementation.
        </p>
      </ContentSection>

      <ContentSection label={"Can I avoid the cookie-cutter \u201CLLM look\u201D and produce an opinionated, distinctive UI?"}>
        <p>
          Yep, there&apos;s no excuse! AI will produce generic shadcn/ui components with only light customisation, but you can push the customisation as far as you like.
        </p>
      </ContentSection>

      <ContentSection label="Can I maintain a consistent design system in the coding environment?">
        <p>
          Yes! With the React + Tailwind v4 + shadcn/ui combo there&apos;s a single globals.css file that contains all the colour variables, and where you can override Tailwind defaults. Once you understand that and how it relates to UI components by way of Tailwind utility classes, you understand everything you need to know to control and maintain the fundamentals of the design system.
        </p>
      </ContentSection>

      <ContentSection label="Can I add nice-to-have micro-animations?">
        <p>
          Claude was surprisingly good at implementing these! Nothing like this comes out-of-the-box in shadcn/ui so I had to specifically work with Claude on each one, but it almost always came through. This was enormously gratifying for me since, working on B2B SaaS with limited resources and tight schedules, the &ldquo;delight&rdquo;-inducing UI finesse is always the first sacrifice.
        </p>
      </ContentSection>

      <ContentSection label="How much code-literacy is required? How much manual-coding is required?">
        <p>
          Much less than I imagined! It was helpful, but not necessary, that I understand HTML, CSS, Tailwind and the basics of React. Having a clear mental model of how, for example, Flexbox layouts work meant I could easily see where Claude had made mistakes and how these could be corrected (though these are in any case very similar to Figma mental models). Sometimes I would jump into the code and edit Tailwind utilities, React components and copy directly, because it was faster just to make the changes than to explain them to Claude and wait for response (especially true for rapidly trying out different layout tweaks), but this wasn&apos;t essential.
        </p>
        <p>
          Understanding the basics of React components and being able to see how this is organised in the code base is also helpful for instructing Claude to make changes that are systematic and modular, rather than messy one-off hacks, but this requires only minimal code-literacy — anyone who has designed a CMS will already be familiar with this way of thinking.
        </p>
        <p>
          Complex backend work and API interactions was handled entirely by Claude (obviously I still needed to actually generate the API tokens).
        </p>
        <p>
          The one big exception is the design system. Without my being able to understand and control how the design tokens and semantic variables are implemented in the code, I think Claude would have created an inconsistent mess of hard-coded colour values. Understanding and manually editing the globals.css file meant I was able to keep control of that and rapidly overhaul the look and feel in a consistent way.
        </p>
      </ContentSection>

      <ContentSection label="Can I just sit back and let the AI do everything?">
        <p>
          Not yet! It was time-consuming to make this app. Left to itself Claude would constantly claim that features were built when they clearly weren&apos;t, and make terrible design decisions. In terms of UX (as opposed to code implementation), it needed to be told exactly what to do all the time. Presumably it would have done much better with an app that simply followed well-established patterns (e.g. landing pages, eCommerce, settings, bookings).
        </p>
      </ContentSection>

      {/* ------------------------------------------------------------------ */}
      {/* CONCLUSION                                                          */}
      {/* ------------------------------------------------------------------ */}

      {/* Simple divider before the conclusion — lighter than a SectionDivider */}
      <hr className="my-20 border-foreground/40" />

      <ContentSection label="Conclusion">
        <p>
          It was enormously liberating to be able to implement the design exactly as I wanted, without having to chase up developers about design details. It was also just extremely fun and addictive — I experienced an extreme case of &ldquo;just one more turn&rdquo; video game condition. I&apos;m eager to find the opportunity to push this approach further, in the context of a wider team and a much more ambitious app.
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
