import { access, readFile } from 'node:fs/promises'

const files = {
  app: 'app.json',
  ads: 'features/monetization/constants/ad-config.ts',
  monetization: 'features/monetization/constants/monetization-config.ts',
}

const contents = await Promise.all(
  Object.values(files).map(async (file) => [file, await readFile(file, 'utf8')]),
)
const placeholders = [
  'YOUR-ID',
  'YOUR-BANNER-ID',
  'YOUR-INTERSTITIAL-ID',
  'com.yourname.',
  'ca-app-pub-3940256099942544~',
]
const failures = contents.flatMap(([file, content]) =>
  placeholders
    .filter((placeholder) => content.includes(placeholder))
    .map((placeholder) => `${file}: ${placeholder}`),
)

const appConfig = JSON.parse(contents.find(([file]) => file === files.app)[1])
const iconPath = appConfig.expo?.icon
if (!iconPath) failures.push('app.json: missing expo.icon')
if (iconPath) {
  try {
    await access(iconPath)
  } catch {
    failures.push(`app.json: missing icon file ${iconPath}`)
  }
}

try {
  await access('eas.json')
} catch {
  failures.push('eas.json: missing EAS build configuration')
}

if (failures.length > 0) {
  console.error('Release configuration contains placeholders:')
  failures.forEach((failure) => console.error(`- ${failure}`))
  process.exitCode = 1
}
