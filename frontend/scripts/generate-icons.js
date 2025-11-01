// Generate PWA Icons Script
// This creates placeholder icons for PWA
// In production, you should use proper icon generator tools

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const sizes = [72, 96, 128, 144, 152, 192, 384, 512]
const iconsDir = path.join(__dirname, '../public/icons')

// Create icons directory if it doesn't exist
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true })
}

// SVG template for the icon
const createSVG = (size) => `
<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#667eea;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#764ba2;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="${size}" height="${size}" fill="url(#grad)" rx="${size * 0.15}"/>
  <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="${size * 0.5}" 
        fill="white" text-anchor="middle" dominant-baseline="middle" font-weight="bold">
    ✓
  </text>
</svg>
`

// Create SVG icons
sizes.forEach((size) => {
  const svg = createSVG(size)
  const filename = `icon-${size}x${size}.svg`
  fs.writeFileSync(path.join(iconsDir, filename), svg.trim())
  console.log(`✅ Created ${filename}`)
})

// Create PNG placeholder instructions
const readmeContent = `# PWA Icons

## Generated Icons
This folder contains SVG icons for the PWA. For production, you should:

1. Create a high-resolution source image (1024x1024 or larger)
2. Use an icon generator service like:
   - https://realfavicongenerator.net/
   - https://www.pwabuilder.com/
   - https://favicon.io/

3. Replace these SVG files with properly optimized PNG files

## Required Sizes
- 72x72 - Android devices
- 96x96 - Android devices
- 128x128 - Chrome Web Store
- 144x144 - IE11
- 152x152 - iOS devices
- 192x192 - Android devices
- 384x384 - Splash screens
- 512x512 - PWA install prompt

## Quick Generate PNGs from SVGs
If you have ImageMagick installed:
\`\`\`bash
for size in 72 96 128 144 152 192 384 512; do
  convert icon-\${size}x\${size}.svg icon-\${size}x\${size}.png
done
\`\`\`

Or use online converters:
- https://cloudconvert.com/svg-to-png
- https://convertio.co/svg-png/
`

fs.writeFileSync(path.join(iconsDir, 'README.md'), readmeContent)
console.log('✅ Created README.md')

console.log('\n🎉 PWA icons generated successfully!')
console.log('⚠️  For production, replace SVG icons with optimized PNG files')
