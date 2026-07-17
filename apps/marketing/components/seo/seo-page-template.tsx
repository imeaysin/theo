"use client"

import { Button } from "@/components/product-ui"
import {
  faCheck,
  faExclamation,
  faInfo,
  faTimes,
} from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@workspace/ui-shadcn/components/accordion"
import { Badge } from "@workspace/ui-shadcn/components/badge"
import { motion } from "motion/react"
import Image from "next/image"
import { renderRichText } from "@/components/rich-text"
import { ComparisonSlider } from "@/components/seo/comparison-slider"
import type { ComparisonCell, SeoPageContent } from "@/components/seo/types"

const MotionButton = motion.create(Button)
const MotionImage = motion.create(Image)

const renderHTML = (content: string) => renderRichText(content)

const renderComparisonCell = (cell: string | ComparisonCell) => {
  if (typeof cell === "string") {
    return renderHTML(cell)
  }

  const icons = {
    positive: (
      <div className="flex size-5 min-h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-primary">
        <FontAwesomeIcon
          icon={faCheck}
          className="text-xs text-primary-foreground"
        />
      </div>
    ),
    negative: (
      <div className="flex size-5 min-h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-destructive">
        <FontAwesomeIcon
          icon={faTimes}
          className="text-xs text-primary-foreground"
        />
      </div>
    ),
    warning: (
      <div className="flex size-5 min-h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-accent">
        <FontAwesomeIcon
          icon={faExclamation}
          className="text-xs text-primary-foreground"
        />
      </div>
    ),
    neutral: (
      <div className="flex size-5 min-h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-muted">
        <FontAwesomeIcon
          icon={faInfo}
          className="text-xs text-primary-foreground"
        />
      </div>
    ),
  }

  const icon = cell.status ? icons[cell.status] : null

  return (
    <div className="flex items-center gap-4 md:gap-3">
      {icon && <span className="inline-flex items-center">{icon}</span>}
      <span>{cell.text}</span>
    </div>
  )
}

