/**
 * Image Resizer Toast Library
 * 
 * A React library that provides a toast-like, globally accessible image resizer.
 * Place the ImageResizerProvider at the root of your application and call
 * resizeImage() from anywhere to trigger image resizing operations.
 * 
 * @example
 * ```typescript
 * import { ImageResizerProvider, resizeImage } from '@/lib'
 * 
 * function App() {
 *   return (
 *     <ImageResizerProvider>
 *       <YourApp />
 *     </ImageResizerProvider>
 *   )
 * }
 * 
 * function MyComponent() {
 *   const handleResize = async () => {
 *     try {
 *       const blobUrl = await resizeImage('https://example.com/image.jpg')
 *       console.log('Resized image:', blobUrl)
 *     } catch (error) {
 *       console.error('Resize failed:', error)
 *     }
 *   }
 *   
 *   return <button onClick={handleResize}>Resize Image</button>
 * }
 * ```
 */

export type {
    ImageResizerConfig,
    ImageResizerContextType,
    ResizeImageOptions,
    ResizeResult,
    UseImageResizerReturn
} from './types'

export { ImageResizerProvider } from './provider'
export { resizeImage } from './resize-image'
export { useImageResizer } from './use-image-resizer'

export { useImageResizerStore } from './store'

