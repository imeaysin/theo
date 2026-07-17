import type { PropsWithChildren } from "react"
import { Footer } from "./footer"
import { Navbar } from "./navbar"

export default function Layout(props: PropsWithChildren) {
  return (
    <>
      <Navbar />
      {props.children}
      <Footer />
    </>
  )
}
