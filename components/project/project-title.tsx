// ProjectTitle renders the hero block at the top of every project page:
// a large h1, a muted subtitle, and a dividing rule.
export function ProjectTitle({
  title,
  subtitle,
}: {
  title: string
  subtitle: string
}) {
  return (
    // mt-4 gives a small gap below the header; text centred on all screen sizes.
    <div className="mt-4 text-center">
      {/* text-4xl on mobile (36px), text-5xl on md+ (48px) — matches v1 h1.title */}
      <h1 className="text-4xl md:text-5xl font-medium leading-snug">{title}</h1>

      {/* Subtitle is visually secondary via muted colour and slightly larger body size */}
      <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">{subtitle}</p>

      {/* The rule acts as a visual full-stop before the content begins.
          opacity-20 gives it a very light, editorial feel */}
      <hr className="mt-16 mb-16 border-foreground/20" />
    </div>
  )
}
