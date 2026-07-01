export type AccessStatement = Record<string, readonly string[]>

export type PermissionMapFor<S extends AccessStatement> = {
  [Resource in keyof S]?: S[Resource][number][]
}

export type ResourceName<S extends AccessStatement> = keyof S & string

export type ActionName<
  S extends AccessStatement,
  R extends ResourceName<S>,
> = S[R][number]

export interface RequiredPermission<
  S extends AccessStatement,
  R extends ResourceName<S> = ResourceName<S>,
> {
  resource: R
  action: ActionName<S, R>
}
