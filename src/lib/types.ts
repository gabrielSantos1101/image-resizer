/**
 * Image Resizer Toast Library - Type Definitions
 * 
 * This module exports all TypeScript interfaces and types used throughout
 * the Image Resizer Toast Library for full type safety and IDE support.
 */

/**
 * Custom styles configuration for the Image Resizer UI components.
 * Allows customization of CSS classes and inline styles for various UI elements.
 * 
 * @example
 * ```typescript
 * const styles: ImageResizerStyles = {
 *   dialog: { className: 'custom-dialog' },
 *   viewport: { style: { backgroundColor: '#f0f0f0' } }
 * }
 * ```
 */
export interface ImageResizerStyles {
	/**
	 * Styles for the main dialog container
	 */
	dialog?: {
		/** CSS class name to apply to the dialog */
		className?: string
		/** Inline styles to apply to the dialog */
		style?: React.CSSProperties
	}

	/**
	 * Styles for the image viewport area
	 */
	viewport?: {
		/** CSS class name to apply to the viewport */
		className?: string
		/** Inline styles to apply to the viewport */
		style?: React.CSSProperties
	}

	/**
	 * Styles for the selection/crop area
	 */
	selection?: {
		/** CSS class name to apply to the selection */
		className?: string
		/** Inline styles to apply to the selection */
		style?: React.CSSProperties
	}

	/**
	 * Styles for the resize handles
	 */
	handle?: {
		/** CSS class name to apply to handles */
		className?: string
		/** Inline styles to apply to handles */
		style?: React.CSSProperties
	}

	/**
	 * Styles for the controls container
	 */
	controls?: {
		/** CSS class name to apply to controls */
		className?: string
		/** Inline styles to apply to controls */
		style?: React.CSSProperties
	}

	/**
	 * Styles for control buttons
	 */
	button?: {
		/** CSS class name to apply to buttons */
		className?: string
		/** Inline styles to apply to buttons */
		style?: React.CSSProperties
	}
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

	/**
	 * Closes the resizer dialog
	 */
	close: () => void

	/**
	 * Whether the resizer dialog is currently open
	 */
	isOpen: boolean

	/**
	 * The current image URL being resized, or null if no image is open
	 */
	imageUrl: string | null

	/**
	 * Custom styles configuration for the resizer UI
	 */
	styles?: ImageResizerStyles

	/**
	 * Configuration options for the resizer behavior
	 */
	config?: ImageResizerConfig
}

/**
 * Props for the ImageResizerProvider component
 */
export interface ImageResizerProviderProps {
	/**
	 * Child components that will have access to the image resizer via the hook
	 */
	children: React.ReactNode

	/**
	 * Custom styles configuration for the resizer UI
	 */
	styles?: ImageResizerStyles

	/**
	 * Configuration options for the resizer behavior
	 */
	config?: ImageResizerConfig
}

/**
 * Return type for the useImageResizer hook
 */
export interface UseImageResizerReturn {
	/**
	 * Function to trigger the image resizer
	 * @param imageUrl - The URL of the image to resize
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
	resizeImage: (imageUrl: string) => Promise<string>
}

/**
 * Result of a successful image resize operation
 * 
 * @internal
 */
export interface ResizeResult {
	/**
	 * The blob URL that can be used in img src attributes
	 */
	blobUrl: string

	/**
	 * The actual Blob object containing the image data
	 */
	blob: Blob

	/**
	 * Width of the resized image in pixels
	 */
	width: number

	/**
	 * Height of the resized image in pixels
	 */
	height: number
}
