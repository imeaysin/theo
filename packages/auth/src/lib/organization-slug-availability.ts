export const ORGANIZATION_SLUG_TAKEN_ERROR_CODES = [
  "ORGANIZATION_SLUG_ALREADY_TAKEN",
  "ORGANIZATION_ALREADY_EXISTS",
] as const

export type OrganizationSlugAvailability = {
  available: boolean
}

export function isOrganizationSlugTakenError(error: unknown) {
  if (!error || typeof error !== "object") return false

  const code = "code" in error ? error.code : undefined
  return (
    typeof code === "string" &&
    ORGANIZATION_SLUG_TAKEN_ERROR_CODES.includes(
      code as (typeof ORGANIZATION_SLUG_TAKEN_ERROR_CODES)[number]
    )
  )
}

export function isOrganizationSlugAvailable(
  result: OrganizationSlugAvailability | null | undefined
) {
  return result?.available === true
}
