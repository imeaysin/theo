export function sanitizeOrganizationSlug(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-")
}
