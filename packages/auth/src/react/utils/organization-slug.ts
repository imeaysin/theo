import type { AuthClient } from "../../lib/auth-client"
import { authClient } from "../../lib/auth-client"
import { isOrganizationSlugTakenError } from "../../lib/organization-slug-availability"
import { unwrapClientResult } from "./client-call"

export async function checkOrganizationSlugAvailable(
  slug: string,
  client: AuthClient = authClient
) {
  try {
    const result = await unwrapClientResult(
      client.organization.checkSlug({ slug })
    )
    return result?.status === true
  } catch (error) {
    if (isOrganizationSlugTakenError(error)) {
      return false
    }
    throw error
  }
}
