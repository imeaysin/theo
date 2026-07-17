"use client"

import { ReadyToGetStarted } from "../ready-to-get-started"
import { Testimonials } from "../ui/testimonials"

interface TestimonialsPageProps {
  amount?: number
}

export const TestimonialsPage = ({ amount }: TestimonialsPageProps) => {
  return (
    <>
      <div className="mx-auto w-full max-w-screen-2xl px-5 py-32 sm:px-8 md:py-40 lg:px-10">
        <Testimonials
          amount={amount}
          title="Teams & creators love Cap"
          subtitle="Don't just take our word for it. Here's what our users are saying about their experience with Cap."
        />
      </div>
      <div className="mx-auto w-full max-w-screen-2xl px-5 pb-28 sm:px-8 lg:px-10">
        <ReadyToGetStarted />
      </div>
    </>
  )
}
