import { readFile } from 'node:fs/promises'

const files = {
  app: 'app.json',
  ads: 'features/monetization/constants/ad-config.ts',
  monetization: 'features/monetization/constants/monetization-config.ts',
}

const contents = await Promise.all(
  Object.values(files).map(async (file) => [file, await readFile(file, 'utf8')]),
)
const placeholders = ['YOUR-ID', 'YOUR-BANNER-ID', 'YOUR-INTERSTITIAL-ID', 'com.yourname.']
const failures = contents.flatMap(([file, content]) =>
  placeholders
    .filter((placeholder) => content.includes(placeholder))
    .map((placeholder) => `${file}: ${placeholder}`),
)

if (failures.length > 0) {
  console.error('Release configuration contains placeholders:')
  failures.forEach((failure) => console.error(`- ${failure}`))
  process.exitCode = 1
}
