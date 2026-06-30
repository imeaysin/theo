import { PageContainer, SectionHeading } from "../layout"
import { LinkCard } from "../link-card"

export interface UpdateItem {
  slug: string
  href: string
  date: string
  title: string
  summary: string
}

interface UpdatesListSectionProps {
  title?: string
  subtitle?: string
  items: UpdateItem[]
}

export function UpdatesListSection({
  title = "Updates",
  subtitle = "Product news, improvements, and announcements.",
  items,
}: UpdatesListSectionProps) {
  return (
    <div className="bg-background pt-32 pb-24">
      <PageContainer size="narrow">
        <SectionHeading subtitle={subtitle} title={title} variant="page" />
        <div className="divide-y divide-border border border-border">
          {items.map((item) => (
            <LinkCard
              key={item.slug}
              className="rounded-none border-0 shadow-none before:hidden hover:bg-secondary/40"
              href={item.href}
              panelClassName="space-y-2 p-6"
            >
              <p className="text-xs text-muted-foreground">{item.date}</p>
              <h2 className="text-base text-foreground">{item.title}</h2>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {item.summary}
              </p>
            </LinkCard>
          ))}
        </div>
      </PageContainer>
    </div>
  )
}
