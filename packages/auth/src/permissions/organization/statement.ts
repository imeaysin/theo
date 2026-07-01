import { defaultStatements as orgDefaultStatements } from "better-auth/plugins/organization/access"
import { businessStatement } from "../business/statement"

export const statement = {
  ...orgDefaultStatements,
  ...businessStatement,
} as const

export type OrganizationStatement = typeof statement
