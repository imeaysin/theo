"use client"

import {
  Accordion,
  AccordionItem,
  AccordionPanel,
  AccordionTrigger,
} from "@workspace/ui/components/accordion"
import { PageContainer, PageSection, SectionHeading } from "../layout"

export interface FaqItem {
  question: string
  answer: string
}

interface FaqSectionProps {
  title?: string
  subtitle?: string
  items: FaqItem[]
}

export function FaqSection({
  title = "Frequently asked questions",
  subtitle = "Everything you need to know before getting started.",
  items,
}: FaqSectionProps) {
  const defaultValue = items[0] ? [items[0].question] : []

  return (
    <PageSection>
      <PageContainer>
        <SectionHeading title={title} subtitle={subtitle} />
        <Accordion
          className="mx-auto max-w-3xl border border-border"
          defaultValue={defaultValue}
        >
          {items.map((item) => (
            <AccordionItem key={item.question} value={item.question}>
              <AccordionTrigger className="px-3 text-sm hover:bg-muted/50 sm:px-4">
                {item.question}
              </AccordionTrigger>
              <AccordionPanel className="px-3 sm:px-4">
                <p className="leading-relaxed">{item.answer}</p>
              </AccordionPanel>
            </AccordionItem>
          ))}
        </Accordion>
      </PageContainer>
    </PageSection>
  )
}
