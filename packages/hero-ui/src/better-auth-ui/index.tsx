import * as React from "react"
import { themePlugin } from "@better-auth-ui/heroui/plugins"
import { AuthProvider, type AuthProviderProps } from "@better-auth-ui/react"
import { useTheme } from "@heroui/react"

export interface BetterAuthProviderProps extends AuthProviderProps {}

export const BetterAuthProvider = ({
  children,
  plugins = [],
  ...props
}: BetterAuthProviderProps) => {
  return (
    <AuthProvider plugins={[themePlugin({ useTheme }), ...plugins]} {...props}>
      {children}
    </AuthProvider>
  )
}

export {
  // Queries
  useSession,
  useUser,
  useAuthenticate,
  useListAccounts,
  useAccountInfo,
  useListSessions,
  useListDeviceSessions,
  useListPasskeys,
  // Mutations
  useSignInEmail,
  useSignInUsername,
  useSignInMagicLink,
  useSignInPasskey,
  useSignInSocial,
  useSignUpEmail,
  useSignOut,
  useRequestPasswordReset,
  useResetPassword,
  useSendVerificationEmail,
  useIsUsernameAvailable,
  useUpdateUser,
  useChangeEmail,
  useChangePassword,
  useDeleteUser,
  useLinkSocial,
  useUnlinkAccount,
  useAddPasskey,
  useDeletePasskey,
  useRevokeSession,
  useRevokeMultiSession,
  useSetActiveSession,
} from "@better-auth-ui/react"

export {
  // User
  UserAvatar,
  UserButton,
  UserView,

  // Auth
  Auth,
  SignIn,
  SignUp,
  SignOut,
  ForgotPassword,
  ResetPassword,

  // Settings
  Settings,
  AccountSettings,
  UserProfile,
  ChangeEmail,
  SecuritySettings,
  ChangePassword,
  LinkedAccounts,
  ActiveSessions,
} from "@better-auth-ui/heroui"

export {
  EmailVerificationEmail,
  MagicLinkEmail,
  ResetPasswordEmail,
  PasswordChangedEmail,
  EmailChangedEmail,
  OtpEmail,
  NewDeviceEmail,
  OrganizationInvitationEmail,
} from "@better-auth-ui/heroui/email"
