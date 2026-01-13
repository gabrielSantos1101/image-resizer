'use client'

import { useContext } from 'react'
import { ImageResizerContext } from './context'
import type { UseImageResizerReturn } from './types'

/**
 * Hook to access the image resizer functionality
 * 
 * This hook must be used within a component that is wrapped by ImageResizerProvider.
 * It returns a function that can be called to trigger the image resizer dialog.
 * 
 * @returns An object containing the resizeImage function
 * @throws Error if used outside of ImageResizerProvider
 * 
 * @example
 * ```typescript
 * import { useImageResizer } from '@/lib'
 * 
 * export function MyComponent() {
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
export function useImageResizer(): UseImageResizerReturn {
	const context = useContext(ImageResizerContext)

	if (!context) {
		throw new Error(
			'useImageResizer must be used within an ImageResizerProvider. ' +
			'Make sure your component is wrapped with <ImageResizerProvider>.'
		)
	}

	/**
	 * Trigger function that opens the resizer dialog with the provided image URL
	 * 
	 * @param imageUrl - The URL of the image to resize
	 * @returns A promise that resolves with the blob URL when the user saves,
	 *          or rejects if the user cancels or an error occurs
	 */
	const resizeImage = (imageUrl: string): Promise<string> => {
		return context.open(imageUrl)
	}

	return {
		resizeImage,
	}
}

