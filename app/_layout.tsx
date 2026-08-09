import { Inter_400Regular, Inter_500Medium, Inter_700Bold } from '@expo-google-fonts/inter'
import { SpaceMono_400Regular, SpaceMono_700Bold } from '@expo-google-fonts/space-mono'
import { useFonts } from 'expo-font'
import { Stack } from 'expo-router'
import * as SplashScreen from 'expo-splash-screen'
import { useEffect } from 'react'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { colors } from '@/shared/constants/colors'
import { useAppStore } from '@/stores/useAppStore'
import { useAdConsent } from '@/features/monetization/hooks/useAdConsent'
import '../global.css'

void SplashScreen.preventAutoHideAsync()

const RootLayout = () => {
  const [loaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_700Bold,
    SpaceMono_400Regular,
    SpaceMono_700Bold,
  })
  const hasSeenOnboarding = useAppStore((state) => state.hasSeenOnboarding)
  useAdConsent()

  useEffect(() => {
    if (loaded) void SplashScreen.hideAsync()
  }, [loaded])

  if (!loaded) return null

  return (
    <SafeAreaProvider>
      <Stack
        initialRouteName={hasSeenOnboarding ? '(tabs)' : 'onboarding'}
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
          contentStyle: { backgroundColor: colors.ink },
        }}
      >
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="onboarding" />
        <Stack.Screen name="prank" options={{ animation: 'slide_from_right' }} />
      </Stack>
    </SafeAreaProvider>
  )
}

export default RootLayout
