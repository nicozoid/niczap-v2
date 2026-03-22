// Local type declaration for react-fitty.
// Needed because the package's exports field is missing a "types" entry,
// which confuses TypeScript's "bundler" module resolution.
declare module "react-fitty" {
  import React from "react"
  export const ReactFitty: React.ForwardRefExoticComponent<
    React.HTMLAttributes<HTMLDivElement> & {
      children?: React.ReactNode
      minSize?: number
      maxSize?: number
      wrapText?: boolean
    } & React.RefAttributes<HTMLElement>
  >
}
