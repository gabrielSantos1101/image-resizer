# Image Resizer Toast Library

A React library that provides a toast-like, globally accessible image resizer. Similar to Sonner's toast API, you can trigger image resizing from anywhere in your application without prop drilling.

## Key Features

- **Toast-like API**: Call `resizeImage()` directly, no hooks needed
- **Global State**: Zustand-based state management for seamless integration
- **Interactive Cropping**: Zoom, rotate, and flip images with intuitive controls
- **Promise-based**: Async/await support for handling resize operations
- **Customizable**: Full control over styles and configuration
- **Type-safe**: Complete TypeScript support with JSDoc documentation
- **Resource Management**: Automatic blob URL cleanup and memory management

## Installation

```bash
pnpm install
```

## Quick Start

### 1. Add the provider to your app

```typescript
import { ImageResizerProvider } from '@/lib'

function App() {
  return (
    <>
      <ImageResizerProvider />
      <YourApp />
    </>
  )
}
```

### 2. Call `resizeImage()` from anywhere

```typescript
import { resizeImage } from '@/lib'

function MyComponent() {
  const handleResize = async () => {
    try {
      const { blobUrl, cropData } = await resizeImage('https://example.com/image.jpg')
      console.log('Resized image:', blobUrl)
      console.log('Crop data:', cropData)
      // Use the blob URL in an img tag or upload it
      // Store crop data for later reference
    } catch (error) {
      console.error('Resize failed:', error)
    }
  }

  return <button onClick={handleResize}>Resize Image</button>
}
```

## API Reference

### `resizeImage(imageUrl, options?)`

Triggers the image resizer dialog and returns a Promise with the blob URL and crop data.

**Parameters:**
- `imageUrl` (string): The URL of the image to resize
- `options` (ResizeImageOptions, optional):
  - `classNames` (ImageResizerClassNames): Custom CSS class names for dialog elements
  - `config` (ImageResizerConfig): Configuration options

**Returns:** `Promise<ResizeImageResult>` - Resolves with `{ blobUrl, cropData }` on success, rejects on cancel/error

**Breaking Change (v2.0):** The return type changed from `Promise<string>` to `Promise<ResizeImageResult>`. You now receive both the blob URL and crop metadata. Update your code to destructure the result:

```typescript
// Old (v1.x) - No longer works
const blobUrl = await resizeImage('https://example.com/image.jpg')

// New (v2.0+) - Destructure the result
const { blobUrl, cropData } = await resizeImage('https://example.com/image.jpg')
```

**Example:**

```typescript
// Simple usage - get both blob URL and crop data
resizeImage('https://example.com/image.jpg')
  .then(({ blobUrl, cropData }) => {
    console.log('Resized image:', blobUrl)
    console.log('Crop data:', cropData)
    // Use the blob URL in an img tag or upload it
  })
  .catch(error => {
    console.error('Resize failed:', error)
  })

// With custom options
resizeImage('https://example.com/image.jpg', {
  classNames: {
    dialog: 'custom-dialog',
    controls: 'custom-controls'
  },
  config: {
    imageFormat: 'image/jpeg',
    imageQuality: 0.85,
    minZoom: 0.5,
    maxZoom: 5,
    // Pass native Zag options for advanced customization
    zag: {
      aspectRatio: 1,
      cropShape: 'circle'
    }
  }
})
  .then(({ blobUrl, cropData }) => {
    // Save both the image and metadata
    saveToDatabase(blobUrl, cropData)
  })
  .catch(error => {
    console.error('Resize failed:', error)
  })
```

### `ImageResizerProvider`

Provides global access to the image resizer functionality. Simply place this component once in your application (typically in your root layout or main App).

**Props:** None - The provider doesn't accept any props

**Example:**

```typescript
// In your root layout or App component
import { ImageResizerProvider } from '@/lib'

function App() {
  return (
    <>
      <ImageResizerProvider />
      <YourApp />
    </>
  )
}

// Or in a Next.js layout
export default function RootLayout() {
  return (
    <html>
      <body>
        <ImageResizerProvider />
        <YourContent />
      </body>
    </html>
  )
}
```

## Configuration Options

### `ImageResizerConfig`

