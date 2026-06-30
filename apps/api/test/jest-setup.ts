jest.mock("jose", () => ({
  jwtVerify: jest.fn(),
  createRemoteJWKSet: jest.fn(() => jest.fn()),
}))

jest.mock("@workspace/auth/nestjs", () => ({
  Public: () => () => undefined,
  CurrentUser: () => () => undefined,
  RequirePermission: () => () => undefined,
  JwksGuard: class JwksGuard {},
  RbacGuard: class RbacGuard {},
  OrgRbacGuard: class OrgRbacGuard {},
  RolesGuard: class RolesGuard {},
}))
