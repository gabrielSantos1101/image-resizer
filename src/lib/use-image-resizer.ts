'use client'

import { useImageResizerStore } from './store'
import type { ImageResizerClassNames, ImageResizerConfig, ResizeImageResult, UseImageResizerReturn } from './types'

/**
 * Hook to access the image resizer functionality
 * 
 * This hook must be used within a component that is wrapped by ImageResizerProvider.
 * It returns a function that can be called to trigger the image resizer dialog.
 * 
 * The hook uses Zustand for global state management, so it can be called from
 * any component in the application without prop drilling.
 * 
 * @returns An object containing the resizeImage function
 * @throws Error if the store is not initialized (should not happen if provider is set up correctly)
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
 *       // Without crop data
 *       const { blobUrl } = await resizeImage('https://example.com/image.jpg')
 *       console.log('Resized image:', blobUrl)
 *       
 *       // Or with crop data
 *       const { blobUrl, cropData } = await resizeImage('https://example.com/image.jpg')
 *       console.log('Crop data:', cropData)
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
	const open = useImageResizerStore((state) => state.open)

	/**
	 * Trigger function that opens the resizer dialog with the provided image URL
	 * 
	 * @param imageUrl - The URL of the image to resize
	 * @param classNames - Optional custom class names to override provider-level class names
	 * @param config - Optional configuration to override provider-level config
	 * @returns A promise that resolves with { blobUrl, cropData? } when the user saves,
	 *          or rejects if the user cancels or an error occurs
	 */
	const resizeImage = (
		imageUrl: string,
		classNames?: ImageResizerClassNames,
		config?: ImageResizerConfig
	): Promise<ResizeImageResult> => {
		return open(imageUrl, classNames, config)
	}

	return {
		resizeImage,
	}
}

