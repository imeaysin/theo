import { ExternalLink } from "lucide-react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "OSS Friends — Theo",
  description:
    "Discover amazing open source projects and tools built by our friends in the community.",
}

interface OSSFriend {
  name: string
  description: string
  href: string
}

const ossFriends: OSSFriend[] = [
  {
    name: "Formbricks",
    description: "Open source experience management and survey infrastructure.",
    href: "https://formbricks.com",
  },
  {
    name: "Cal.com",
    description: "Open scheduling infrastructure for everyone.",
    href: "https://cal.com",
  },
  {
    name: "Dub",
    description: "Open source link management and attribution.",
    href: "https://dub.co",
  },
]

export default function OSSFriends() {
  return (
    <div className="mt-[120px]">
      <div className="relative z-10 w-full px-5 pt-24 pb-36">
        <div className="mx-auto mb-16 w-full max-w-5xl px-5 text-center sm:px-8">
          <h1 className="relative z-10 mb-4 animate-in text-3xl leading-10 text-foreground fade-in slide-in-from-bottom-4 md:text-6xl md:leading-16">
            OSS Friends
          </h1>
          <p className="mx-auto mb-8 max-w-3xl animate-in text-base text-muted-foreground delay-300 fade-in slide-in-from-bottom-4 sm:text-xl">
            Discover amazing open source projects and tools built by our friends
            in the community.
          </p>
        </div>

        <div className="mx-auto max-w-6xl">
          <div className="grid animate-in grid-cols-1 gap-6 delay-500 fade-in slide-in-from-bottom-4 md:grid-cols-2 lg:grid-cols-3">
            {ossFriends.map((friend, index) => (
              <a
                key={friend.name}
                href={friend.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group rounded-lg border border-border bg-background p-6 transition-all duration-200 hover:-translate-y-1 hover:border-border hover:shadow-md"
                style={{
                  animationDelay: `${index * 50}ms`,
                }}
              >
                <div className="mb-3 flex items-start justify-between">
                  <h3 className="text-lg font-semibold text-foreground transition-colors group-hover:text-primary">
                    {friend.name}
                  </h3>
                  <ExternalLink className="ml-2 h-5 w-5 shrink-0 text-muted-foreground transition-colors group-hover:text-primary" />
                </div>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {friend.description}
                </p>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
