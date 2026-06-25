jest.mock("jose", () => ({
  jwtVerify: jest.fn(),
  createRemoteJWKSet: jest.fn(() => jest.fn()),
}))

jest.mock("@workspace/auth/nestjs", () => ({
  Public: () => () => undefined,
  JwksGuard: class JwksGuard {},
  RbacGuard: class RbacGuard {},
  CurrentUser: () => () => undefined,
  RequirePermission: () => () => undefined,
}))
