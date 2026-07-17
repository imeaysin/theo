"use client"

import { Button } from "@/components/cap-ui"
import Image from "next/image"
import Link from "next/link"
import { useEffect, useId } from "react"
import { RichText, renderRichText } from "@/components/rich-text"

const formatDate = (date: string) =>
  new Intl.DateTimeFormat("en", { dateStyle: "long" }).format(new Date(date))

interface BlogPost {
  title: string
  description: string
  publishedAt: string
  updatedAt?: string
  category: string
  image?: string
  author: string
  tags: string[]
  heroTLDR: string
  slug: string
  gradientColors?: string[]
  comparisonTable?: {
    title: string
    headers: string[]
    rows: string[][]
  }
  methods?: {
    title: string
    description: string
    steps: {
      title?: string
      content: string
    }[]
  }[]
  troubleshooting?: {
    title: string
    items: {
      question: string
      answer: string
    }[]
  }
  proTips?: {
    title: string
    tips: {
      title: string
      description: string
    }[]
  }
  videoDemo?: {
    title: string
    videoSrc: string
    caption: string
  }
  faqs?: {
    question: string
    answer: string
  }[]
  testimonial?: {
    quote: string
    author: string
    avatar: string
  }
  cta: {
    title: string
    description: string
    buttonText: string
    buttonLink: string
    subtitle: string
  }
  relatedLinks?: {
    text: string
    url: string
  }[]
}

const renderHTML = (content: string) => (
  <RichText content={content} className="prose prose-lg" />
)

