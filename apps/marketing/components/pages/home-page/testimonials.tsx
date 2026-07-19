"use client"

import { Button } from "@/components/product-ui"
import { homeContent } from "@/content/home"
import { type Testimonial, testimonials } from "@/content/testimonials"
import Image from "next/image"

const featured: Testimonial[] = testimonials.slice(0, 6)

function TestimonialCard({ name, handle, image, content, url }: Testimonial) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex h-full flex-col rounded-2xl border border-border/70 bg-background p-5 transition-colors hover:border-border hover:bg-muted/30 sm:p-6"
    >
      <p className="flex-1 text-sm leading-relaxed text-foreground/85">
        {content}
      </p>
      <div className="mt-5 flex items-center gap-3 border-t border-border/60 pt-4">
        <div className="relative size-9 shrink-0 overflow-hidden rounded-full bg-muted">
          <Image
            src={image}
            alt=""
            width={36}
            height={36}
            className="size-full object-cover"
          />
        </div>
        <div className="min-w-0">
          <h3 className="truncate text-sm font-medium text-foreground">
            {name}
          </h3>
          {handle ? (
            <p className="truncate text-xs text-muted-foreground">{handle}</p>
          ) : null}
        </div>
      </div>
    </a>
  )
}

export default function Testimonials() {
  return (
    <div className="mx-auto w-full max-w-5xl px-5">
      <div className="mb-10 text-center md:mb-12">
        <p className="mb-3 text-xs font-medium tracking-[0.14em] text-muted-foreground uppercase">
          Social proof
        </p>
        <h2 className="mb-3 text-3xl font-medium tracking-tight text-balance text-foreground md:text-4xl">
          {homeContent.testimonials.title}
        </h2>
        <p className="mx-auto max-w-md text-base leading-relaxed text-muted-foreground">
          {homeContent.testimonials.subtitle}
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {featured.map((item) => (
          <TestimonialCard key={`${item.name}:${item.handle}`} {...item} />
        ))}
      </div>

      <div className="mt-10 flex justify-center">
        <Button
          href="/testimonials"
          variant="outline"
          size="lg"
          className="w-fit font-medium"
        >
          {homeContent.testimonials.cta}
        </Button>
      </div>
    </div>
  )
}
