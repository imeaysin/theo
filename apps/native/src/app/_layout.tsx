import "../global.css"

import { useEffect, useState } from "react"
import { ActivityIndicator, View } from "react-native"
import { Slot } from "expo-router"
import { secureStore } from "@/lib/auth"

export default function Layout() {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    void secureStore.hydrate().finally(() => {
      setReady(true)
    })
  }, [])

  if (!ready) {
    return (
      <View className="flex-1 items-center justify-center bg-white dark:bg-black">
        <ActivityIndicator colorClassName="accent-blue-500" />
      </View>
    )
  }

  return <Slot />
}
