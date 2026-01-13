'use client'

import React, { useCallback, useEffect } from 'react'
import { ImageResizerDialog } from './components/image-resizer-dialog'
import { useImageResizerStore } from './store'
import type { ImageResizerProviderProps } from './types'

/**
 * ImageResizerProvider Component
 * 
 * Wraps your application to provide global access to the image resizer functionality.
 * Uses Zustand for global state management, allowing the image resizer to be triggered
 * from anywhere in the application without prop drilling.
 * 
 * Place this at the root of your application or around the components that need
 * to use the image resizer.
 * 
 * @example
 * ```typescript
 * import { ImageResizerProvider } from '@/lib'
 * 
 * export default function App() {
 *   return (
 *     <ImageResizerProvider>
 *       <YourApp />
 *     </ImageResizerProvider>
 *   )
 * }
 * ```
 */
export const ImageResizerProvider: React.FC<ImageResizerProviderProps> = ({
    children,
    styles,
}) => {
    // Subscribe to store state
    const isOpen = useImageResizerStore((state) => state.isOpen)
    const imageUrl = useImageResizerStore((state) => state.imageUrl)
    const storeStyles = useImageResizerStore((state) => state.styles)
    const save = useImageResizerStore((state) => state.save)
    const cancel = useImageResizerStore((state) => state.cancel)

    /**
     * Initialize store with provider-level default styles and config
     * These can be overridden when calling the hook
     */
    useEffect(() => {
        // Store the provider-level defaults for use when no overrides are provided
        // This is handled by the store's open() action
    }, [])

    /**
     * Called when the user saves the cropped image
     * Converts the blob to a blob URL and resolves the promise
     * 
     * @internal Used by ImageResizerDialog component
     */
    const handleSave = useCallback((blob: Blob) => {
        const blobUrl = URL.createObjectURL(blob)
        save(blobUrl)
    }, [save])

    /**
     * Called when the user cancels the resize operation
     * Rejects the promise with a cancellation error
     * 
     * @internal Used by ImageResizerDialog component
     */
    const handleCancel = useCallback(() => {
        const error = new Error('Cancelled')
        cancel(error)
    }, [cancel])

    // Merge provider-level styles with store styles (store styles take precedence)
    const mergedStyles = {
        ...styles,
        ...storeStyles,
    }

    return (
        <>
            {children}
            <ImageResizerDialog
                isOpen={isOpen}
                imageUrl={imageUrl}
                onSave={handleSave}
                onCancel={handleCancel}
                styles={mergedStyles}
            />
        </>
    )
}

ImageResizerProvider.displayName = 'ImageResizerProvider'
