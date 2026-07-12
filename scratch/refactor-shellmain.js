const fs = require("fs")
const path = require("path")

const filesToUpdate = [
  "apps/web/src/features/organization/pages/organization-roles-page.tsx",
  "apps/web/src/features/organization/pages/organization-people-page.tsx",
  "apps/web/src/features/organization/pages/organization-settings-page.tsx",
  "apps/web/src/features/notifications/pages/notifications-page.tsx",
  "apps/web/src/features/dashboard/pages/dashboard-page.tsx",
  "apps/web/src/features/admin/pages/admin-users-page.tsx",
  "apps/web/src/features/account/pages/security-settings-page.tsx",
  "apps/web/src/features/account/pages/account-settings-page.tsx",
  "apps/web/src/features/ai/pages/chat-page.tsx",
  "apps/web/src/features/uploads/pages/uploads-page.tsx",
  "apps/web/src/features/notes/pages/notes-page.tsx",
]

for (const file of filesToUpdate) {
  if (!fs.existsSync(file)) continue

  let content = fs.readFileSync(file, "utf8")

  // Remove the import
  content = content.replace(
    /import\s+\{\s*ShellMain\s*\}\s*from\s+["']@workspace\/ui-shadcn\/components\/shell["']\n?/,
    ""
  )

  // We'll use a very simple regex replace if it matches the standard pattern
  // Or we can just use string replacements because there's only 1 ShellMain per file.

  // Find <ShellMain ...> and </ShellMain>
  // Since ShellMain has header={{ heading: "...", subtitle: "...", actions: ... }}, we can extract the header object text.

  const shellMainRegex =
    /<ShellMain\s+header=\{\{([\s\S]*?)\}\}\s*>([\s\S]*?)<\/ShellMain>/
  const match = content.match(shellMainRegex)

  if (match) {
    const headerProps = match[1]
    const children = match[2]

    // Extract heading
    const headingMatch = headerProps.match(
      /heading:\s*(.+?)(?:,|\n\s*subtitle|\n\s*actions|\n\s*cta|$)/m
    )
    const subtitleMatch = headerProps.match(
      /subtitle:\s*(.+?)(?:,|\n\s*actions|\n\s*cta|$)/m
    )
    const actionsMatch = headerProps.match(
      /actions:\s*([\s\S]+?)(?:,|\n\s*cta|$)/
    )
    const ctaMatch = headerProps.match(/cta:\s*([\s\S]+?)(?:,|\n\s*actions|$)/)

    let headingStr = headingMatch ? headingMatch[1].trim() : ""
    let subtitleStr = subtitleMatch ? subtitleMatch[1].trim() : ""
    let actionsStr = actionsMatch ? actionsMatch[1].trim() : ""
    let ctaStr = ctaMatch ? ctaMatch[1].trim() : ""

    if (headingStr.endsWith(",")) headingStr = headingStr.slice(0, -1)
    if (subtitleStr.endsWith(",")) subtitleStr = subtitleStr.slice(0, -1)
    if (actionsStr.endsWith(",")) actionsStr = actionsStr.slice(0, -1)
    if (ctaStr.endsWith(",")) ctaStr = ctaStr.slice(0, -1)

    // If headingStr is a string literal (e.g. "Overview"), we wrap it. If it's a JS expression (e.g. `Welcome ${name}`), we wrap in {}
    let headingJsx = headingStr
    if (headingStr.startsWith('"') || headingStr.startsWith("'")) {
      headingJsx = headingStr.slice(1, -1) // remove quotes
    } else {
      headingJsx = `{${headingStr}}`
    }

    let subtitleJsx = ""
    if (subtitleStr) {
      if (subtitleStr.startsWith('"') || subtitleStr.startsWith("'")) {
        subtitleJsx = `<p className="text-muted-foreground">${subtitleStr.slice(1, -1)}</p>`
      } else {
        subtitleJsx = `<p className="text-muted-foreground">{${subtitleStr}}</p>`
      }
    }

    let actionsJsx = ""
    if (actionsStr || ctaStr) {
      actionsJsx = `
      <div className="flex items-center space-x-2">
        ${actionsStr || ""}
        ${ctaStr || ""}
      </div>`
    }

    const newMarkup = `<div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold tracking-tight">${headingJsx}</h2>
          ${subtitleJsx}
        </div>${actionsJsx}
      </div>
      ${children.trim()}
    </div>`

    content = content.replace(match[0], newMarkup)
    fs.writeFileSync(file, content)
    console.log(`Updated ${file}`)
  } else {
    // Maybe no header prop
    const emptyMatch = content.match(/<ShellMain\s*>([\s\S]*?)<\/ShellMain>/)
    if (emptyMatch) {
      content = content.replace(
        emptyMatch[0],
        `<div>\n${emptyMatch[1].trim()}\n</div>`
      )
      fs.writeFileSync(file, content)
      console.log(`Updated (no header) ${file}`)
    } else {
      console.log(`Could not match ShellMain in ${file}`)
    }
  }
}
