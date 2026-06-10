import { Logo } from "./logo"

export const AppLogo = () => {
  return (
    <a className="flex items-center gap-1" href="/">
      <Logo />
      <p className="font-bold text-inherit">ACME</p>
    </a>
  )
}