```typescript
interface ImageResizerConfig {
  minZoom?: number              // Default: 1
  maxZoom?: number              // Default: 3
  defaultZoom?: number          // Default: 1
  imageFormat?: string          // Default: 'image/png'
  imageQuality?: number         // Default: 0.92 (0-1)
  cropShape?: 'rectangle' | 'circle'
  aspectRatio?: number
  fixedCropArea?: boolean
  defaultRotation?: number
  defaultFlip?: { horizontal: boolean; vertical: boolean }
  nudgeStep?: number
  nudgeStepShift?: number
  nudgeStepCtrl?: number
  translations?: Record<string, string>
  // ... other @zag-js/image-cropper options
}
```

**Zag Configuration Notes:**
- Image_Resizer options (`minZoom`, `maxZoom`, `imageFormat`, `imageQuality`) take precedence over Zag options
- Pass native Zag options via the `zag` field for advanced customization
- See [@zag-js/image-cropper documentation](https://zagjs.com/components/image-cropper) for all available options

### `CropData`

Metadata about the crop operation returned alongside the blob URL:

```typescript
interface CropData {
  // Viewport coordinates (what user sees)
  x: number
  y: number
  width: number
  height: number
  
  // Natural image coordinates (original image pixels)
  naturalX: number
  naturalY: number
  naturalWidth: number
  naturalHeight: number
  
  // Transformations applied
  rotation: number              // degrees (0, 90, 180, 270, etc.)
  flip: {
    horizontal: boolean
    vertical: boolean
  }
  
  // Current zoom level
  zoom: number
}
```

**Usage Example:**

```typescript
const { blobUrl, cropData } = await resizeImage('https://example.com/image.jpg')

// Store crop metadata for later reference
console.log(`Image cropped to ${cropData.width}x${cropData.height}`)
console.log(`Rotation: ${cropData.rotation}°`)
console.log(`Flipped horizontally: ${cropData.flip.horizontal}`)
console.log(`Zoom level: ${cropData.zoom}x`)

// Save to database
await saveCropMetadata({
  imageUrl: blobUrl,
  cropData: cropData
})
```

### `ImageResizerClassNames`

```typescript
interface ImageResizerClassNames {
  dialog?: string
  viewport?: string
  selection?: string
  handle?: string
  controls?: string
  button?: string
  imageContainer?: string
  zoomDisplay?: string
  separator?: string
  footer?: string
  cancelButton?: string
  saveButton?: string
}
```

## Advanced Usage

### Working with Transformations

The Image Resizer supports rotation and flip transformations. These are automatically applied to the final blob and included in the crop data:

```typescript
const { blobUrl, cropData } = await resizeImage('https://example.com/image.jpg')

// Check what transformations were applied
if (cropData.rotation !== 0) {
  console.log(`Image was rotated ${cropData.rotation}°`)
}

if (cropData.flip.horizontal || cropData.flip.vertical) {
  console.log('Image was flipped')
}

// The blob URL contains the transformed image
// The crop data preserves the transformation metadata
```

### Using Native Zag Options

For advanced customization, pass native @zag-js/image-cropper options:

```typescript
const { blobUrl, cropData } = await resizeImage('https://example.com/image.jpg', {
  config: {
    // Image_Resizer options
    imageFormat: 'image/jpeg',
    imageQuality: 0.9,
    
    // Native Zag options (via zag field)
    zag: {
      cropShape: 'circle',           // Circular crop area
      aspectRatio: 1,                // Square aspect ratio
      fixedCropArea: true,           // Lock crop area size
      defaultRotation: 90,           // Start rotated
      nudgeStep: 5                   // Keyboard nudge step in pixels
    }
  }
})
```

**Important:** Image_Resizer options (`minZoom`, `maxZoom`, `imageFormat`, `imageQuality`) always take precedence over conflicting Zag options.

## Development

### Start the dev server

```bash
pnpm dev
```

### Build for production

```bash
pnpm build
```

### Run linter

```bash
pnpm lint
```

## Architecture

The library uses:
- **Zustand**: Global state management
- **@zag-js/image-cropper**: Image cropping functionality
- **React**: UI framework
- **TypeScript**: Type safety

## License

MIT
