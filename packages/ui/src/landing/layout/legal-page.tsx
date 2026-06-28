import type { ReactNode } from "react"
import { Button } from "@workspace/ui/components/button"
import { LandingContainer } from "./page-container"
import { cn } from "@workspace/ui/lib/utils"

export type LegalBlock =
  | { type: "paragraph"; text: string }
  | { type: "list"; items: string[] }
  | { type: "subsection"; title: string; blocks: LegalBlock[] }
  | { type: "email"; address: string }

export interface LegalSection {
  title: string
  blocks?: LegalBlock[]
  content?: string
  paragraphs?: string[]
  subsections?: {
    title?: string
    content: string
  }[]
}

export interface LegalDocument {
  title: string
  lastUpdated: string
  intro?: string[]
  sections: LegalSection[]
}

const paragraphClass = "text-muted-foreground leading-relaxed"
const listClass = "list-disc list-inside space-y-2 text-muted-foreground ml-4"

function LegalBlockView({ block }: { block: LegalBlock }) {
  switch (block.type) {
    case "paragraph":
      return <p className={paragraphClass}>{block.text}</p>
    case "list":
      return (
        <ul className={listClass}>
          {block.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      )
    case "subsection":
      return (
        <>
          <h3 className="mt-6 mb-3 text-sm text-foreground">
            {block.title}
          </h3>
          {block.blocks.map((child, index) => (
            <LegalBlockView
              key={`${block.title}-${child.type}-${index}`}
              block={child}
            />
          ))}
        </>
      )
    case "email":
      return (
        <p className="leading-relaxed text-foreground">
          <Button
            className="inline h-auto p-0 text-foreground"
            render={<a href={`mailto:${block.address}`} />}
            variant="link"
          >
            {block.address}
          </Button>
        </p>
      )
    default:
      return null
  }
}

function LegalSectionView({ section }: { section: LegalSection }) {
  return (
    <section className="space-y-4">
      <h2 className="mt-8 mb-4 text-base text-foreground">
        {section.title}
      </h2>
      {section.blocks?.map((block, index) => (
        <LegalBlockView key={`${section.title}-${index}`} block={block} />
      ))}
      {section.content ? (
        <p className={paragraphClass}>{section.content}</p>
      ) : null}
      {section.paragraphs?.map((paragraph) => (
        <p key={paragraph.slice(0, 40)} className={paragraphClass}>
          {paragraph}
        </p>
      ))}
      {section.subsections?.map((subsection) => (
        <div key={subsection.title ?? subsection.content.slice(0, 40)}>
          {subsection.title ? (
            <h3 className="mt-6 mb-3 text-sm text-foreground">
              {subsection.title}
            </h3>
          ) : null}
          <p className={paragraphClass}>{subsection.content}</p>
        </div>
      ))}
    </section>
  )
}

interface LegalPageProps {
  document: LegalDocument
  children?: ReactNode
}

export function LegalPage({ document, children }: LegalPageProps) {
  return (
    <div className="min-h-screen">
      <div className="pt-12 pb-16 sm:pt-16 sm:pb-24 lg:pt-20">
        <div className="pt-12 sm:pt-16 lg:pt-24">
          <LandingContainer size="legal">
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="3xl:text-4xl font-serif text-2xl leading-tight text-foreground sm:text-3xl lg:text-3xl lg:leading-tight xl:text-3xl xl:leading-snug 2xl:text-3xl">
                  {document.title}
                </h1>
                <p className="text-sm text-muted-foreground">
                  Last updated: {document.lastUpdated}
                </p>
              </div>

              <div className="prose prose-sm sm:prose-base max-w-none space-y-6 text-foreground">
                {document.intro?.map((paragraph) => (
                  <p key={paragraph.slice(0, 40)} className={paragraphClass}>
                    {paragraph}
                  </p>
                ))}

                {document.sections.map((section) => (
                  <LegalSectionView key={section.title} section={section} />
                ))}

                {children}
              </div>
            </div>
          </LandingContainer>
        </div>
      </div>
    </div>
  )
}

interface PlaceholderPageProps {
  title: string
  description: string
  action?: ReactNode
  className?: string
  variant?: "default" | "story"
}

const placeholderTitleVariants = {
  default: "font-serif text-3xl text-foreground sm:text-4xl",
  story:
    "font-serif text-3xl leading-tight text-foreground lg:text-3xl lg:leading-tight xl:text-3xl xl:leading-snug 2xl:text-3xl 3xl:text-4xl",
} as const

export function PlaceholderPage({
  title,
  description,
  action,
  className,
  variant = "default",
}: PlaceholderPageProps) {
  return (
    <div className={cn("min-h-[60vh] pt-12 pb-16 sm:pt-16", className)}>
      <LandingContainer size="narrow">
        <div className="space-y-4 pt-12 text-center sm:pt-16">
          <h1 className={placeholderTitleVariants[variant]}>{title}</h1>
          <p className="text-base leading-relaxed text-muted-foreground">
            {description}
          </p>
          {action ? <div className="pt-4">{action}</div> : null}
        </div>
      </LandingContainer>
    </div>
  )
}
