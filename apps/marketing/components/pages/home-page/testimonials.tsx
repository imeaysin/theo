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
      className="flex h-full flex-col rounded-xl border border-border bg-card p-6 transition-colors hover:bg-muted/40"
    >
      <div className="mb-4 flex items-center gap-3">
        <div className="relative size-12 shrink-0 overflow-hidden rounded-full border border-border">
          <Image
            src={image}
            alt={`${name}'s profile picture`}
            fill
            className="object-cover"
          />
        </div>
        <div className="min-w-0">
          <h3 className="truncate text-base font-medium text-foreground">
            {name}
          </h3>
          {handle ? (
            <p className="truncate text-sm text-muted-foreground">{handle}</p>
          ) : null}
        </div>
      </div>
      <p className="text-sm leading-relaxed text-muted-foreground">{content}</p>
    </a>
  )
}

export default function Testimonials() {
  return (
    <div className="mx-auto w-full max-w-5xl px-5">
      <div className="mb-12 text-center">
        <h2 className="mb-3 text-4xl font-medium text-balance text-foreground">
          {homeContent.testimonials.title}
        </h2>
        <p className="mx-auto max-w-md text-lg leading-7 text-muted-foreground">
          {homeContent.testimonials.subtitle}
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {featured.map((item) => (
          <TestimonialCard key={`${item.name}:${item.handle}`} {...item} />
        ))}
      </div>

      <div className="mt-10 flex justify-center">
        <Button href="/testimonials" variant="dark" size="lg" className="w-fit">
          {homeContent.testimonials.cta}
        </Button>
      </div>
    </div>
  )
}
