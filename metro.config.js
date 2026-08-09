const { getDefaultConfig } = require('expo/metro-config')
const { withNativeWind } = require('nativewind/metro')
const path = require('path')

const config = getDefaultConfig(__dirname)

config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (platform === 'web') {
    if (moduleName === 'react-native-google-mobile-ads') {
      return {
        filePath: path.resolve(__dirname, 'shared/mocks/react-native-google-mobile-ads-web.ts'),
        type: 'sourceFile',
      }
    }
    if (moduleName === 'expo-in-app-purchases') {
      return {
        filePath: path.resolve(__dirname, 'shared/mocks/expo-in-app-purchases-web.ts'),
        type: 'sourceFile',
      }
    }
  }
  return context.resolveRequest(context, moduleName, platform)
}

module.exports = withNativeWind(config, { input: './global.css', configPath: 'tailwind.config.ts' })
