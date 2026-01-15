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
      const blobUrl = await resizeImage('https://example.com/image.jpg')
      console.log('Resized image:', blobUrl)
      // Use the blob URL in an img tag or upload it
    } catch (error) {
      console.error('Resize failed:', error)
    }
  }

  return <button onClick={handleResize}>Resize Image</button>
}
```

## API Reference

### `resizeImage(imageUrl, options?)`

Triggers the image resizer dialog and returns a Promise with the blob URL.

**Parameters:**
- `imageUrl` (string): The URL of the image to resize
- `options` (ResizeImageOptions, optional):
  - `classNames` (ImageResizerClassNames): Custom CSS class names for dialog elements
  - `config` (ImageResizerConfig): Configuration options

**Returns:** `Promise<string>` - Resolves with blob URL on success, rejects on cancel/error

**Example:**

```typescript
// Simple usage
resizeImage('https://example.com/image.jpg')
  .then(blobUrl => {
    // Use the blob URL
  })
  .catch(error => {
    // Handle error or cancellation
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
    maxZoom: 5
  }
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
}
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
