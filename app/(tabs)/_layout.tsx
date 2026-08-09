import { Tabs } from 'expo-router'

const TabLayout = () => {
  return <Tabs screenOptions={{ headerShown: false, tabBarStyle: { display: 'none' } }} />
}

export default TabLayout
