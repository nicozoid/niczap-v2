// ProjectReflections renders the standard "Wins / Learnings" section at the
// bottom of every project page. Each column gets equal horizontal space.
export function ProjectReflections({
  wins,
  learnings,
}: {
  wins: string[]
  learnings: string[]
}) {
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
          {/* list-disc list-outside pl-5 replicates the v1 <ul> style */}
          <ul className="list-disc list-outside pl-5 space-y-3 leading-relaxed">
            {/* .map() with index as key is fine here since this list never reorders */}
            {wins.map((win, i) => (
              <li key={i}>{win}</li>
            ))}
          </ul>
        </div>

        <div className="flex-1">
          <h2 className="text-xl font-medium mb-4">Learnings</h2>
          <ul className="list-disc list-outside pl-5 space-y-3 leading-relaxed">
            {learnings.map((learning, i) => (
              <li key={i}>{learning}</li>
            ))}
          </ul>
        </div>

      </div>
    </div>
  )
}
