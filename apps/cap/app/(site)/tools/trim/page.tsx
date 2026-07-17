"use client"

import { trimVideoContent } from "@/components/tools/content"
import { ToolsPageTemplate } from "@/components/tools/tools-page-template"
import { TrimmingTool } from "@/components/tools/trimming-tool"

export default function TrimVideoPage() {
  return (
    <ToolsPageTemplate
      content={trimVideoContent}
      toolComponent={<TrimmingTool />}
    />
  )
}
