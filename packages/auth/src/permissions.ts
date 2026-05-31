import { createAccessControl } from "better-auth/plugins/access";
import { defaultStatements, adminAc } from "better-auth/plugins/admin/access";

export const statement = {
  ...defaultStatements,
  profile: ["read", "update"],
} as const;

export const ac = createAccessControl(statement);

export const user = ac.newRole({
  profile: ["read", "update"],
});

export const admin = ac.newRole({
  profile: ["read", "update"],
  ...adminAc.statements,
});
