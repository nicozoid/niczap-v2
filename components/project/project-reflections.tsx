import type { ReactNode } from "react"

// ProjectReflections renders the standard "Wins / Learnings" section at the
// bottom of every project page. Each column gets equal horizontal space.
// Items can be plain strings or JSX (e.g. containing links).
export function ProjectReflections({
  wins,
  learnings,
  bulleted = true,
}: {
  wins: ReactNode[]
  learnings: ReactNode[]
  /** When false, items render as plain paragraphs instead of bullet points. */
  bulleted?: boolean
}) {
  // Renders a list of items — either as a <ul> with bullets or as plain <p> tags.
  const ItemList = ({ items }: { items: ReactNode[] }) =>
    bulleted ? (
      <ul className="list-disc list-outside pl-5 space-y-3 leading-relaxed">
        {items.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>
    ) : (
      <div className="space-y-3 leading-relaxed">
        {items.map((item, i) => (
          <p key={i}>{item}</p>
        ))}
      </div>
    )

  return (
    <div className="my-20">

      {/* Section label — small, uppercased, muted. Signals this is a meta-reflection,
          not another content section. */}
      <h3 className="text-xs uppercase tracking-widest text-muted-foreground mb-8">
        Project reflections
      </h3>

      {/* Two equal columns — stacked on mobile, side by side on md+ */}
      <div className="flex flex-col md:flex-row gap-10">

        <div className="flex-1">
          <h2 className="text-xl font-medium mb-4">Wins</h2>
          <ItemList items={wins} />
        </div>

        <div className="flex-1">
          <h2 className="text-xl font-medium mb-4">Learnings</h2>
          <ItemList items={learnings} />
        </div>

      </div>
    </div>
  )
}
