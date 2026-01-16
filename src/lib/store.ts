/**
 * Zustand Store for Image Resizer
 * 
 * Manages the global state of the image resizer including:
 * - Dialog open/close state
 * - Current image URL
 * - Custom styles and configuration
 * - Promise resolution/rejection callbacks
 * - Crop data from the resize operation
 */

import { create } from 'zustand'
import type { CropData, ImageResizerClassNames, ImageResizerConfig, ResizeImageResult } from './types'

/**
 * Internal store state and actions
 * @internal
 */
interface ImageResizerStoreState {
	isOpen: boolean
	imageUrl: string | null
	classNames: ImageResizerClassNames
	config: ImageResizerConfig
	cropData: CropData | null
	pendingResolve: ((result: ResizeImageResult) => void) | null
	pendingReject: ((error: Error) => void) | null
	blobUrls: Set<string>

	open: (
		imageUrl: string,
		classNames?: ImageResizerClassNames,
		config?: ImageResizerConfig
	) => Promise<ResizeImageResult>
	close: () => void
	save: (blobUrl: string, cropData?: CropData) => void
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
 * - Crop data from the resize operation
 * 
 * @internal
 */
export const useImageResizerStore = create<ImageResizerStoreState>((set, get) => ({
	isOpen: false,
	imageUrl: null,
	classNames: {},
	config: {},
	cropData: null,
	pendingResolve: null,
	pendingReject: null,
	blobUrls: new Set(),

	/**
	 * Opens the resizer dialog with the provided image URL
	 * Returns a Promise that resolves with { blobUrl, cropData? } when the user saves
	 * or rejects when they cancel
	 */
	open: (imageUrl, classNames, config) => {
		// Revoke any previous blob URLs before opening a new image
		const { revokeBlobUrls } = get()
		revokeBlobUrls()

		return new Promise<ResizeImageResult>((resolve, reject) => {
			set({
				isOpen: true,
				imageUrl,
				classNames: classNames || {},
				config: config || {},
				cropData: null,
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
			cropData: null,
			pendingResolve: null,
			pendingReject: null,
		})
	},

	/**
	 * Saves the resized image with optional crop data and resolves the pending Promise
	 */
	save: (blobUrl: string, cropData?: CropData) => {
		const { pendingResolve } = get()
		if (pendingResolve) {
			pendingResolve({ blobUrl, cropData })
		}
		set({
			isOpen: false,
			imageUrl: null,
			cropData: null,
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

		revokeBlobUrls()
		set({
			isOpen: false,
			imageUrl: null,
			cropData: null,
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
