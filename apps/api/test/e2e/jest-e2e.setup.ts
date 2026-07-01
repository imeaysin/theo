import "../support/mocks/register"

jest.mock("@workspace/auth", () => ({
  getAuth: jest.fn(() => ({})),
}))

jest.mock("@thallesp/nestjs-better-auth", () => ({
  AuthModule: {
    forRootAsync: () => ({
      module: class AuthModuleE2eStub {},
    }),
  },
}))
