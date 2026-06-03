# Docs

- [Introduction](/docs/index.md): Beautiful, ready-to-use authentication components for Better Auth
- shadcn/ui: shadcn/ui components
  - [Quick Start](/docs/shadcn.md): Getting Started with Better Auth UI for shadcn/ui
  - Integrations
    - [TanStack Start](/docs/shadcn/integrations/tanstack-start.md): Integrate Better Auth UI with TanStack Start
    - [Next.js](/docs/shadcn/integrations/nextjs.md): Integrate Better Auth UI with Next.js
  - Concepts
    - [Additional Fields](/docs/shadcn/concepts/additional-fields.md): Render custom user fields on the sign-up form and user profile.
  - Plugins
    - [API Key](/docs/shadcn/plugins/api-key.md): Add programmatic API key management with create, copy, and revoke flows to your authentication settings.
    - [Captcha](/docs/shadcn/plugins/captcha.md): Add bot protection to sign-up, sign-in, and password reset using a provider-agnostic captcha widget.
    - [Delete User](/docs/shadcn/plugins/delete-user.md): Add account deletion with confirmation dialog to your authentication flow.
    - [Magic Link](/docs/shadcn/plugins/magic-link.md): Add passwordless email sign-in to your authentication flow.
    - [Multi Session](/docs/shadcn/plugins/multi-session.md): Enable multiple concurrent sessions with account switching. Allow users to sign in to multiple accounts simultaneously and switch between them seamlessly.
    - [Organization](/docs/shadcn/plugins/organization.md): Add multi-tenant organization management with members, invitations, and roles to your authentication UI.
    - [Passkey](/docs/shadcn/plugins/passkey.md): Add passwordless passkey sign-in and device management to your authentication flow.
    - [Theme](/docs/shadcn/plugins/theme.md): Add theme selection with system, light, and dark modes to your authentication flow.
    - [Username](/docs/shadcn/plugins/username.md): Add username-based sign-in and real-time availability checking to your authentication flow.
  - Components
    - **Provider**
    - [<AuthProvider>](/docs/shadcn/components/auth-provider.md): Provides AuthConfig to descendant components.

    - **User**
    - [<UserAvatar />](/docs/shadcn/components/user/user-avatar.md): Renders the current user's avatar using session data. Shows a skeleton while loading and falls back to initials when no image is available.
    - [<UserButton />](/docs/shadcn/components/user/user-button.md): Renders a user button with dropdown menu showing user info and sign out option.
    - [<UserView />](/docs/shadcn/components/user/user-view.md): Renders a user view that shows the user's avatar alongside their name and email.

    - **Auth**
    - [<Auth />](/docs/shadcn/components/auth/auth.md): A dynamic authentication component that renders the appropriate auth view based on the current path or explicit view prop.
    - [<SignIn />](/docs/shadcn/components/auth/sign-in.md): A complete sign-in form component with email/password, magic link, and social provider support.
    - [<SignUp />](/docs/shadcn/components/auth/sign-up.md): A complete sign-up form component with name, email, password fields, optional magic link, and social provider support.
    - [<SignOut />](/docs/shadcn/components/auth/sign-out.md): A sign-out component that automatically signs the user out when mounted and displays a loading indicator.
    - [<ForgotPassword />](/docs/shadcn/components/auth/forgot-password.md): A forgot password form component that allows users to request a password reset link via email.
    - [<ResetPassword />](/docs/shadcn/components/auth/reset-password.md): A reset password form component that allows users to set a new password using a reset token from their email.

    - **Settings**
    - [<Settings />](/docs/shadcn/components/settings/settings.md): A comprehensive settings component with tabbed navigation for account and security views.
    - [<AccountSettings />](/docs/shadcn/components/settings/account/account-settings.md): A container component that wraps the UserProfile component for account settings management.
    - [<UserProfile />](/docs/shadcn/components/settings/account/user-profile.md): A form component for users to update their profile information, including name and avatar display.
    - [<ChangeEmail />](/docs/shadcn/components/settings/account/change-email.md): A form component for users to change their email address with verification.
    - [<SecuritySettings />](/docs/shadcn/components/settings/security/security-settings.md): A container component that wraps security-related settings like password management.
    - [<ChangePassword />](/docs/shadcn/components/settings/security/change-password.md): A form component for users to change their password with current password verification.
    - [<LinkedAccounts />](/docs/shadcn/components/settings/security/linked-accounts.md): Display and manage linked social accounts with the ability to link and unlink providers.
    - [<ActiveSessions />](/docs/shadcn/components/settings/security/active-sessions.md): List every active sign-in session with device hints and revoke or sign out controls.

    - **Email**
    - [<EmailVerificationEmail />](/docs/shadcn/components/email/email-verification-email.md): Email template component that sends email verification links to users.
    - [<MagicLinkEmail />](/docs/shadcn/components/email/magic-link-email.md): Email template component that sends magic link authentication emails for passwordless sign-in.
    - [<ResetPasswordEmail />](/docs/shadcn/components/email/reset-password-email.md): Email template component that sends password reset links to users.
    - [<PasswordChangedEmail />](/docs/shadcn/components/email/password-changed-email.md): Email template component that notifies users when their password has been changed.
    - [<EmailChangedEmail />](/docs/shadcn/components/email/email-changed-email.md): Email template component that notifies users when their email address has been changed.
    - [<OtpEmail />](/docs/shadcn/components/email/otp-email.md): Email template component that sends one-time password (OTP) verification codes to users.
    - [<NewDeviceEmail />](/docs/shadcn/components/email/new-device-email.md): Email template component that notifies users when a new device signs in to their account.
    - [<OrganizationInvitationEmail />](/docs/shadcn/components/email/organization-invitation-email.md): Email template component that invites a user to join an organization.

