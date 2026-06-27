import type { Metadata } from "next"
import { ChatPage } from "@/components/chat/chat-page"
import { createMarketingMetadata } from "@/lib/metadata"

export const metadata: Metadata = createMarketingMetadata({
  title: "Run your business from iMessage, WhatsApp, Slack & Telegram",
  description:
    "Get invoices paid, track time, manage expenses — right from iMessage, WhatsApp, Slack, or Telegram. Run your business from any chat app.",
  path: "/chat",
  og: {
    title: "Chat",
    description: "Run your business from any messaging app",
  },
  keywords: [
    "iMessage business",
    "WhatsApp invoicing",
    "Slack time tracking",
    "Telegram bookkeeping",
    "chat assistant",
    "conversational finance",
    "business messaging",
  ],
})

export default function Page() {
  return <ChatPage />
}
