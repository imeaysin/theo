# Marketing landing template

Frontend-only Next.js 16 marketing / landing site for this monorepo template.

## Customize first

- Brand, URLs, emails: `@workspace/config/public` (`productConfig`)
- Home content & Pro pricing: `content/home.ts` + `lib/pricing.ts`
- Testimonials: `content/testimonials.ts`

Keep copy generic — this is a landing template, not Cap/Loom product marketing.
Swap names, claims, and social proof for your brand before shipping.

Visual direction: clean, premium, simple — brand-first hero, soft atmosphere,
`rounded-xl` controls, semantic tokens only. Avoid Cap-style mode pills,
blue Pro Rive buttons, and pill-floating nav clones.

## Kept routes

`/`, `/features`, `/download`, `/pricing`, `/blog`, `/about`, `/support`, `/faq`, `/testimonials`, `/privacy`, `/terms`, `/migrate`

## Rules

- Preserve landing sections, responsive behavior, and content hierarchy — swap
  copy/assets via the config files above.
- Do not add API routes, authentication, database code, or product backends.
- Build with `@workspace/ui` semantic tokens only (no raw colors).
- Apply `font-sans` on the document body (do not edit `packages/ui` globals).
- This template does not ship docs, SEO landing farms, browser extensions, or
  video tools — keep those out unless you deliberately add them back.
