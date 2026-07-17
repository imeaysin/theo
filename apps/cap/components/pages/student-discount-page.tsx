"use client"

import { Button } from "@/components/cap-ui"
import {
  faBookOpen,
  faCopy,
  faRocket,
  faUsers,
} from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { motion } from "framer-motion"
import Image from "next/image"
import { useState } from "react"
import { toast } from "sonner"

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

const _fadeInFromBottom = {
  hidden: { opacity: 0, y: 50 },
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

export const StudentDiscountPage = () => {
  const [copied, setCopied] = useState(false)
  const discountCode = "STUDENT50"

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(discountCode)
      setCopied(true)
      toast.success("Discount code copied!")
      setTimeout(() => setCopied(false), 2000)
    } catch (_err) {
      toast.error("Failed to copy code")
    }
  }

  return (
    <div className="mt-[120px]">
      <div className="relative z-10 w-full px-5 pt-24 pb-36">
        <motion.div
          className="mx-auto w-full max-w-5xl px-5 text-center sm:px-8"
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          <motion.h1
            className="relative z-10 mb-4 animate-in text-3xl leading-[2.5rem] text-foreground fade-in slide-in-from-bottom-4 md:text-6xl md:leading-[4rem]"
            variants={fadeIn}
            custom={1}
          >
            🎓 Student Discount
          </motion.h1>
          <motion.p
            className="mx-auto mb-8 max-w-3xl animate-in text-base text-muted-foreground delay-300 fade-in slide-in-from-bottom-4 sm:text-xl"
            variants={fadeIn}
            custom={2}
          >
            Level up your presentations and portfolio with 30% off Cap&apos;s
            premium features. Perfect for students, researchers, and future
            creators.
          </motion.p>

          {/* Clean Discount Badge */}
          <motion.div
            className="mx-auto mt-12 max-w-2xl"
            variants={fadeIn}
            custom={3}
          >
            <div className="rounded-2xl border border-border bg-muted p-8 shadow-sm">
              <h2 className="mb-4 text-center text-2xl font-semibold text-foreground">
                30% Student Discount
              </h2>
              <div className="mb-4 flex items-center justify-center gap-3">
                <code className="rounded-lg bg-muted px-4 py-2 font-mono text-lg font-semibold text-muted-foreground">
                  {discountCode}
                </code>
                <motion.button
                  onClick={copyToClipboard}
                  className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted text-muted-foreground transition-all duration-200 hover:bg-muted hover:text-muted-foreground"
                  title="Copy code"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FontAwesomeIcon
                    icon={faCopy}
                    className={`size-4 ${copied ? "text-primary" : ""}`}
                  />
                </motion.button>
              </div>
              <p className="text-center text-muted-foreground">
                Use this code at checkout to save 30% on any premium plan
              </p>
            </div>
          </motion.div>

          {/* How to Claim Steps - Clean Version */}
          <motion.div
            className="mx-auto mt-12 max-w-3xl"
            variants={fadeIn}
            custom={4}
          >
            <div className="rounded-2xl border border-border bg-muted p-8 shadow-sm">
              <h3 className="mb-6 text-center text-xl font-semibold text-foreground">
                How to claim your discount
              </h3>
              <ol className="list-none">
                <div className="flex items-start border-b border-border py-4 last:border-b-0">
                  <div className="mr-4 flex size-8 flex-shrink-0 items-center justify-center rounded-full bg-muted">
                    <span className="text-sm font-medium text-muted-foreground">
                      1
                    </span>
                  </div>
                  <p className="mt-1 text-muted-foreground">
                    Copy the discount code{" "}
                    <strong className="text-muted-foreground">
                      {discountCode}
                    </strong>
                  </p>
                </div>
                <div className="flex items-start border-b border-border py-4 last:border-b-0">
                  <div className="mr-4 flex size-8 flex-shrink-0 items-center justify-center rounded-full bg-muted">
                    <span className="text-sm font-medium text-muted-foreground">
                      2
                    </span>
                  </div>
                  <p className="mt-1 text-muted-foreground">
                    Visit the{" "}
                    <a
                      href="/pricing"
                      className="font-semibold text-muted-foreground underline"
                    >
                      Pricing
                    </a>{" "}
                    page and choose a plan
                  </p>
                </div>
                <div className="flex items-start border-b border-border py-4 last:border-b-0">
                  <div className="mr-4 flex size-8 flex-shrink-0 items-center justify-center rounded-full bg-muted">
                    <span className="text-sm font-medium text-muted-foreground">
                      3
                    </span>
                  </div>
                  <p className="mt-1 text-muted-foreground">
                    Enter the code at checkout to get{" "}
                    <strong className="text-muted-foreground">30% off</strong>
                  </p>
                </div>
              </ol>
            </div>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-4"
            variants={fadeIn}
            custom={5}
          >
            <Button
              variant="primary"
              href="/pricing"
              size="lg"
              className="flex items-center justify-center font-medium"
            >
              View Plans & Pricing
            </Button>
            <Button
              variant="white"
              href="/download"
              size="lg"
              className="flex items-center justify-center font-medium"
            >
              Download Cap Free
            </Button>
          </motion.div>
        </motion.div>
        <Image
          src="/illustrations/mask-big-recorder.webp"
          alt="Student Background"
          width={1920}
          height={1080}
          className="pointer-events-none absolute top-0 left-0 z-0 -mt-40 h-auto w-full opacity-30"
        />
      </div>

      {/* Main Content */}
      <motion.div
        className="mx-auto w-full max-w-screen-2xl px-5 pb-24 sm:px-8 lg:px-10"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={staggerContainer}
      >
        {/* Student Use Cases */}
        <motion.div
          className="mx-auto mt-24 max-w-6xl"
          variants={fadeIn}
          custom={1}
        >
          <div className="mb-12 text-center">
            <h2 className="relative mb-6 inline-block text-3xl font-medium text-foreground">
              Perfect for Students
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              Whether you&apos;re presenting, building your portfolio, or
              collaborating with classmates, Cap helps you create professional
              content that stands out.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            <div className="rounded-2xl border border-border bg-muted p-8 shadow-sm">
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-primary">
                <FontAwesomeIcon
                  className="size-6 text-primary"
                  icon={faBookOpen}
                />
              </div>
              <h3 className="mb-4 text-xl font-semibold text-foreground">
                School Projects
              </h3>
              <p className="leading-relaxed text-muted-foreground">
                Record presentations, demos, and tutorials for your assignments.
                Create shareable links that are auto-transcribed and summarized,
                with tracking to see when they&apos;re opened.
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-muted p-8 shadow-sm">
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-purple-50">
                <FontAwesomeIcon
                  className="size-6 text-purple-500"
                  icon={faRocket}
                />
              </div>
              <h3 className="mb-4 text-xl font-semibold text-foreground">
                Portfolio Building
              </h3>
              <p className="leading-relaxed text-muted-foreground">
                Create professional video content to showcase your work, code
                walkthroughs, and project demos. Share with auto-generated
                transcripts and summaries that help you stand out to employers.
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-muted p-8 shadow-sm">
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-pink-50">
                <FontAwesomeIcon
                  className="size-6 text-pink-500"
                  icon={faUsers}
                />
              </div>
              <h3 className="mb-4 text-xl font-semibold text-foreground">
                Study Groups
              </h3>
              <p className="leading-relaxed text-muted-foreground">
                Share knowledge and collaborate with classmates effectively.
                Create trackable shareable links with auto-generated summaries
                to help your peers learn and succeed.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Ready to Get Started CTA */}
        <motion.div
          className="relative mx-auto my-[100px] flex min-h-[300px] w-full max-w-5xl flex-col justify-center overflow-hidden rounded-[20px] border border-border bg-background p-8 md:bg-center"
          style={{
            backgroundImage: "url('/illustrations/ctabg.svg')",
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
          }}
          variants={fadeIn}
          custom={2}
        >
          <div className="relative z-10 mx-auto flex h-full flex-col items-center justify-center">
            <div className="mx-auto mb-8 max-w-4xl text-center">
              <h2 className="mb-3 text-3xl text-foreground md:text-4xl">
                Ready to elevate your student projects?
              </h2>
              <p className="text-lg text-muted-foreground">
                Join thousands of students already using Cap to create amazing
                content
              </p>
            </div>
            <div className="flex w-full flex-col items-center justify-center gap-4 sm:flex-row sm:gap-4">
              <Button
                variant="primary"
                href="/pricing"
                size="lg"
                className="transform font-medium transition-all duration-300 hover:-translate-y-[2px]"
              >
                Get Started with 30% Off
              </Button>
              <Button
                variant="white"
                href="/download"
                size="lg"
                className="transform font-medium transition-all duration-300 hover:-translate-y-[2px]"
              >
                Try Cap Free First
              </Button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}
