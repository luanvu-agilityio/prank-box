import { Inter_400Regular, Inter_500Medium, Inter_700Bold } from '@expo-google-fonts/inter'
import { SpaceMono_700Bold } from '@expo-google-fonts/space-mono'
import { useFonts } from 'expo-font'
import { Stack } from 'expo-router'
import * as SplashScreen from 'expo-splash-screen'
import { useEffect } from 'react'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { colors } from '@/shared/constants/colors'
import '../global.css'

void SplashScreen.preventAutoHideAsync()

export default function RootLayout() {
  const [loaded] = useFonts({ Inter_400Regular, Inter_500Medium, Inter_700Bold, SpaceMono_700Bold })

  useEffect(() => {
    if (loaded) void SplashScreen.hideAsync()
  }, [loaded])

  if (!loaded) return null

  return (
    <SafeAreaProvider>
      <Stack
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
          contentStyle: { backgroundColor: colors.ink },
        }}
      >
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="prank" options={{ animation: 'slide_from_right' }} />
      </Stack>
    </SafeAreaProvider>
  )
}
