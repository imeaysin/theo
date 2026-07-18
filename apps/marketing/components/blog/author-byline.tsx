import Image from "next/image"
import Link from "next/link"
import { parseAuthors } from "@/utils/authors"

interface AuthorBylineProps {
  authors: string
}

export function AuthorByline({ authors }: AuthorBylineProps) {
  const authorList = parseAuthors(authors)

  if (authorList.length === 0) {
    return null
  }

  return (
    <div className="mt-12 border-t border-border pt-8">
      <p className="mb-4 text-sm font-medium text-foreground">Written by</p>
      <div className="flex flex-wrap gap-6">
        {authorList.map((author) => (
          <div key={author.name} className="flex items-center gap-3">
            <Image
              src={author.image}
              alt={author.name}
              width={40}
              height={40}
              className="size-10 rounded-full object-cover"
            />
            <div>
              <div className="text-sm font-medium text-foreground">
                {author.name}
              </div>
              <Link
                href={`https://x.com/${author.handle}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                @{author.handle}
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
