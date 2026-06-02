# @workspace/hero-ui

HeroUI v3 React components + Better Auth UI wrapper for the monorepo.

## What's Included

- **HeroUI v3**: All HeroUI React components and hooks
- **Better Auth UI**: Pre-built authentication components for HeroUI
- **Utilities**: `cn` function for conditional Tailwind classes
- **Hooks**: `useDisclosure` for modal/dropdown state management

## Installation

This package is part of the workspace:

```json
{
  "dependencies": {
    "@workspace/hero-ui": "workspace:*"
  }
}
```

## Usage

### HeroUI Components

```tsx
import { Button, Card } from "@workspace/hero-ui";

export default function MyComponent() {
  return (
    <Card>
      <Card.Header>
        <Card.Title>Hello World</Card.Title>
      </Card.Header>
      <Card.Content>
        <Button variant="primary">Click me</Button>
      </Card.Content>
    </Card>
  );
}
```

### Better Auth UI Components

```tsx
import { AuthProvider, SignIn } from "@workspace/hero-ui";

export default function AuthPage() {
  return (
    <AuthProvider>
      <SignIn />
    </AuthProvider>
  );
}
```

### Better Auth UI Hooks

```tsx
import { useSession, useSignOut } from "@workspace/hero-ui";

export default function UserProfile() {
  const { data: session } = useSession();
  const signOut = useSignOut();

  return (
    <div>
      <p>Welcome, {session?.user.name}</p>
      <button onClick={() => signOut.mutate()}>Sign Out</button>
    </div>
  );
}
```

## Import Styles

```css
@import "tailwindcss";
@import "@workspace/hero-ui/styles";
```

## Documentation

### HeroUI v3

- [Getting Started](https://heroui.com/docs/react/getting-started)
- [Components](https://heroui.com/docs/react/components)
- [Theming](https://heroui.com/docs/react/getting-started/theming)

### Better Auth UI

See `better-auth-ui.md` for comprehensive documentation

## Key Features

- No HeroUI provider needed (v3)
- Compound component pattern
- Use `onPress` over `onClick`
- Semantic variants (primary, secondary, tertiary, danger)
- Built-in dark mode with `useTheme`
- Complete auth UI components
- TanStack Query-based auth hooks
