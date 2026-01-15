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
import type { ImageResizerClassNames, ImageResizerConfig } from './types'

/**
 * Internal store state and actions
 * @internal
 */
interface ImageResizerStoreState {
	// State
	isOpen: boolean
	imageUrl: string | null
	classNames: ImageResizerClassNames
	config: ImageResizerConfig
	pendingResolve: ((blobUrl: string) => void) | null
	pendingReject: ((error: Error) => void) | null
	blobUrls: Set<string>

	// Actions
	open: (
		imageUrl: string,
		classNames?: ImageResizerClassNames,
		config?: ImageResizerConfig
	) => Promise<string>
	close: () => void
	save: (blobUrl: string) => void
	cancel: (error: Error) => void
	addBlobUrl: (blobUrl: string) => void
	revokeBlobUrls: () => void
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
	classNames: {},
	config: {},
	pendingResolve: null,
	pendingReject: null,
	blobUrls: new Set(),

	// Actions
	/**
	 * Opens the resizer dialog with the provided image URL
	 * Returns a Promise that resolves when the user saves or rejects when they cancel
	 */
	open: (imageUrl, classNames, config) => {
		// Revoke any previous blob URLs before opening a new image
		const { revokeBlobUrls } = get()
		revokeBlobUrls()

		return new Promise<string>((resolve, reject) => {
			set({
				isOpen: true,
				imageUrl,
				classNames: classNames || {},
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
		const { pendingReject, revokeBlobUrls } = get()
		if (pendingReject) {
			pendingReject(error)
		}
		// Clean up blob URLs on cancellation
		revokeBlobUrls()
		set({
			isOpen: false,
			imageUrl: null,
			pendingResolve: null,
			pendingReject: null,
		})
	},

	/**
	 * Adds a blob URL to the tracking set
	 * @internal Used by ImageResizerDialog to track created blob URLs
	 */
	addBlobUrl: (blobUrl: string) => {
		set((state) => ({
			blobUrls: new Set([...state.blobUrls, blobUrl]),
		}))
	},

	/**
	 * Revokes all tracked blob URLs to prevent memory leaks
	 * @internal Called when closing dialog or opening a new image
	 */
	revokeBlobUrls: () => {
		const { blobUrls } = get()
		blobUrls.forEach((url) => {
			try {
				URL.revokeObjectURL(url)
			} catch (error) {
				console.error('Failed to revoke blob URL:', error)
			}
		})
		set({
			blobUrls: new Set(),
		})
	},
}))
