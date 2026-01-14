'use client'

import { useImageResizerStore } from './store'
import type { ResizeImageOptions } from './types'

/**
 * Direct function to trigger image resizing
 * 
 * Similar to Sonner's toast API, this function can be called directly without
 * needing to use a hook. It must be called within a component tree that has
 * ImageResizerProvider as an ancestor.
 * 
 * @param imageUrl - The URL of the image to resize
 * @param options - Optional configuration object with styles and config
 * @returns A promise that resolves with the blob URL when the user saves,
 *          or rejects if the user cancels or an error occurs
 * 
 * @example
 * ```typescript
 * import { resizeImage } from '@/lib'
 * 
 * // Simple usage
 * resizeImage('https://example.com/image.jpg')
 *   .then(blobUrl => {
 *     console.log('Resized image:', blobUrl)
 *   })
 *   .catch(error => {
 *     console.error('Resize failed:', error)
 *   })
 * 
 * // With custom options
 * resizeImage('https://example.com/image.jpg', {
 *   styles: {
 *     dialog: { className: 'custom-dialog' }
 *   },
 *   config: {
 *     imageFormat: 'image/jpeg',
 *     imageQuality: 0.85
 *   }
 * })
 * ```
 */
export function resizeImage(
	imageUrl: string,
	options?: ResizeImageOptions
): Promise<string> {
	const store = useImageResizerStore.getState()
	return store.open(imageUrl, options?.styles, options?.config)
}
