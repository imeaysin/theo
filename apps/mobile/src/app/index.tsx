import { useEffect, useState } from "react"
import * as Device from "expo-device"
import { Platform, StyleSheet } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { mobileAuthClient } from "@/lib/auth-client"
import { parseMobileEnv } from "@workspace/config/client"

import { AnimatedIcon } from "@/components/animated-icon"
import { HintRow } from "@/components/hint-row"
import { ThemedText } from "@/components/themed-text"
import { ThemedView } from "@/components/themed-view"
import { WebBadge } from "@/components/web-badge"
import { BottomTabInset, MaxContentWidth, Spacing } from "@/constants/theme"

function getDevMenuHint() {
  if (Platform.OS === "web") {
    return <ThemedText type="small">use browser devtools</ThemedText>
  }
  if (Device.isDevice) {
    return (
      <ThemedText type="small">
        shake device or press <ThemedText type="code">m</ThemedText> in terminal
      </ThemedText>
    )
  }
  const shortcut = Platform.OS === "android" ? "cmd+m (or ctrl+m)" : "cmd+d"
  return (
    <ThemedText type="small">
      press <ThemedText type="code">{shortcut}</ThemedText>
    </ThemedText>
  )
}

export default function HomeScreen() {
  const [signedInEmail, setSignedInEmail] = useState<string | null>(null)

  useEffect(() => {
    mobileAuthClient.getSession().then(({ data }) => {
      setSignedInEmail(data?.user?.email ?? null)
    })
  }, [])

  const env = parseMobileEnv(process.env)
  const appName = env.appName
  const apiUrl = env.apiUrl

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ThemedView style={styles.heroSection}>
          <AnimatedIcon />
          <ThemedText type="title" style={styles.title}>
            Welcome to {appName}
          </ThemedText>
        </ThemedView>

        <ThemedText type="code" style={styles.code}>
          mobile starter
        </ThemedText>

        <ThemedView type="backgroundElement" style={styles.stepContainer}>
          <HintRow
            title="API"
            hint={<ThemedText type="code">{apiUrl}</ThemedText>}
          />
          <HintRow
            title="Session"
            hint={
              <ThemedText type="small">
                {signedInEmail
                  ? `Signed in as ${signedInEmail}`
                  : "Not signed in"}
              </ThemedText>
            }
          />
          <HintRow
            title="Try editing"
            hint={<ThemedText type="code">src/app/index.tsx</ThemedText>}
          />
          <HintRow title="Dev tools" hint={getDevMenuHint()} />
        </ThemedView>

        {Platform.OS === "web" && <WebBadge />}
      </SafeAreaView>
    </ThemedView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    flexDirection: "row",
  },
  safeArea: {
    flex: 1,
    paddingHorizontal: Spacing.four,
    alignItems: "center",
    gap: Spacing.three,
    paddingBottom: BottomTabInset + Spacing.three,
    maxWidth: MaxContentWidth,
  },
  heroSection: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    paddingHorizontal: Spacing.four,
    gap: Spacing.four,
  },
  title: {
    textAlign: "center",
  },
  code: {
    textTransform: "uppercase",
  },
  stepContainer: {
    gap: Spacing.three,
    alignSelf: "stretch",
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.four,
    borderRadius: Spacing.four,
  },
})
