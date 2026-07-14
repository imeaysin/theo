export const platformGrants = {
  guest: {
    project: ["read"],
    content: ["read"],
  },
  user: {
    project: ["create", "read", "update"],
    content: ["create", "read", "update", "delete"],
    analytics: ["read"],
    settings: ["read", "update"],
  },
  manager: {
    project: ["create", "read", "update", "delete", "publish"],
    billing: ["read"],
    analytics: ["read", "export"],
  },
  owner: {
    project: ["create", "read", "update", "delete", "publish", "archive"],
    content: ["create", "read", "update", "delete", "publish"],
    billing: ["read", "manage"],
    analytics: ["read", "export"],
    settings: ["read", "update"],
  },
  support: {
    project: ["read"],
    content: ["read"],
    billing: ["read"],
    analytics: ["read"],
  },
} as const

export const organizationGrants = {
  owner: {
    project: ["create", "read", "update", "delete", "publish", "archive"],
    content: ["create", "read", "update", "delete", "publish"],
    billing: ["read", "manage"],
    analytics: ["read", "export"],
    settings: ["read", "update"],
  },
  admin: {
    project: ["create", "read", "update", "delete", "publish"],
    content: ["create", "read", "update", "delete", "publish"],
    billing: ["read"],
    analytics: ["read", "export"],
    settings: ["read", "update"],
  },
  member: {
    project: ["create", "read", "update"],
    content: ["create", "read", "update"],
    analytics: ["read"],
    settings: ["read"],
  },
  billing: {
    billing: ["read", "manage"],
    project: ["read"],
  },
} as const
