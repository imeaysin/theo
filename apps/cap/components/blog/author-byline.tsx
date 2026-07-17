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
    <div className="mt-16 border-t border-border pt-8">
      <div className="flex flex-wrap gap-1 sm:gap-6">
        {authorList.map((author, _index) => (
          <div key={author.name} className="flex items-center gap-3">
            <Image
              src={author.image}
              alt={author.name}
              width={48}
              height={48}
              className="h-10 w-10 rounded-full object-cover"
            />
            <div>
              <div className="font-medium text-muted-foreground">
                {author.name}
              </div>
              <Link
                href={`https://x.com/${author.handle}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-primary transition-colors hover:text-primary"
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
