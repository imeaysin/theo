jest.mock("jose", () => ({
  jwtVerify: jest.fn(),
  createRemoteJWKSet: jest.fn(() => jest.fn()),
}))

jest.mock("@workspace/auth/nestjs", () => {
  class JwksGuard {}
  class RbacGuard {}
  class OrgRbacGuard {}
  class AuthGuardsModule {}

  return {
    Public: () => () => undefined,
    CurrentUser: () => () => undefined,
    CurrentOrganization: () => () => undefined,
    RequirePermission: () => () => undefined,
    RequireOrgPermission: () => () => undefined,
    JwksGuard,
    RbacGuard,
    OrgRbacGuard,
    AuthGuardsModule: {
      register: () => ({
        module: AuthGuardsModule,
        providers: [JwksGuard, RbacGuard, OrgRbacGuard],
        exports: [JwksGuard, RbacGuard, OrgRbacGuard],
      }),
    },
  }
})
