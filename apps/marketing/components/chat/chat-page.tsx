"use client"

import { ChatHubSection } from "@workspace/ui/components/landing"
import { Icons } from "@workspace/ui/components/icons"
import { siteConfig } from "@/config/site"

const chatPlatforms = [
  {
    href: "/chat/imessage",
    label: "iMessage",
    icon: <Icons.IMessage className="size-10" />,
  },
  {
    href: "/chat/slack",
    label: "Slack",
    icon: <Icons.Slack className="size-10" />,
  },
  {
    href: "/chat/whatsapp",
    label: "WhatsApp",
    icon: <Icons.WhatsApp className="size-10 text-[#25D366]" />,
    iconClassName: "hover:text-[#25D366]",
  },
  {
    href: "/chat/telegram",
    label: "Telegram",
    icon: <Icons.Telegram className="size-10" />,
  },
]

export function ChatPage() {
  return (
    <ChatHubSection productName={siteConfig.name} platforms={chatPlatforms} />
  )
}