export const BlogTemplate = ({ content }: { content: BlogPost }) => {
  const cloud1Id = useId()
  const cloud2Id = useId()

  useEffect(() => {
    const animateClouds = () => {
      const cloud1 = document.getElementById(cloud1Id)
      const cloud2 = document.getElementById(cloud2Id)

      if (cloud1 && cloud2) {
        cloud1.animate(
          [
            { transform: "translateX(0) translateY(0)" },
            { transform: "translateX(-10px) translateY(5px)" },
            { transform: "translateX(10px) translateY(-5px)" },
            { transform: "translateX(0) translateY(0)" },
          ],
          {
            duration: 15000,
            iterations: Infinity,
            easing: "ease-in-out",
          }
        )

        cloud2.animate(
          [
            { transform: "translateX(0) translateY(0)" },
            { transform: "translateX(10px) translateY(-5px)" },
            { transform: "translateX(-10px) translateY(5px)" },
            { transform: "translateX(0) translateY(0)" },
          ],
          {
            duration: 18000,
            iterations: Infinity,
            easing: "ease-in-out",
          }
        )
      }
    }

    animateClouds()
  }, [cloud1Id, cloud2Id])

  return (
    <article className="relative z-10 mx-auto max-w-3xl px-3 py-32 md:py-40">
      <header className="mb-16 text-center">
        <div className="mb-4 animate-in text-sm font-medium text-primary fade-in slide-in-from-bottom-4">
          {content.category}
        </div>
        <h1 className="mb-6 animate-in text-4xl font-medium text-foreground fade-in slide-in-from-bottom-4 md:text-5xl">
          {content.title}
        </h1>
        <p className="mx-auto mb-8 max-w-3xl animate-in text-xl text-muted-foreground delay-300 fade-in slide-in-from-bottom-4 md:text-2xl">
          {content.description}
        </p>
        <div className="flex animate-in items-center justify-center gap-2 text-sm text-muted-foreground delay-500 fade-in slide-in-from-bottom-4">
          <time dateTime={content.updatedAt ?? content.publishedAt}>
            {content.updatedAt
              ? `Updated ${formatDate(content.updatedAt)}`
              : formatDate(content.publishedAt)}
          </time>
          <span>•</span>
          <span>by {content.author}</span>
        </div>
      </header>

      <div className="mb-12 rounded-xl border border-primary bg-primary p-8 shadow-md">
        <h2 className="relative mb-4 inline-block text-2xl font-medium text-foreground">
          TL;DR
          <span className="absolute -bottom-1 left-0 h-1 w-16 rounded-full bg-primary"></span>
        </h2>
        <p className="mt-6 text-xl text-muted-foreground">{content.heroTLDR}</p>
        <div className="mt-6 inline-flex">
          <Button
            href={content.cta.buttonLink}
            size="lg"
            variant="blue"
            className="px-6 py-3 shadow-lg"
          >
            {content.cta.buttonText}
          </Button>
        </div>
      </div>

      {content.comparisonTable && (
        <section className="mb-16">
          <h2 className="relative mb-8 inline-block text-3xl font-medium text-foreground">
            {content.comparisonTable.title}
            <span className="absolute -bottom-2 left-1/2 h-1 w-20 -translate-x-1/2 transform rounded-full bg-primary"></span>
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse overflow-hidden rounded-lg shadow-md">
              <thead className="bg-primary">
                <tr>
                  {content.comparisonTable.headers.map(
                    (header, headerIndex) => (
                      <th
                        key={`header-${headerIndex}-${header}`}
                        className="border-b border-border px-6 py-4 text-left font-semibold text-muted-foreground"
                      >
                        {header}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody>
                {content.comparisonTable.rows.map((row, rowIndex) => (
                  <tr
                    key={row.join("|")}
                    className={rowIndex % 2 === 0 ? "bg-muted" : "bg-muted"}
                  >
                    {row.map((cell) => (
                      <td
                        key={cell}
                        className="border-b border-border px-6 py-4"
                      >
                        {renderRichText(cell)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {content.methods?.map((method, methodIndex) => (
        <section
          key={`method-${methodIndex}-${method.title}`}
          className="mb-16"
        >
          <h2 className="relative mb-6 inline-block text-3xl font-medium text-foreground">
            {method.title}
            <span className="absolute -bottom-2 left-1/2 h-1 w-20 -translate-x-1/2 transform rounded-full bg-primary"></span>
          </h2>
          <p className="mb-8 text-xl text-muted-foreground">
            {method.description}
          </p>

          {method.steps.map((step) => (
            <div
              key={step.title ?? step.content}
              className="mb-8 rounded-xl border border-border bg-muted p-6 shadow-md"
            >
              {step.title && (
                <h3 className="mb-4 text-2xl font-semibold text-foreground">
                  {step.title}
                </h3>
              )}
              {renderHTML(step.content)}
            </div>
          ))}
        </section>
      ))}

      {content.troubleshooting && (
        <section className="mb-16">
          <h2 className="relative mb-8 inline-block text-3xl font-medium text-foreground">
            {content.troubleshooting.title}
            <span className="absolute -bottom-2 left-1/2 h-1 w-20 -translate-x-1/2 transform rounded-full bg-primary"></span>
          </h2>

          <div className="flex flex-col gap-4">
            {content.troubleshooting.items.map((item, itemIndex) => (
              <details
                key={`trouble-${itemIndex}-${item.question.slice(0, 20)}`}
                className="rounded-xl border border-border bg-muted p-6 shadow-md"
              >
                <summary className="cursor-pointer text-xl font-semibold text-muted-foreground">
                  {item.question}
                </summary>
                <p className="mt-4 text-muted-foreground">
                  {renderRichText(item.answer)}
                </p>
              </details>
            ))}
          </div>
        </section>
      )}

      {content.proTips && (
        <section className="mb-16">
          <h2 className="relative mb-8 inline-block text-3xl font-medium text-foreground">
            {content.proTips.title}
            <span className="absolute -bottom-2 left-1/2 h-1 w-20 -translate-x-1/2 transform rounded-full bg-primary"></span>
          </h2>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {content.proTips.tips.map((tip, tipIndex) => (
              <div
                key={`tip-${tipIndex}-${tip.title}`}
                className="rounded-xl border border-primary bg-primary p-6 shadow-md"
              >
                <h3 className="mb-3 text-xl font-semibold text-primary">
                  🔹 {tip.title}
                </h3>
                <p className="text-muted-foreground">{tip.description}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {content.videoDemo && (
        <section className="mb-16">
          <h2 className="relative mb-6 inline-block text-3xl font-medium text-foreground">
            {content.videoDemo.title}
            <span className="absolute -bottom-2 left-1/2 h-1 w-20 -translate-x-1/2 transform rounded-full bg-primary"></span>
          </h2>

          <figure className="overflow-hidden rounded-xl shadow-lg">
            <iframe
              src={content.videoDemo.videoSrc}
              title={content.videoDemo.caption}
              allow="fullscreen; picture-in-picture"
              allowFullScreen
              className="aspect-video w-full border-0"
            />
          </figure>
        </section>
      )}

      {content.faqs && (
        <section className="mb-16">
          <h2 className="relative mb-8 inline-block text-3xl font-medium text-foreground">
            Frequently Asked Questions
            <span className="absolute -bottom-2 left-1/2 h-1 w-20 -translate-x-1/2 transform rounded-full bg-primary"></span>
          </h2>

          <div className="flex flex-col gap-4">
            {content.faqs.map((faq, faqIndex) => (
              <details
                key={`faq-${faqIndex}-${faq.question.slice(0, 20)}`}
                className="rounded-xl border border-border bg-muted p-6 shadow-md"
              >
                <summary className="cursor-pointer text-xl font-semibold text-muted-foreground">
                  {faq.question}
                </summary>
                <p className="mt-4 text-muted-foreground">
                  {renderRichText(faq.answer)}
                </p>
              </details>
            ))}
          </div>
        </section>
      )}

      {content.testimonial && (
        <section className="mb-16">
          <h2 className="relative mb-8 inline-block text-3xl font-medium text-foreground">
            What Users Are Saying
            <span className="absolute -bottom-2 left-1/2 h-1 w-20 -translate-x-1/2 transform rounded-full bg-primary"></span>
          </h2>

          <blockquote className="rounded-xl border-l-4 border-primary bg-muted p-8 shadow-md">
            <p className="mb-6 text-xl text-muted-foreground italic">
              &quot;{content.testimonial.quote}&quot;
            </p>
            <footer className="flex items-center">
              <Image
                src={content.testimonial.avatar}
                alt={content.testimonial.author}
                width={48}
                height={48}
                className="mr-4 h-12 w-12 rounded-full"
              />
              <cite className="font-medium text-muted-foreground not-italic">
                {content.testimonial.author}
              </cite>
            </footer>
          </blockquote>
        </section>
      )}

      <section className="mb-16">
        <div
          className="relative overflow-hidden rounded-2xl p-10 shadow-lg"
          style={{
            background:
              "linear-gradient(135deg, var(--primary), var(--accent))",
          }}
        >
          <div
            id={cloud1Id}
            className="pointer-events-none absolute top-0 -right-20 z-0 opacity-30 transition-transform duration-700 ease-in-out"
          >
            <Image
              className="h-auto max-w-[40vw]"
              src="/illustrations/cloud-1.png"
              alt="CTA Cloud One"
              width={400}
              height={300}
            />
          </div>
          <div
            id={cloud2Id}
            className="pointer-events-none absolute bottom-0 left-0 z-0 opacity-30 transition-transform duration-700 ease-in-out"
          >
            <Image
              className="h-auto max-w-[40vw]"
              src="/illustrations/cloud-2.png"
              alt="CTA Cloud Two"
              width={400}
              height={300}
            />
          </div>
          <div className="relative z-10">
            <h2 className="mb-4 text-3xl font-medium text-primary-foreground">
              {content.cta.title}
            </h2>
            <p className="mb-8 text-xl text-primary-foreground/90">
              {content.cta.description}
            </p>
            <div className="inline-flex">
              <Button
                href={content.cta.buttonLink}
                variant="white"
                size="lg"
                className="px-8 py-3 text-primary shadow-lg"
              >
                {content.cta.buttonText}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {content.relatedLinks && content.relatedLinks.length > 0 && (
        <div className="text-center text-muted-foreground italic">
          Check out{" "}
          {(() => {
            const links = content.relatedLinks
            return links.map((link, linkIndex) => (
              <span key={`link-${linkIndex}-${link.url}`}>
                <Link
                  href={link.url}
                  className="text-primary transition-colors hover:underline"
                >
                  {link.text}
                </Link>
                {linkIndex < links.length - 1 ? " or " : ""}
              </span>
            ))
          })()}
          .
        </div>
      )}
    </article>
  )
}
