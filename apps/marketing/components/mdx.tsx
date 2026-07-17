import Image from "next/image"
import Link from "next/link"
import { MDXRemote } from "next-mdx-remote/rsc"
import React, { type ReactNode } from "react"
import type { Options as RehypePrettyCodeOptions } from "rehype-pretty-code"
import rehypePrettyCode from "rehype-pretty-code"
import remarkGfm from "remark-gfm"

interface TableData {
  headers: string[]
  rows: string[][]
}

function Table({ data }: { data: TableData }) {
  const headers = data.headers.map((header, index) => (
    <th key={index}>{header}</th>
  ))
  const rows = data.rows.map((row, index) => (
    <tr key={index}>
      {row.map((cell, cellIndex) => (
        <td key={cellIndex}>{cell}</td>
      ))}
    </tr>
  ))

  return (
    <table>
      <thead>
        <tr>{headers}</tr>
      </thead>
      <tbody>{rows}</tbody>
    </table>
  )
}

interface CustomLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string
}

function CustomLink({ href, ...rest }: CustomLinkProps) {
  if (href.startsWith("/")) {
    return (
      <Link href={href} {...rest}>
        {rest.children}
      </Link>
    )
  }

  if (href.startsWith("#")) {
    return <a {...rest} />
  }

  return <a target="_blank" rel="noopener noreferrer" {...rest} />
}

type RoundedImageProps = React.ComponentProps<typeof Image>

function RoundedImage({ className, ...props }: RoundedImageProps) {
  return <Image {...props} className={`rounded-lg ${className ?? ""}`} />
}

interface CalloutProps {
  emoji: string
  children: ReactNode
}

function Callout(props: CalloutProps) {
  return (
    <div className="mb-8 flex items-center rounded border border-border bg-muted p-1 px-4 py-3 text-sm text-muted-foreground">
      <div className="mr-4 flex w-4 items-center">{props.emoji}</div>
      <div className="callout w-full">{props.children}</div>
    </div>
  )
}

interface WarningProps {
  title?: string
  children: ReactNode
}

function Warning(props: WarningProps) {
  return (
    <div className="not-prose mb-8 rounded-lg border-2 border-destructive bg-destructive px-4 py-3 text-sm dark:border-destructive dark:bg-destructive">
      <div className="mb-2 flex items-center gap-2 font-semibold text-destructive dark:text-destructive">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className="h-5 w-5"
        >
          <path
            fillRule="evenodd"
            d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z"
            clipRule="evenodd"
          />
        </svg>
        {props.title || "Warning"}
      </div>
      <div className="text-destructive dark:text-destructive [&_a]:underline [&_code]:rounded [&_code]:bg-destructive [&_code]:px-1 [&_code]:dark:bg-destructive [&_p]:m-0 [&_strong]:font-semibold [&_ul]:m-0 [&_ul]:mt-2">
        {props.children}
      </div>
    </div>
  )
}

interface RecordingEmbedProps {
  src: string
}

function RecordingEmbed({ src }: RecordingEmbedProps) {
  return (
    <iframe
      src={src}
      frameBorder="0"
      allowFullScreen
      style={{
        width: "100%",
        aspectRatio: "16 / 9",
        borderRadius: "15px",
        display: "block",
      }}
    />
  )
}

function slugify(str: string) {
  return str
    .toString()
    .toLowerCase()
    .trim() // Remove whitespace from both ends of a string
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/&/g, "-and-") // Replace & with 'and'
    .replace(/[^\w-]+/g, "") // Remove all non-word characters except for -
    .replace(/--+/g, "-") // Replace multiple - with single -
}

function createHeading(level: number) {
  function Heading({ children }: { children: string }) {
    const slug = slugify(children)
    return React.createElement(
      `h${level}`,
      { id: slug },
      [
        React.createElement("a", {
          href: `#${slug}`,
          key: `link-${slug}`,
          className: "anchor",
        }),
      ],
      children
    )
  }
  Heading.displayName = `Heading${level}`
  return Heading
}

const components = {
  h1: createHeading(1),
  h2: createHeading(2),
  h3: createHeading(3),
  h4: createHeading(4),
  h5: createHeading(5),
  h6: createHeading(6),
  Image: RoundedImage,
  a: CustomLink,
  Callout,
  Warning,
  RecordingEmbed,
  Table,
}

const rehypePrettyCodeOptions: RehypePrettyCodeOptions = {
  theme: "github-dark",
  keepBackground: true,
}

export function CustomMDX(props: React.ComponentProps<typeof MDXRemote>) {
  return (
    <MDXRemote
      {...props}
      options={{
        mdxOptions: {
          remarkPlugins: [remarkGfm],
          rehypePlugins: [[rehypePrettyCode, rehypePrettyCodeOptions]],
        },
      }}
      components={{ ...components, ...(props.components || {}) }}
    />
  )
}