export const SeoPageTemplate = ({
  content,
  showLogosInHeader,
  showLoomComparisonSlider,
  showVideo = true,
  skipHero = false,
}: {
  content: SeoPageContent
  showVideo?: boolean
  showLogosInHeader?: boolean
  showLoomComparisonSlider?: boolean
  skipHero?: boolean
}) => {
  return (
    <>
      {showLogosInHeader && (
        <>
          <MotionImage
            alt="Theo Logo"
            initial={{ opacity: 0, left: "-40vw" }}
            animate={{ opacity: 0.5, left: "-17vw" }}
            transition={{ duration: 1 }}
            width={500}
            height={500}
            className="absolute top-[200px] hidden md:flex md:size-[300px] lg:size-[400px] xl:size-[500px]"
            src="/logos/logo-solo.svg"
          />

          <MotionImage
            alt="Loom Logo"
            initial={{ opacity: 0, right: "-40vw" }}
            animate={{ opacity: 0.5, right: "-17vw" }}
            transition={{ duration: 1 }}
            width={500}
            height={500}
            className="absolute top-[200px] hidden md:flex md:size-[300px] lg:size-[400px] xl:size-[500px]"
            src="/logos/loom.svg"
          />
        </>
      )}

      {!skipHero && (
        <div className="relative mt-12">
          <div className="relative z-10 mt-[12vh] flex h-full w-full flex-col px-5 md:mt-[20vh]">
            <div className="mx-auto w-full max-w-5xl px-5 text-center sm:px-8">
              {content.badge && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                  className="mb-4"
                >
                  <Badge variant="secondary">{content.badge}</Badge>
                </motion.div>
              )}
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: content.badge ? 0.2 : 0 }}
                className="relative z-10 mb-6 text-4xl leading-11 text-foreground md:text-6xl md:leading-16"
              >
                {content.title}
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: content.badge ? 0.3 : 0.2 }}
                className="mx-auto mb-10 max-w-3xl text-base text-muted-foreground sm:text-xl"
              >
                {content.description}
              </motion.p>
            </div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{
                opacity: 1,
                y: 0,
                transition: {
                  duration: 0.3,
                  delay: 0.3,
                },
              }}
              className="flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4"
            >
              <MotionButton
                variant="blue"
                href={content.cta.buttonHref ?? "/download"}
                target={content.cta.buttonTarget}
                icon={content.cta.buttonIcon}
                size="lg"
                className="relative z-20 w-full text-base font-medium sm:w-auto"
              >
                {content.cta.buttonText}
              </MotionButton>
              {content.cta.secondaryButtonText && (
                <MotionButton
                  variant="white"
                  href={content.cta.secondaryButtonHref ?? "/pricing"}
                  target={content.cta.secondaryButtonTarget}
                  size="lg"
                  className="relative z-20 w-full text-base font-medium sm:w-auto"
                >
                  {content.cta.secondaryButtonText}
                </MotionButton>
              )}
            </motion.div>
          </div>
        </div>
      )}

      {showLoomComparisonSlider && (
        <ComparisonSlider
          leftImage="/app/theo-dashboard.webp"
          rightImage="/app/loomdashboard.webp"
          leftAlt="Theo Dashboard"
          rightAlt="Loom Dashboard"
          leftLabel="Theo"
          rightLabel="Loom"
        />
      )}

      <div className="relative z-10 mx-auto mt-32 mb-[260px] flex w-full max-w-screen-2xl flex-col gap-28 px-5 sm:px-8 md:gap-48 lg:px-10">
        <div className="mb-28">
          <div className="mx-auto mb-16 max-w-4xl text-center">
            <h2 className="relative mb-2 inline-block text-3xl font-medium text-foreground md:text-4xl">
              {content.featuresTitle}
            </h2>
            <p className="text-xl leading-relaxed text-muted-foreground">
              {renderHTML(content.featuresDescription)}
            </p>
          </div>
          <div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-8 px-4 md:grid-cols-3">
            {content.features.map((feature, index) => (
              <div
                key={index.toString()}
                className="transform rounded-2xl border border-border bg-muted p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="mb-4 flex size-8 items-center justify-center rounded-full bg-muted">
                  <span className="text-sm font-medium text-muted-foreground">
                    {index + 1}
                  </span>
                </div>
                <h3 className="mb-4 text-xl font-semibold text-foreground">
                  {feature.title}
                </h3>
                <p className="leading-relaxed text-muted-foreground">
                  {renderHTML(feature.description)}
                </p>
              </div>
            ))}
          </div>
        </div>

        {showVideo && (
          <div>
            <div className="mx-auto mb-10 max-w-4xl text-center">
              <h2 className="relative mb-2 inline-block text-3xl font-medium text-foreground md:text-4xl">
                {content.video.title ?? "See Theo in Action"}
              </h2>
              <p className="text-xl leading-relaxed text-muted-foreground">
                Watch how Theo makes screen recording simple, powerful, and
                accessible.
              </p>
            </div>
            <div className="mx-auto max-w-2xl">
              {content.video.iframe ? (
                <div
                  className="w-full overflow-hidden rounded-xl shadow-md"
                  style={{
                    position: "relative",
                    paddingBottom: "56.25%",
                    height: 0,
                  }}
                >
                  <iframe
                    src={content.video.iframe.src}
                    title={content.video.iframe.title || "Theo Demo"}
                    frameBorder="0"
                    allowFullScreen
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "100%",
                      borderRadius: "0.75rem",
                    }}
                  />
                </div>
              ) : content.video.url ? (
                <div className="overflow-hidden rounded-xl shadow-md">
                  <iframe
                    src={content.video.url}
                    title={content.video.alt ?? "Theo demo video"}
                    allow="fullscreen; picture-in-picture"
                    allowFullScreen
                    className="aspect-video w-full border-0"
                  />
                </div>
              ) : null}
            </div>
          </div>
        )}

        {content.comparison && content.comparisonTitle && (
          <div>
            <div className="mx-auto mb-8 max-w-4xl text-center">
              <h2 className="relative mb-2 inline-block text-3xl font-medium text-foreground md:text-4xl">
                {content.comparisonTitle}
              </h2>
              {content.comparisonDescription && (
                <p className="text-xl leading-relaxed text-muted-foreground">
                  {renderHTML(content.comparisonDescription)}
                </p>
              )}
            </div>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              {content.comparison.map((item, index) => (
                <div
                  key={index.toString()}
                  className="transform rounded-2xl border border-border bg-muted p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="mb-4 flex size-8 items-center justify-center rounded-full bg-muted">
                    {" "}
                    <span className="text-sm font-medium text-muted-foreground">
                      {index + 1}
                    </span>
                  </div>
                  <h3 className="mb-4 text-xl font-semibold text-foreground">
                    {item.title}
                  </h3>
                  <p className="leading-relaxed text-muted-foreground">
                    {renderHTML(item.description)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {content.recordingModes && (
          <div>
            <div className="mx-auto mb-12 max-w-4xl text-center">
              <h2 className="relative mb-2 inline-block text-3xl font-medium text-foreground md:text-4xl">
                {content.recordingModes.title}
              </h2>
              <p className="mx-auto w-full max-w-2xl text-lg leading-relaxed text-muted-foreground">
                {renderHTML(content.recordingModes.description)}
              </p>
            </div>
            <div className="mx-auto grid max-w-4xl grid-cols-1 gap-8 md:grid-cols-2">
              {content.recordingModes.modes.map((mode, index) => (
                <div
                  key={index.toString()}
                  className="transform rounded-2xl border bg-muted p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                >
                  {mode.icon}
                  <h3 className="mb-4 text-xl font-semibold text-foreground">
                    {mode.title}
                  </h3>
                  <p className="leading-relaxed text-muted-foreground">
                    {renderHTML(mode.description)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {content.comparisonTable && (
          <div>
            <div className="mx-auto mb-12 max-w-4xl text-center">
              <h2 className="relative inline-block text-3xl font-medium text-foreground md:text-4xl">
                {content.comparisonTable.title}
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="mx-auto w-full max-w-4xl overflow-hidden rounded-2xl bg-muted">
                <thead className="bg-muted">
                  <tr>
                    {content.comparisonTable.headers.map((header, index) => (
                      <th
                        key={index.toString()}
                        className="border-b border-border px-6 py-4 text-left text-lg font-semibold text-muted-foreground"
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {content.comparisonTable.rows.map((row, rowIndex) => (
                    <tr
                      key={rowIndex.toString()}
                      className={rowIndex % 2 === 0 ? "bg-muted" : "bg-muted"}
                    >
                      {row.map((cell, cellIndex) => (
                        <td
                          key={cellIndex.toString()}
                          className={`px-6 py-4 text-base text-muted-foreground ${
                            rowIndex ===
                            (content.comparisonTable?.rows.length ?? 0) - 1
                              ? ""
                              : "border-b border-border"
                          }`}
                        >
                          {renderComparisonCell(cell)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <div>
          <div className="mx-auto mb-12 max-w-4xl text-center">
            <h2 className="relative mb-2 inline-block text-3xl font-medium text-foreground md:text-4xl">
              {content.useCasesTitle}
            </h2>
            <p className="text-xl leading-relaxed text-muted-foreground">
              {renderHTML(content.useCasesDescription)}
            </p>
          </div>
          <div className="mx-auto grid w-full max-w-5xl grid-cols-1 gap-8 px-4 md:grid-cols-2">
            {content.useCases.map((useCase, index) => (
              <div
                key={index.toString()}
                className="transform rounded-2xl border border-border bg-muted p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="mb-4 flex size-8 items-center justify-center rounded-full bg-muted">
                  {" "}
                  <span className="text-sm font-medium text-muted-foreground">
                    {index + 1}
                  </span>
                </div>
                <h3 className="mb-4 text-xl font-semibold text-foreground">
                  {useCase.title}
                </h3>
                <p className="leading-relaxed text-muted-foreground">
                  {renderHTML(useCase.description)}
                </p>
              </div>
            ))}
          </div>
        </div>

        {content.migrationGuide && (
          <div>
            <div className="mx-auto mb-8 max-w-4xl text-center">
              <h2 className="relative mb-2 inline-block text-3xl font-medium text-foreground md:text-4xl">
                {content.migrationGuide.title}
              </h2>
            </div>
            <div className="mx-auto max-w-3xl rounded-2xl bg-muted px-8 shadow-sm">
              <ol className="list-none">
                {content.migrationGuide.steps.map((step, index) => (
                  <li
                    key={index.toString()}
                    className="flex items-start border-border py-6 not-last:border-b"
                  >
                    <div className="mr-4 flex size-8 items-center justify-center rounded-full bg-muted">
                      {index + 1}
                    </div>
                    <p className="mt-1 text-muted-foreground">{step}</p>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        )}

        <div>
          <div className="mx-auto mb-8 max-w-4xl text-center">
            <h2 className="relative mb-2 inline-block text-3xl font-medium text-foreground md:text-4xl">
              {content.faqsTitle}
            </h2>
          </div>
          <div className="mx-auto mb-10 max-w-3xl">
            <Accordion className="gap-3">
              {content.faqs.map((faq, index) => (
                <AccordionItem
                  key={index.toString()}
                  value={`faq-${index}`}
                  className="rounded-xl border border-border bg-card px-5 shadow-sm"
                >
                  <AccordionTrigger className="py-4 text-base">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="pb-4 text-base leading-relaxed text-muted-foreground">
                    {renderHTML(faq.answer)}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>

        <div className="relative mx-auto flex min-h-80 max-w-5xl flex-col justify-center overflow-hidden rounded-3xl border border-border bg-background p-6 sm:p-12">
          <Image
            src="/illustrations/ctabg.svg"
            alt=""
            fill
            className="object-cover"
          />
          <div className="relative z-10 mx-auto flex h-full w-full flex-col items-center justify-center">
            <div className="mx-auto mb-8 max-w-4xl text-center">
              <h2 className="mb-4 text-3xl font-medium text-foreground md:text-4xl">
                {content.cta.title}
              </h2>
              <p className="mb-6 text-xl text-muted-foreground">
                {content.cta.subtitle ??
                  "Ready to get started? Download now and see the difference."}
              </p>
            </div>
            <div className="flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
              <Button
                variant="blue"
                href={content.cta.buttonHref ?? "/download"}
                target={content.cta.buttonTarget}
                icon={content.cta.buttonIcon}
                size="lg"
                className="w-full px-8 py-3 font-medium transition-all duration-300 sm:w-auto sm:max-w-fit"
              >
                {content.cta.buttonText}
              </Button>
              {content.cta.secondaryButtonText && (
                <Button
                  variant="white"
                  href={content.cta.secondaryButtonHref ?? "/pricing"}
                  target={content.cta.secondaryButtonTarget}
                  size="lg"
                  className="w-full px-8 py-3 font-medium transition-all duration-300 sm:w-auto sm:max-w-fit"
                >
                  {content.cta.secondaryButtonText}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
