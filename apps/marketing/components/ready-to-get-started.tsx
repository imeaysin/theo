"use client"

import { Button } from "@/components/product-ui"
import { useDetectPlatform } from "hooks/use-detect-platform"
import Image from "next/image"
import Link from "next/link"
import { getPlatformIcon } from "@/utils/platform"
import { homepageCopy } from "../data/homepage-copy"
import UpgradeToPro from "./upgrade-to-pro"

export function ReadyToGetStarted() {
  const { platform } = useDetectPlatform()
  const loading = platform === null

  return (
    <div className="relative mx-auto my-32 flex min-h-80 w-full max-w-5xl flex-col justify-center overflow-hidden rounded-2xl border border-border bg-background p-8 md:my-40 lg:my-48">
      <Image
        src="/illustrations/ctabg.svg"
        alt=""
        fill
        className="object-cover"
      />
      <div className="relative z-10 mx-auto flex h-full w-full max-w-screen-2xl flex-col items-center justify-center px-5 sm:px-8 lg:px-10">
        <div className="mx-auto mb-8 max-w-[800px] text-center">
          <h2 className="mb-3 text-3xl text-foreground md:text-4xl">
            {homepageCopy.readyToGetStarted.title}
          </h2>
        </div>
        <div className="mb-8 flex w-full flex-col items-center justify-center gap-4 sm:flex-row sm:gap-2">
          <Button
            variant="dark"
            href="/pricing"
            size="lg"
            className="w-fit font-medium"
          >
            {!loading && getPlatformIcon(platform)}
            {homepageCopy.readyToGetStarted.buttons.secondary}
          </Button>
          <UpgradeToPro text={homepageCopy.header.cta.primaryButton} />
        </div>
        <div>
          <p>
            or,{" "}
            <Link
              href="/loom-alternative"
              className="font-semibold underline hover:text-foreground"
            >
              Switch from Loom
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
