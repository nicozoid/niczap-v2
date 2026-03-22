// EndOfProjects replaces the NextProject component on the final project page (SpatialOS).
// It signals the end of the portfolio and invites direct contact.
export function EndOfProjects() {
  return (
    <div className="my-20">

      {/* Same decorative line treatment as NextProject, for visual consistency */}
      <div className="flex items-center gap-4 mb-10">
        <div className="flex-1 border-t border-foreground/40" />
        <span className="text-2xl font-medium whitespace-nowrap">
          That&apos;s the final project!
        </span>
        <div className="flex-1 border-t border-foreground/40" />
      </div>

      <p className="text-center text-muted-foreground">
        Everything else is in my head — ask me about it.{" "}
        <a
          href="https://linkedin.com/in/niczap"
          target="_blank"
          rel="noopener noreferrer"
          // underline-offset-4 gives the underline breathing room below the text
          className="text-foreground underline underline-offset-4 hover:opacity-60 transition-opacity"
        >
          linkedin.com/in/niczap
        </a>
        {" · "}
        <a
          href="mailto:nicolas@niczap.design"
          className="text-foreground underline underline-offset-4 hover:opacity-60 transition-opacity"
        >
          nicolas@niczap.design
        </a>
      </p>

    </div>
  )
}
