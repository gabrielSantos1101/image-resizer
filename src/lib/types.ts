/**
 * Image Resizer Toast like Library - Type Definitions
 * 
 * This module exports all TypeScript interfaces and types used throughout
 * the Image Resizer Toast Library for full type safety and IDE support.
 */

import type { CropData as ZagCropData, Props as ZagProps } from '@zag-js/image-cropper'

/**
 * CSS class names for customizing individual parts of the Image Resizer modal.
 * Provides a granular, object-based approach to applying custom classes to each UI element.
 * 
 * @example
 * ```typescript
 * const classNames: ImageResizerClassNames = {
 *   dialog: 'custom-dialog-class',
 *   button: 'custom-button-class',
 *   cancelButton: 'custom-cancel-btn'
 * }
 * ```
 */
export interface ImageResizerClassNames {
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

/**
 * Crop data metadata from Zag's image cropper.
 * Contains crop position, dimensions, rotation, and flip state in natural image coordinates.
 * 
 * @see {@link https://zagjs.com/components/image-cropper}
 */
export type CropData = ZagCropData

/**
 * Configuration options for the Image Resizer behavior and output.
 * Extends Zag's native configuration options.
 * 
 * @example
 * ```typescript
 * const config: ImageResizerConfig = {
 *   minZoom: 0.5,
 *   maxZoom: 5,
 *   imageFormat: 'image/jpeg',
 *   imageQuality: 0.85,
 *   cropShape: 'rectangle',
 *   aspectRatio: 1
 * }
 * ```
 */
export interface ImageResizerConfig extends Partial<ZagProps> {
	/**
	 * Minimum zoom level allowed (default: 1)
	 * Image_Resizer option that takes precedence over Zag's minZoom
	 */
	minZoom?: number

	/**
	 * Maximum zoom level allowed (default: 3)
	 * Image_Resizer option that takes precedence over Zag's maxZoom
	 */
	maxZoom?: number

	/**
	 * Default zoom level when opening the resizer (default: 1)
	 */
	defaultZoom?: number

	/**
	 * Image format for the output blob (default: 'image/png')
	 * Supported formats: 'image/png', 'image/jpeg', 'image/webp'
	 */
	imageFormat?: 'image/png' | 'image/jpeg' | 'image/webp'

	/**
	 * Quality level for lossy formats like JPEG and WebP (0-1, default: 0.92)
	 * Only applies when imageFormat is 'image/jpeg' or 'image/webp'
	 */
	imageQuality?: number
}

/**
 * The context type for the Image Resizer provider.
 * Manages the state and operations of the image resizer.
 * 
 * @internal
 */
export interface ImageResizerContextType {
	/**
	 * Opens the resizer dialog with the provided image URL
	 * @param imageUrl - The URL of the image to resize
	 * @returns A promise that resolves with { blobUrl, cropData? },
	 *          or rejects if the operation is cancelled or fails
	 */
	open: (imageUrl: string) => Promise<ResizeImageResult>
	close: () => void
	isOpen: boolean
	imageUrl: string | null
	classNames?: ImageResizerClassNames
	config?: ImageResizerConfig
}

export interface ResizeImageOptions {
	classNames?: ImageResizerClassNames
	config?: ImageResizerConfig
}

/**
 * Result of a successful image resize operation
 */
export interface ResizeImageResult {
	blobUrl: string
	cropData?: CropData
}

/**
 * Return type for the useImageResizer hook
 * @deprecated Use resizeImage function directly instead
 */
export interface UseImageResizerReturn {
	/**
	 * Function to trigger the image resizer
	 * @param imageUrl - The URL of the image to resize
	 * @param classNames - Optional custom class names to override provider-level class names
	 * @param config - Optional configuration to override provider-level config
	 * @returns A promise that resolves with { blobUrl, cropData? }
	 * @throws Error if the image fails to load or canvas context cannot be created
	 * @throws Error with message 'Cancelled' if the user cancels the operation
	 * 
	 * @example
	 * ```typescript
	 * const { resizeImage } = useImageResizer()
	 * 
	 * // Without crop data
	 * resizeImage('https://example.com/image.jpg')
	 *   .then(({ blobUrl }) => {
	 *     console.log('Resized image:', blobUrl)
	 *   })
	 *   .catch(error => {
	 *     console.error('Resize failed:', error)
	 *   })
	 * 
	 * // With crop data
	 * resizeImage('https://example.com/image.jpg')
	 *   .then(({ blobUrl, cropData }) => {
	 *     console.log('Resized image:', blobUrl)
	 *     console.log('Crop data:', cropData)
	 *   })
	 *   .catch(error => {
	 *     console.error('Resize failed:', error)
	 *   })
	 * ```
	 */
	resizeImage: (imageUrl: string, classNames?: ImageResizerClassNames, config?: ImageResizerConfig) => Promise<ResizeImageResult>
}

/**
 * Result of a successful image resize operation
 * 
 * @internal
 */
export interface ResizeResult {
	blobUrl: string
	blob: Blob
	cropData: CropData
	width: number
	height: number
}
