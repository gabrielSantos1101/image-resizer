/**
 * Zustand Store for Image Resizer
 * 
 * Manages the global state of the image resizer including:
 * - Dialog open/close state
 * - Current image URL
 * - Custom styles and configuration
 * - Promise resolution/rejection callbacks
 */

import { create } from 'zustand'
import type { ImageResizerConfig, ImageResizerStyles } from './types'

/**
 * Internal store state and actions
 * @internal
 */
interface ImageResizerStoreState {
	// State
	isOpen: boolean
	imageUrl: string | null
	styles: ImageResizerStyles
	config: ImageResizerConfig
	pendingResolve: ((blobUrl: string) => void) | null
	pendingReject: ((error: Error) => void) | null

	// Actions
	open: (
		imageUrl: string,
		styles?: ImageResizerStyles,
		config?: ImageResizerConfig
	) => Promise<string>
	close: () => void
	save: (blobUrl: string) => void
	cancel: (error: Error) => void
}

/**
 * Create the Zustand store for managing image resizer state
 * 
 * The store manages:
 * - Dialog visibility state
 * - Current image URL being resized
 * - Custom styles and configuration
 * - Promise callbacks for async operations
 * 
 * @internal
 */
export const useImageResizerStore = create<ImageResizerStoreState>((set, get) => ({
	// Initial state
	isOpen: false,
	imageUrl: null,
	styles: {},
	config: {},
	pendingResolve: null,
	pendingReject: null,

	// Actions
	/**
	 * Opens the resizer dialog with the provided image URL
	 * Returns a Promise that resolves when the user saves or rejects when they cancel
	 */
	open: (imageUrl, styles, config) => {
		return new Promise<string>((resolve, reject) => {
			set({
				isOpen: true,
				imageUrl,
				styles: styles || {},
				config: config || {},
				pendingResolve: resolve,
				pendingReject: reject,
			})
		})
	},

	/**
	 * Closes the resizer dialog without saving
	 */
	close: () => {
		set({
			isOpen: false,
			imageUrl: null,
			pendingResolve: null,
			pendingReject: null,
		})
	},

	/**
	 * Saves the resized image and resolves the pending Promise
	 */
	save: (blobUrl: string) => {
		const { pendingResolve } = get()
		if (pendingResolve) {
			pendingResolve(blobUrl)
		}
		set({
			isOpen: false,
			imageUrl: null,
			pendingResolve: null,
			pendingReject: null,
		})
	},

	/**
	 * Cancels the resize operation and rejects the pending Promise
	 */
	cancel: (error: Error) => {
		const { pendingReject } = get()
		if (pendingReject) {
			pendingReject(error)
		}
		set({
			isOpen: false,
			imageUrl: null,
			pendingResolve: null,
			pendingReject: null,
		})
	},
}))
