/**
 * Style Application Utility
 * 
 * Provides utilities for applying custom styles from the ImageResizerStyles
 * configuration to DOM elements in the image resizer dialog.
 */

import type { ImageResizerStyles } from '../types'

/**
 * Element selector mapping for different parts of the image resizer UI
 * @internal
 */
const ELEMENT_SELECTORS = {
	dialog: '[role="dialog"]',
	viewport: '[data-scope="image-cropper"][data-part="viewport"]',
	selection: '[data-scope="image-cropper"][data-part="selection"]',
	handle: '[data-scope="image-cropper"][data-part="handle"]',
	controls: '.flex.items-center.justify-center.gap-2',
	button: 'button[type="button"]',
} as const

/**
 * Applies custom styles to image resizer UI elements
 * 
 * This function takes a styles configuration object and applies both CSS classes
 * and inline styles to the corresponding DOM elements in the image resizer dialog.
 * 
 * Supports styling for:
 * - Dialog container
 * - Image viewport
 * - Selection/crop area
 * - Resize handles
 * - Controls container
 * - Control buttons
 * 
 * @param styles - The styles configuration object containing custom classes and inline styles
 * @param rootElement - Optional root element to search within (defaults to document)
 * 
 * @example
 * ```typescript
 * const styles: ImageResizerStyles = {
 *   dialog: { className: 'custom-dialog' },
 *   viewport: { style: { backgroundColor: '#f0f0f0' } },
 *   button: { className: 'custom-button' }
 * }
 * 
 * applyStyles(styles)
 * ```
 * 
 * @internal
 */
export function applyStyles(
	styles: ImageResizerStyles,
	rootElement: Document | Element = document
): void {
	if (!styles) {
		return
	}

	// Apply dialog styles
	if (styles.dialog) {
		applyStylesToElement(
			rootElement,
			ELEMENT_SELECTORS.dialog,
			styles.dialog.className,
			styles.dialog.style
		)
	}

	// Apply viewport styles
	if (styles.viewport) {
		applyStylesToElement(
			rootElement,
			ELEMENT_SELECTORS.viewport,
			styles.viewport.className,
			styles.viewport.style
		)
	}

	// Apply selection styles
	if (styles.selection) {
		applyStylesToElement(
			rootElement,
			ELEMENT_SELECTORS.selection,
			styles.selection.className,
			styles.selection.style
		)
	}

	// Apply handle styles
	if (styles.handle) {
		const handles = rootElement.querySelectorAll(ELEMENT_SELECTORS.handle)
		handles.forEach((handle) => {
			applyStylesToElement(
				handle as Element,
				'*',
				styles.handle?.className,
				styles.handle?.style
			)
		})
	}

	// Apply controls styles
	if (styles.controls) {
		applyStylesToElement(
			rootElement,
			ELEMENT_SELECTORS.controls,
			styles.controls.className,
			styles.controls.style
		)
	}

	// Apply button styles
	if (styles.button) {
		const buttons = rootElement.querySelectorAll(ELEMENT_SELECTORS.button)
		buttons.forEach((button) => {
			if (styles.button?.className) {
				button.classList.add(...styles.button.className.split(' '))
			}
			if (styles.button?.style) {
				Object.entries(styles.button.style).forEach(([key, value]) => {
					if (value !== undefined && value !== null) {
						(button as HTMLElement).style.setProperty(
							key.replace(/([A-Z])/g, '-$1').toLowerCase(),
							String(value)
						)
					}
				})
			}
		})
	}
}

/**
 * Helper function to apply styles to a specific element
 * 
 * @param rootElement - The root element to search within
 * @param selector - CSS selector for the target element
 * @param className - CSS class name to add
 * @param style - Inline styles to apply
 * 
 * @internal
 */
function applyStylesToElement(
	rootElement: Document | Element,
	selector: string,
	className?: string,
	style?: React.CSSProperties
): void {
	const element = rootElement.querySelector(selector) as HTMLElement | null

	if (!element) {
		return
	}

	// Apply CSS classes
	if (className) {
		element.classList.add(...className.split(' ').filter(Boolean))
	}

	// Apply inline styles
	if (style) {
		Object.entries(style).forEach(([key, value]) => {
			if (value !== undefined && value !== null) {
				element.style.setProperty(
					key.replace(/([A-Z])/g, '-$1').toLowerCase(),
					String(value)
				)
			}
		})
	}
}

/**
 * Removes all custom styles from image resizer UI elements
 * 
 * This function removes CSS classes and inline styles that were previously
 * applied via applyStyles(). Useful for cleanup or resetting styles.
 * 
 * @param styles - The styles configuration object to remove
 * @param rootElement - Optional root element to search within (defaults to document)
 * 
 * @internal
 */
export function removeStyles(
	styles: ImageResizerStyles,
	rootElement: Document | Element = document
): void {
	if (!styles) {
		return
	}

	// Remove dialog styles
	if (styles.dialog) {
		removeStylesFromElement(
			rootElement,
			ELEMENT_SELECTORS.dialog,
			styles.dialog.className,
			styles.dialog.style
		)
	}

	// Remove viewport styles
	if (styles.viewport) {
		removeStylesFromElement(
			rootElement,
			ELEMENT_SELECTORS.viewport,
			styles.viewport.className,
			styles.viewport.style
		)
	}

	// Remove selection styles
	if (styles.selection) {
		removeStylesFromElement(
			rootElement,
			ELEMENT_SELECTORS.selection,
			styles.selection.className,
			styles.selection.style
		)
	}

	// Remove handle styles
	if (styles.handle) {
		const handles = rootElement.querySelectorAll(ELEMENT_SELECTORS.handle)
		handles.forEach((handle) => {
			removeStylesFromElement(
				handle as Element,
				'*',
				styles.handle?.className,
				styles.handle?.style
			)
		})
	}

	// Remove controls styles
	if (styles.controls) {
		removeStylesFromElement(
			rootElement,
			ELEMENT_SELECTORS.controls,
			styles.controls.className,
			styles.controls.style
		)
	}

	// Remove button styles
	if (styles.button) {
		const buttons = rootElement.querySelectorAll(ELEMENT_SELECTORS.button)
		buttons.forEach((button) => {
			if (styles.button?.className) {
				button.classList.remove(...styles.button.className.split(' '))
			}
			if (styles.button?.style) {
				Object.entries(styles.button.style).forEach(([key]) => {
					(button as HTMLElement).style.removeProperty(
						key.replace(/([A-Z])/g, '-$1').toLowerCase()
					)
				})
			}
		})
	}
}

/**
 * Helper function to remove styles from a specific element
 * 
 * @param rootElement - The root element to search within
 * @param selector - CSS selector for the target element
 * @param className - CSS class name to remove
 * @param style - Inline styles to remove
 * 
 * @internal
 */
function removeStylesFromElement(
	rootElement: Document | Element,
	selector: string,
	className?: string,
	style?: React.CSSProperties
): void {
	const element = rootElement.querySelector(selector) as HTMLElement | null

	if (!element) {
		return
	}

	// Remove CSS classes
	if (className) {
		element.classList.remove(...className.split(' ').filter(Boolean))
	}

	// Remove inline styles
	if (style) {
		Object.entries(style).forEach(([key]) => {
			element.style.removeProperty(
				key.replace(/([A-Z])/g, '-$1').toLowerCase()
			)
		})
	}
}