- HeroUI: HeroUI components
  - [Quick Start](/docs/heroui.md): Getting Started with Better Auth UI for HeroUI
  - Integrations
    - [TanStack Start](/docs/heroui/integrations/tanstack-start.md): Integrate Better Auth UI with TanStack Start
    - [Next.js](/docs/heroui/integrations/nextjs.md): Integrate Better Auth UI with Next.js
  - Concepts
    - [Additional Fields](/docs/heroui/concepts/additional-fields.md): Render custom user fields on the sign-up form and user profile.
  - Plugins
    - [API Key](/docs/heroui/plugins/api-key.md): Add programmatic API key management with create, copy, and revoke flows to your authentication settings.
    - [Captcha](/docs/heroui/plugins/captcha.md): Add bot protection to sign-up, sign-in, and password reset using a provider-agnostic captcha widget.
    - [Delete User](/docs/heroui/plugins/delete-user.md): Add account deletion with confirmation dialog to your authentication flow.
    - [Magic Link](/docs/heroui/plugins/magic-link.md): Add passwordless email sign-in to your authentication flow.
    - [Multi Session](/docs/heroui/plugins/multi-session.md): Enable multiple concurrent sessions with account switching. Allow users to sign in to multiple accounts simultaneously and switch between them seamlessly.
    - [Organization](/docs/heroui/plugins/organization.md): Add multi-tenant organization management with members, invitations, and roles to your authentication UI.
    - [Passkey](/docs/heroui/plugins/passkey.md): Add passwordless passkey sign-in and device management to your authentication flow.
    - [Theme](/docs/heroui/plugins/theme.md): Add theme selection with system, light, and dark modes to your authentication flow.
    - [Username](/docs/heroui/plugins/username.md): Add username-based sign-in and real-time availability checking to your authentication flow.
  - Components
    - **Provider**
    - [<AuthProvider>](/docs/heroui/components/auth-provider.md): Provides AuthConfig to descendant components.

    - **User**
    - [<UserAvatar />](/docs/heroui/components/user/user-avatar.md): Renders the current user's avatar using session data. Shows a skeleton while loading and falls back to initials when no image is available.
    - [<UserButton />](/docs/heroui/components/user/user-button.md): Renders a user button with dropdown menu showing user info and sign out option.
    - [<UserView />](/docs/heroui/components/user/user-view.md): Renders a user view that shows the user's avatar alongside their name and email.

    - **Auth**
    - [<Auth />](/docs/heroui/components/auth/auth.md): A dynamic authentication component that renders the appropriate auth view based on the current path or explicit view prop.
    - [<SignIn />](/docs/heroui/components/auth/sign-in.md): A complete sign-in form component with email/password, magic link, and social provider support.
    - [<SignUp />](/docs/heroui/components/auth/sign-up.md): A complete sign-up form component with name, email, password fields, optional magic link, and social provider support.
    - [<SignOut />](/docs/heroui/components/auth/sign-out.md): A sign-out component that automatically signs the user out when mounted and displays a loading indicator.
    - [<ForgotPassword />](/docs/heroui/components/auth/forgot-password.md): A forgot password form component that allows users to request a password reset link via email.
    - [<ResetPassword />](/docs/heroui/components/auth/reset-password.md): A reset password form component that allows users to set a new password using a reset token from their email.

    - **Settings**
    - [<Settings />](/docs/heroui/components/settings/settings.md): A comprehensive settings component with tabbed navigation for account and security views.
    - [<AccountSettings />](/docs/heroui/components/settings/account/account-settings.md): A container component that wraps the UserProfile component for account settings management.
    - [<UserProfile />](/docs/heroui/components/settings/account/user-profile.md): A form component for users to update their profile information, including name and avatar display.
    - [<ChangeEmail />](/docs/heroui/components/settings/account/change-email.md): A form component for users to change their email address with verification.
    - [<SecuritySettings />](/docs/heroui/components/settings/security/security-settings.md): A container component that wraps security-related settings like password management.
    - [<ChangePassword />](/docs/heroui/components/settings/security/change-password.md): A form component for users to change their password with current password verification.
    - [<LinkedAccounts />](/docs/heroui/components/settings/security/linked-accounts.md): Display and manage linked social accounts with the ability to link and unlink providers.
    - [<ActiveSessions />](/docs/heroui/components/settings/security/active-sessions.md): List every active sign-in session with device hints and revoke or sign out controls.

    - **Email**
    - [<EmailVerificationEmail />](/docs/heroui/components/email/email-verification-email.md): Email template component that sends email verification links to users.
    - [<MagicLinkEmail />](/docs/heroui/components/email/magic-link-email.md): Email template component that sends magic link authentication emails for passwordless sign-in.
    - [<ResetPasswordEmail />](/docs/heroui/components/email/reset-password-email.md): Email template component that sends password reset links to users.
    - [<PasswordChangedEmail />](/docs/heroui/components/email/password-changed-email.md): Email template component that notifies users when their password has been changed.
    - [<EmailChangedEmail />](/docs/heroui/components/email/email-changed-email.md): Email template component that notifies users when their email address has been changed.
    - [<OtpEmail />](/docs/heroui/components/email/otp-email.md): Email template component that sends one-time password (OTP) verification codes to users.
    - [<NewDeviceEmail />](/docs/heroui/components/email/new-device-email.md): Email template component that notifies users when a new device signs in to their account.
    - [<OrganizationInvitationEmail />](/docs/heroui/components/email/organization-invitation-email.md): Email template component that invites a user to join an organization.

