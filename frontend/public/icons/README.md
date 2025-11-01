# PWA Icons

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
```bash
for size in 72 96 128 144 152 192 384 512; do
  convert icon-${size}x${size}.svg icon-${size}x${size}.png
done
```

Or use online converters:
- https://cloudconvert.com/svg-to-png
- https://convertio.co/svg-png/
