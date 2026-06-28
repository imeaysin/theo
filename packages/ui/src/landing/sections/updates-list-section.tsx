import { LandingContainer } from "../layout/page-container"

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
      <LandingContainer size="narrow">
        <div className="mb-12 space-y-4">
          <h1 className="mb-4 font-serif text-3xl text-foreground lg:text-4xl">
            {title}
          </h1>
          <p className="font-sans text-base text-muted-foreground">
            {subtitle}
          </p>
        </div>
        <div className="divide-y divide-border border border-border">
          {items.map((item) => (
            <a
              key={item.slug}
              href={item.href}
              className="block space-y-2 bg-background p-6 transition-colors hover:bg-secondary/40"
            >
              <p className="font-sans text-xs text-muted-foreground">
                {item.date}
              </p>
              <h2 className="font-sans text-base text-foreground">
                {item.title}
              </h2>
              <p className="font-sans text-sm leading-relaxed text-muted-foreground">
                {item.summary}
              </p>
            </a>
          ))}
        </div>
      </LandingContainer>
    </div>
  )
}
