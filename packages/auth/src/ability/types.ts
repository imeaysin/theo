import type { ExtractSubjectType, MongoAbility } from "@casl/ability"

export type AppActions =
  | "create"
  | "read"
  | "update"
  | "delete"
  | "manage"
  | "publish"
  | "archive"
  | "approve"
  | "export"

export interface ProjectSubject {
  readonly __typename?: "Project"
  readonly ownerId?: string
}

export interface ReportSubject {
  readonly __typename?: "Report"
  readonly ownerId?: string
}

export interface MemberSubject {
  readonly __typename?: "Member"
  readonly userId?: string
}

export interface InvoiceSubject {
  readonly __typename?: "Invoice"
  readonly ownerId?: string
}

export interface SettingsSubject {
  readonly __typename?: "Settings"
}

export type AppSubjectName =
  "Project" | "Report" | "Member" | "Invoice" | "Settings" | "all"

export type AppSubjects =
  | AppSubjectName
  | ProjectSubject
  | ReportSubject
  | MemberSubject
  | InvoiceSubject
  | SettingsSubject

export type AppAbility = MongoAbility<[AppActions, AppSubjects]>

export type AppSubjectType = ExtractSubjectType<AppSubjects>

export interface AbilityUser {
  readonly id: string
  readonly role: string
  readonly organizationId?: string
  readonly organizationRole?: string
}