- React: Hooks & components
  - [Overview](/docs/react.md): Shared React hooks, query primitives, and components used by both shadcn/ui and HeroUI.
  - Queries
    - [Queries](/docs/react/queries.md): TanStack Query primitives for every Better Auth read endpoint.

    - **Auth**
    - [useSession](/docs/react/queries/session.md): Read, prefetch, and invalidate the current authenticated session.
    - [useUser](/docs/react/queries/user.md): Retrieve the current authenticated user.
    - [useAuthenticate](/docs/react/queries/authenticate.md): Session query that redirects unauthenticated users to sign-in.

    - **Settings**
    - [useListAccounts](/docs/react/queries/list-accounts.md): Retrieve the current user's linked social accounts.
    - [useAccountInfo](/docs/react/queries/account-info.md): Retrieve provider-specific info for a linked account.
    - [useListSessions](/docs/react/queries/list-sessions.md): Retrieve the active sessions (devices) for the current user.
    - [useListDeviceSessions](/docs/react/queries/list-device-sessions.md): Retrieve the device sessions for the multi-session account switcher.
    - [useListPasskeys](/docs/react/queries/list-passkeys.md): Retrieve the passkeys registered for the current user.

  - Mutations
    - [Mutations](/docs/react/mutations.md): TanStack Query primitives for every Better Auth write endpoint.

    - **Auth**
    - [useSignInEmail](/docs/react/mutations/sign-in-email.md): Email/password sign-in mutation.
    - [useSignInUsername](/docs/react/mutations/sign-in-username.md): Username/password sign-in mutation.
    - [useSignInMagicLink](/docs/react/mutations/sign-in-magic-link.md): Send a magic-link sign-in email.
    - [useSignInPasskey](/docs/react/mutations/sign-in-passkey.md): Passkey (WebAuthn) sign-in mutation.
    - [useSignInSocial](/docs/react/mutations/sign-in-social.md): Start a social (OAuth) sign-in flow.
    - [useSignUpEmail](/docs/react/mutations/sign-up-email.md): Email/password sign-up mutation.
    - [useSignOut](/docs/react/mutations/sign-out.md): Sign out the current session and clear the auth cache.
    - [useRequestPasswordReset](/docs/react/mutations/request-password-reset.md): Send a password reset email for the forgot-password flow.
    - [useResetPassword](/docs/react/mutations/reset-password.md): Complete the password reset flow with a token.
    - [useSendVerificationEmail](/docs/react/mutations/send-verification-email.md): Resend the verification email to an address.
    - [useIsUsernameAvailable](/docs/react/mutations/is-username-available.md): Check whether a username is free to claim.

    - **Settings**
    - [useUpdateUser](/docs/react/mutations/update-user.md): Update the authenticated user's profile fields.
    - [useChangeEmail](/docs/react/mutations/change-email.md): Change the authenticated user's email address.
    - [useChangePassword](/docs/react/mutations/change-password.md): Change the authenticated user's password.
    - [useDeleteUser](/docs/react/mutations/delete-user.md): Delete the authenticated user's account.
    - [useLinkSocial](/docs/react/mutations/link-social.md): Link a social provider to the current user.
    - [useUnlinkAccount](/docs/react/mutations/unlink-account.md): Unlink a social provider from the current user.
    - [useAddPasskey](/docs/react/mutations/add-passkey.md): Register a new passkey for the current user.
    - [useDeletePasskey](/docs/react/mutations/delete-passkey.md): Remove a passkey from the current user.
    - [useRevokeSession](/docs/react/mutations/revoke-session.md): Revoke an active session (sign out another device).
    - [useRevokeMultiSession](/docs/react/mutations/revoke-multi-session.md): Revoke a device session in multi-session mode.
    - [useSetActiveSession](/docs/react/mutations/set-active-session.md): Switch the active device session in multi-session mode.

  - [SSR](/docs/react/ssr.md): Customize the TanStack Query client and prefetch auth data on the server with TanStack Start.
