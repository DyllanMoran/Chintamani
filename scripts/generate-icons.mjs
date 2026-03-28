import sharp from 'sharp'
import { mkdir } from 'fs/promises'

await mkdir('public', { recursive: true })

// Chintamani = wish-fulfilling jewel — double diamond icon
const icon = (size) => `
<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 180 180">
  <rect width="180" height="180" fill="#0c0c0c"/>
  <polygon points="90,36 144,90 90,144 36,90"
    fill="none" stroke="#8c7355" stroke-width="1.5"/>
  <polygon points="90,58 122,90 90,122 58,90"
    fill="#8c7355" fill-opacity="0.12" stroke="#8c7355" stroke-width="1.5"/>
</svg>`

await sharp(Buffer.from(icon(180))).resize(180, 180).png().toFile('public/apple-touch-icon.png')
await sharp(Buffer.from(icon(32))).resize(32, 32).png().toFile('public/favicon-32x32.png')
await sharp(Buffer.from(icon(16))).resize(16, 16).png().toFile('public/favicon-16x16.png')

console.log('Icons generated.')
