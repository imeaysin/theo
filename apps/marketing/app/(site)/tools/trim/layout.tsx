import { createBreadcrumbSchema } from "@/utils/web-schema"

const breadcrumbSchema = createBreadcrumbSchema([
  { name: "Home", url: "https://theo.example" },
  { name: "Tools", url: "https://theo.example/tools" },
  { name: "Trim Video Online", url: "https://theo.example/tools/trim" },
])

export default function TrimLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema),
        }}
      />
      {children}
    </>
  )
}
