/**
 * Image Resizer Toast Library
 * 
 * A React library that provides a toast-like, globally accessible image resizer.
 * Place the ImageResizerProvider at the root of your application and use the
 * useImageResizer hook anywhere to trigger image resizing operations.
 * 
 * @example
 * ```typescript
 * import { ImageResizerProvider, useImageResizer } from '@/lib'
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
 *   const { resizeImage } = useImageResizer()
 *   
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

// Export all types
export type {
    ImageResizerConfig,
    ImageResizerContextType,
    ImageResizerProviderProps, ImageResizerStyles, ResizeResult, UseImageResizerReturn
} from './types';

// Export components and hooks
export { ImageResizerProvider } from './provider';
export { useImageResizer } from './use-image-resizer';

