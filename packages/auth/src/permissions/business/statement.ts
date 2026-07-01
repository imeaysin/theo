export const businessStatement = {
  project: [
    "create",
    "read",
    "update",
    "delete",
    "publish",
    "archive",
  ] as const,
  content: ["create", "read", "update", "delete", "publish"] as const,
  billing: ["read", "manage"] as const,
  analytics: ["read", "export"] as const,
  settings: ["read", "update"] as const,
} as const
