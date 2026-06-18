import { useState } from "react"
import {
  ActivityIndicator,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native"
import { StatusBar } from "expo-status-bar"
import { useAuthSession } from "@/features/auth/hooks/use-auth-session"
import { authClient } from "@/lib/auth"

export default function App() {
  const { session, isPending, isAuthenticated } = useAuthSession()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSignIn() {
    setSubmitting(true)
    setError(null)

    const result = await authClient.signIn.email({ email, password })

    if (result.error) {
      setError(result.error.message ?? "Sign in failed")
    }

    setSubmitting(false)
  }

  async function handleSignOut() {
    await authClient.signOut()
  }

  if (isPending) {
    return (
      <View className="flex-1 items-center justify-center bg-white dark:bg-black">
        <ActivityIndicator colorClassName="accent-blue-500" />
        <StatusBar style="auto" />
      </View>
    )
  }

  return (
    <View className="flex-1 justify-center bg-white px-6 dark:bg-black">
      <Text className="mb-2 text-3xl font-bold text-gray-900 dark:text-white">
        Theo
      </Text>
      <Text className="mb-8 text-base text-gray-600 dark:text-gray-300">
        Bearer + JWT auth via @workspace/auth/expo-client
      </Text>

      {isAuthenticated && session?.user ? (
        <View className="gap-4">
          <Text className="text-lg text-gray-800 dark:text-white">
            Signed in as {session.user.email}
          </Text>
          <Pressable
            className="items-center rounded-lg bg-gray-900 px-4 py-3 dark:bg-white"
            onPress={() => {
              void handleSignOut()
            }}
          >
            <Text className="font-semibold text-white dark:text-black">
              Sign out
            </Text>
          </Pressable>
        </View>
      ) : (
        <View className="gap-3">
          <TextInput
            autoCapitalize="none"
            autoComplete="email"
            className="rounded-lg border border-gray-300 px-4 py-3 text-base text-gray-900 dark:border-gray-600 dark:text-white"
            keyboardType="email-address"
            placeholder="Email"
            placeholderTextColorClassName="accent-gray-400"
            value={email}
            onChangeText={setEmail}
          />
          <TextInput
            autoCapitalize="none"
            autoComplete="password"
            className="rounded-lg border border-gray-300 px-4 py-3 text-base text-gray-900 dark:border-gray-600 dark:text-white"
            placeholder="Password"
            placeholderTextColorClassName="accent-gray-400"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
          {error ? (
            <Text className="text-sm text-red-600 dark:text-red-400">
              {error}
            </Text>
          ) : null}
          <Pressable
            className="items-center rounded-lg bg-blue-600 px-4 py-3 disabled:opacity-60"
            disabled={submitting || !email || !password}
            onPress={() => {
              void handleSignIn()
            }}
          >
            {submitting ? (
              <ActivityIndicator colorClassName="accent-white" />
            ) : (
              <Text className="font-semibold text-white">Sign in</Text>
            )}
          </Pressable>
        </View>
      )}

      <StatusBar style="auto" />
    </View>
  )
}
