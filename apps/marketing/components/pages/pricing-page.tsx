"use client"

import { faHeart } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { motion } from "framer-motion"
import { type MouseEvent, useId } from "react"
import { Testimonials } from "../ui/testimonials"
import ComparePlans from "../pricing/compare-plans"
import Faq from "./home-page/faq"
import { CommercialCard } from "../pricing/commercial-card"
import { EnterpriseCard } from "../pricing/enterprise-card"
import { ProCard } from "../pricing/pro-card"

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: (custom = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: custom * 0.1,
      duration: 0.5,
      ease: "easeOut",
    },
  }),
}

const fadeInFromBottom = {
  hidden: { opacity: 0, y: 40 },
  visible: (custom = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.3 + custom * 0.1,
      duration: 0.6,
      ease: "easeOut",
    },
  }),
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
}

export const PricingPage = () => {
  const testimonialsId = useId()

  const scrollToTestimonials = (e: MouseEvent) => {
    e.preventDefault()
    const testimonials = document.getElementById(testimonialsId)
    if (testimonials) {
      const offset = 80
      const topPos =
        testimonials.getBoundingClientRect().top + window.pageYOffset - offset
      window.scrollTo({
        top: topPos,
        behavior: "smooth",
      })
    }
  }

  return (
    <motion.div initial="hidden" animate="visible" variants={staggerContainer}>
      <div className="mx-auto flex w-full max-w-screen-2xl flex-col gap-28 px-5 py-32 sm:px-8 md:py-40 lg:px-10">
        <div>
          <motion.div
            className="mb-12 text-center"
            variants={fadeIn}
            custom={0}
          >
            <motion.h1
              className="mt-3 text-4xl font-medium tracking-tight text-foreground md:text-5xl"
              variants={fadeIn}
              custom={2}
            >
              Simple, flexible pricing
            </motion.h1>
            <motion.button
              type="button"
              onClick={scrollToTestimonials}
              className="mx-auto mt-6 hidden w-fit cursor-pointer items-center justify-center gap-2 rounded-full border border-border bg-muted px-5 py-2.5 transition-colors hover:bg-muted sm:flex"
              variants={fadeIn}
              custom={4}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
            >
              <FontAwesomeIcon
                className="size-3.5 text-destructive"
                icon={faHeart}
              />
              <span className="text-sm font-medium text-muted-foreground">
                Trusted by teams, builders and creators
              </span>
            </motion.button>
          </motion.div>

          <motion.div
            className="mx-auto grid w-full max-w-6xl items-stretch gap-6 pt-3 lg:grid-cols-3"
            variants={fadeInFromBottom}
            custom={0}
          >
            <CommercialCard />
            <ProCard />
            <EnterpriseCard />
          </motion.div>
        </div>

        <div>
          <ComparePlans />
        </div>

        <div>
          <Faq />
        </div>

        <div
          className="mx-auto mb-32 w-full max-w-screen-2xl px-5 sm:px-8 lg:px-10"
          id={testimonialsId}
        >
          <Testimonials
            amount={24}
            title="Teams & creators love Theo"
            subtitle="Don't just take our word for it. Here's what our users are saying about their experience with Theo."
          />
        </div>
      </div>
    </motion.div>
  )
}
