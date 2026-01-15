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

### 1. Wrap your app with the provider

```typescript
import { ImageResizerProvider } from '@/lib'

function App() {
  return (
    <ImageResizerProvider>
      <YourApp />
    </ImageResizerProvider>
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
  - `styles` (ImageResizerStyles): Custom styles for the dialog
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
  styles: {
    dialog: { className: 'custom-dialog' },
    controls: { className: 'custom-controls' }
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

Wraps your application to provide global access to the image resizer.

**Props:**
- `children` (ReactNode): Child components
- `styles` (ImageResizerStyles, optional): Default styles for all resize operations
- `config` (ImageResizerConfig, optional): Default configuration for all resize operations

**Example:**

```typescript
<ImageResizerProvider
  styles={{
    dialog: { className: 'my-dialog' },
    controls: { className: 'my-controls' }
  }}
  config={{
    imageFormat: 'image/png',
    imageQuality: 0.92
  }}
>
  <App />
</ImageResizerProvider>
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

### `ImageResizerStyles`

```typescript
interface ImageResizerStyles {
  dialog?: { className?: string; style?: CSSProperties }
  viewport?: { className?: string; style?: CSSProperties }
  selection?: { className?: string; style?: CSSProperties }
  handle?: { className?: string; style?: CSSProperties }
  controls?: { className?: string; style?: CSSProperties }
  button?: { className?: string; style?: CSSProperties }
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
