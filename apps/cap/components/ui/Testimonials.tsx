"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { type Testimonial, testimonials } from "../../data/testimonials"

interface TestimonialsProps {
  amount?: number
  title?: string
  subtitle?: string
  showHeader?: boolean
}

export const Testimonials = ({
  amount,
  title = "Teams & creators love Cap",
  subtitle = "Don't just take our word for it. Here's what our users are saying about their experience with Cap.",
  showHeader = true,
}: TestimonialsProps) => {
  const displayedTestimonials = amount
    ? testimonials.slice(0, amount)
    : testimonials

  const getRandomDelay = () => 0.15 + Math.random() * 0.3

  return (
    <div>
      {showHeader && (
        <>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="text-center text-3xl font-medium text-balance text-foreground md:text-4xl"
          >
            {title}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="mx-auto mt-3 max-w-2xl text-center text-muted-foreground"
          >
            {subtitle}
          </motion.p>
        </>
      )}

      <div className="mt-8 columns-1 gap-3 md:columns-2 lg:columns-3 [&>*]:mb-3">
        {displayedTestimonials.map((testimonial) => (
          <motion.div
            key={testimonial.url}
            className="mb-3 break-inside-avoid"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.3,
              delay: getRandomDelay(),
              ease: "easeOut",
            }}
          >
            <TestimonialCard testimonial={testimonial} />
          </motion.div>
        ))}
      </div>
    </div>
  )
}

interface TestimonialCardProps {
  testimonial: Testimonial
}

const TestimonialCard = ({ testimonial }: TestimonialCardProps) => {
  return (
    <motion.a
      href={testimonial.url}
      target="_blank"
      rel="noopener noreferrer"
      className="block h-auto w-full cursor-pointer rounded-xl border border-border bg-muted p-6 transition-all duration-300 hover:scale-[1.008] hover:border-primary hover:shadow-lg"
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="mb-4 flex items-center">
        <div className="relative mr-2 h-12 w-12 overflow-hidden rounded-full border-2 border-border">
          <Image
            src={testimonial.image}
            alt={testimonial.name}
            width={48}
            height={48}
            className="object-cover"
            loading="lazy"
          />
        </div>
        <div>
          <h3 className="text-sm font-medium text-foreground">
            {testimonial.name}
          </h3>
          <p className="text-sm font-medium text-muted-foreground transition-colors duration-200">
            {testimonial.handle}
          </p>
        </div>
      </div>

      <p className="text-muted-foreground">{testimonial.content}</p>
    </motion.a>
  )
}
