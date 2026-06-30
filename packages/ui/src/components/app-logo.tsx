import { Logo } from "./logo"

export function AppLogo({
  href = "/",
  label = "ACME",
}: {
  href?: string
  label?: string
}) {
  return (
    <a className="flex items-center gap-1 text-foreground" href={href}>
      <Logo />
      <p className="font-bold text-inherit">{label}</p>
    </a>
  )
}
