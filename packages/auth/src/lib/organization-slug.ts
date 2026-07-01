export function sanitizeOrganizationSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

export function buildOrganizationSlugBase(name: string) {
  return sanitizeOrganizationSlug(name) || "workspace"
}

export function buildOrganizationSlug(name: string, userId: string) {
  const base = buildOrganizationSlugBase(name)
  const suffix = sanitizeOrganizationSlug(userId.slice(0, 8)) || "user"
  return `${base}-${suffix}`
}

export function buildUniqueOrganizationSlugSuffix() {
  return Math.random().toString(36).slice(2, 6)
}

export function buildOrganizationSlugCandidates(
  name: string,
  userId: string,
  maxAttempts = 5
) {
  const base = buildOrganizationSlugBase(name)
  const userSuffix = sanitizeOrganizationSlug(userId.slice(0, 8)) || "user"
  const candidates = [buildOrganizationSlug(name, userId)]

  for (let attempt = 2; attempt <= maxAttempts; attempt += 1) {
    candidates.push(`${base}-${userSuffix}-${attempt}`)
  }

  for (let attempt = 0; attempt < 3; attempt += 1) {
    candidates.push(`${base}-${buildUniqueOrganizationSlugSuffix()}`)
  }

  return [...new Set(candidates)]
}

export async function resolveAvailableOrganizationSlug(
  name: string,
  userId: string,
  isSlugAvailable: (slug: string) => Promise<boolean>
) {
  for (const candidate of buildOrganizationSlugCandidates(name, userId)) {
    if (await isSlugAvailable(candidate)) {
      return candidate
    }
  }

  return `${buildOrganizationSlugBase(name)}-${userSuffix(userId)}-${buildUniqueOrganizationSlugSuffix()}`
}

function userSuffix(userId: string) {
  return sanitizeOrganizationSlug(userId.slice(0, 8)) || "user"
}
