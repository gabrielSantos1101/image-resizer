/**
 * Image Resizer Toast like Library - Type Definitions
 * 
 * This module exports all TypeScript interfaces and types used throughout
 * the Image Resizer Toast Library for full type safety and IDE support.
 */

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
 * Configuration options for the Image Resizer behavior and output.
 * 
 * @example
 * ```typescript
 * const config: ImageResizerConfig = {
 *   minZoom: 0.5,
 *   maxZoom: 5,
 *   imageFormat: 'image/jpeg',
 *   imageQuality: 0.85
 * }
 * ```
 */
export interface ImageResizerConfig {
	/**
	 * Minimum zoom level allowed (default: 1)
	 */
	minZoom?: number

	/**
	 * Maximum zoom level allowed (default: 3)
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
	 * @returns A promise that resolves with the blob URL of the resized image,
	 *          or rejects if the operation is cancelled or fails
	 */
	open: (imageUrl: string) => Promise<string>
	close: () => void
	isOpen: boolean
	imageUrl: string | null
	classNames?: ImageResizerClassNames
	config?: ImageResizerConfig
}

export interface ImageResizerProviderProps {
	children: React.ReactNode
	classNames?: ImageResizerClassNames
	config?: ImageResizerConfig
}

export interface ResizeImageOptions {
	classNames?: ImageResizerClassNames
	config?: ImageResizerConfig
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
	 * @returns A promise that resolves with the blob URL of the resized image
	 * @throws Error if the image fails to load or canvas context cannot be created
	 * @throws Error with message 'Cancelled' if the user cancels the operation
	 * 
	 * @example
	 * ```typescript
	 * const { resizeImage } = useImageResizer()
	 * 
	 * resizeImage('https://example.com/image.jpg')
	 *   .then(blobUrl => {
	 *     console.log('Resized image:', blobUrl)
	 *   })
	 *   .catch(error => {
	 *     console.error('Resize failed:', error)
	 *   })
	 * ```
	 */
	resizeImage: (imageUrl: string, classNames?: ImageResizerClassNames, config?: ImageResizerConfig) => Promise<string>
}

/**
 * Result of a successful image resize operation
 * 
 * @internal
 */
export interface ResizeResult {
	blobUrl: string
	blob: Blob
	width: number
	height: number
}
