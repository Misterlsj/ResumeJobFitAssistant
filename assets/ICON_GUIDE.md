# Extension Icons Guide

## Required Icons

Chrome extensions require three icon sizes:
- **16×16px** - icon-16.png (Toolbar icon)
- **48×48px** - icon-48.png (Extension management page)
- **128×128px** - icon-128.png (Chrome Web Store, installation dialog)

## Quick Creation Method

### Option 1: Use Online Tools
1. Visit https://www.favicon-generator.org/ or https://realfavicongenerator.net/
2. Upload the `icon.svg` file in this directory
3. Download the PNG versions
4. Rename them to icon-16.png, icon-48.png, icon-128.png

### Option 2: Use ImageMagick (Command Line)
```bash
# Install ImageMagick first, then run:
convert -background none -resize 16x16 icon.svg icon-16.png
convert -background none -resize 48x48 icon.svg icon-48.png
convert -background none -resize 128x128 icon.svg icon-128.png
```

### Option 3: Use Figma/Sketch/Photoshop
1. Open the SVG file
2. Export at three sizes: 16px, 48px, 128px
3. Save as PNG with transparent background

## Icon Design Specs

The current icon design features:
- **Primary Color**: #1E3A5F (Navy Blue)
- **Accent Color**: #4CAF50 (Green for success/detection)
- **Element**: Document with checkmark badge
- **Corner Radius**: 24px (for 128px version)

## Brand Consistency

All icons should maintain:
- Consistent color palette with popup UI
- Clear visual hierarchy (document + checkmark)
- Good contrast at small sizes
- Transparent background for proper blending

## For Development/Testing

If you just need to test the extension without proper icons:
1. Create any 16x16, 48x48, 128x128 PNG files
2. Name them icon-16.png, icon-48.png, icon-128.png
3. Place them in this `assets/` directory
4. The extension will load with placeholder icons

## Production Checklist

Before submitting to Chrome Web Store:
- [ ] Icons are properly sized (exact pixel dimensions)
- [ ] Background is transparent
- [ ] Visual is clear at 16px scale
- [ ] Colors match brand guidelines
- [ ] No compression artifacts
- [ ] Files are optimized (reasonable file size)
