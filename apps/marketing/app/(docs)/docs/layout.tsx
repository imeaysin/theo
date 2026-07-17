import type { PropsWithChildren } from "react"
import { getDocSearchIndex } from "@/lib/content/docs"
import { DocsHeader } from "./_components/docs-header"
import { DocsMobileMenu } from "./_components/docs-mobile-menu"
import { DocsSearch } from "./_components/docs-search"
import { DocsSidebar } from "./_components/docs-sidebar"
import { docsConfig } from "./docs-config"

export default function DocsLayout(props: PropsWithChildren) {
  const searchIndex = getDocSearchIndex(docsConfig.sidebar)

  return (
    <div className="min-h-screen bg-background">
      <DocsHeader />
      <DocsSearch searchIndex={searchIndex} />
      <div className="flex pt-14">
        <aside className="hidden w-[260px] shrink-0 lg:block">
          <DocsSidebar />
        </aside>
        <DocsMobileMenu />
        <main className="min-w-0 flex-1">{props.children}</main>
      </div>
    </div>
  )
}
