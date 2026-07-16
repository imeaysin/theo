import type { Metadata } from "next"
import type { ReactNode } from "react"
import { notFound } from "next/navigation"
import { GuideSection } from "@/components/landing"
import { siteConfig } from "@/config/site"
import {
  chatPlatformSlugs,
  chatPlatforms,
  type ChatPlatformSlug,
} from "@/data/chat-platforms"
import { toGuidePage } from "@/lib/chat-guide"
import { createMarketingMetadata } from "@/lib/metadata"
import { GamepadDirectional } from "lucide-react"

interface PageProps {
  params: Promise<{ platform: string }>
}

const platformIcons: Record<ChatPlatformSlug, ReactNode> = {
  imessage: <GamepadDirectional className="size-10" />,
  slack: <GamepadDirectional className="size-10" />,
  whatsapp: <GamepadDirectional className="size-10 text-[#25D366]" />,
  telegram: <GamepadDirectional className="size-10" />,
}

export function generateStaticParams() {
  return chatPlatformSlugs.map((platform) => ({ platform }))
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { platform } = await params
  const config = chatPlatforms[platform as ChatPlatformSlug]
  if (!config) return {}

  return createMarketingMetadata({
    title: `${siteConfig.name} for ${config.name}`,
    description: config.description,
    path: `/chat/${platform}`,
    og: {
      title: `${siteConfig.name} for ${config.name}`,
      description: `Your business, right in ${config.name}`,
    },
  })
}

export default async function ChatPlatformPage({ params }: PageProps) {
  const { platform } = await params
  const config = chatPlatforms[platform as ChatPlatformSlug]
  if (!config) notFound()

  return (
    <GuideSection
      page={toGuidePage({
        config,
        icon: platformIcons[platform as ChatPlatformSlug],
      })}
    />
  )
}
