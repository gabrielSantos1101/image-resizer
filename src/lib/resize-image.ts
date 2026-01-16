'use client'

import { useImageResizerStore } from './store'
import type { ResizeImageOptions, ResizeImageResult } from './types'

/**
 * Direct function to trigger image resizing
 * 
 * Similar to Sonner's toast API, this function can be called directly without
 * needing to use a hook. It must be called within a component tree that has
 * ImageResizerProvider as an ancestor.
 * 
 * @param imageUrl - The URL of the image to resize
 * @param options - Optional configuration object with classNames and config
 * @returns A promise that resolves with { blobUrl, cropData } when the user saves,
 *          or rejects if the user cancels or an error occurs.
 *          The cropData includes position, dimensions, rotation, flip state, and zoom level.
 * 
 * @example
 * ```typescript
 * import { resizeImage } from '@/lib'
 * 
 * // Basic usage - get both blob URL and crop data
 * resizeImage('https://example.com/image.jpg')
 *   .then(({ blobUrl, cropData }) => {
 *     console.log('Resized image:', blobUrl)
 *     console.log('Crop metadata:', cropData)
 *     // cropData includes: x, y, width, height, naturalX, naturalY, 
 *     // naturalWidth, naturalHeight, rotation, flip, zoom
 *   })
 *   .catch(error => {
 *     console.error('Resize failed:', error)
 *   })
 * 
 * // With custom options
 * resizeImage('https://example.com/image.jpg', {
 *   classNames: {
 *     dialog: 'custom-dialog'
 *   },
 *   config: {
 *     imageFormat: 'image/jpeg',
 *     imageQuality: 0.85,
 *     zag: {
 *       aspectRatio: 1,
 *       cropShape: 'circle'
 *     }
 *   }
 * })
 *   .then(({ blobUrl, cropData }) => {
 *     // Save both the image and metadata
 *     saveToDatabase(blobUrl, cropData)
 *   })
 * ```
 */
export function resizeImage(
	imageUrl: string,
	options?: ResizeImageOptions
): Promise<ResizeImageResult> {
	const store = useImageResizerStore.getState()
	return store.open(imageUrl, options?.classNames, options?.config)
}
