import { Permissions, Actions } from "nest-casl"
import { Roles } from "../../access"
import type { AppSubjectName } from "../../ability/types"

export const projectPermissions: Permissions<Roles, AppSubjectName, Actions> = {
  everyone({ can }) {
    can(Actions.read, "Project")
  },
  member({ user, can }) {
    can(Actions.create, "Project")
    can(Actions.update, "Project", { ownerId: user.id })
  },
  admin({ can, cannot, extend }) {
    extend(Roles.member)
    can(Actions.manage, "Project")
    cannot(Actions.delete, "Project")
  },
  owner({ can }) {
    can(Actions.manage, "Project")
  },
}
