'use client'

import React, { useCallback, useRef, useState } from 'react'
import { ImageResizerContext } from './context'
import type { ImageResizerContextType, ImageResizerProviderProps } from './types'

/**
 * ImageResizerProvider Component
 * 
 * Wraps your application to provide global access to the image resizer functionality.
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
    config,
}) => {
    const [isOpen, setIsOpen] = useState(false)
    const [imageUrl, setImageUrl] = useState<string | null>(null)
    const resolveRef = useRef<((value: string) => void) | null>(null)
    const rejectRef = useRef<((reason: Error) => void) | null>(null)

    /**
     * Opens the resizer dialog with the provided image URL
     * Returns a promise that resolves with the blob URL when the user saves,
     * or rejects if the user cancels or an error occurs
     */
    const open = useCallback((url: string): Promise<string> => {
        return new Promise((resolve, reject) => {
            resolveRef.current = resolve
            rejectRef.current = reject
            setImageUrl(url)
            setIsOpen(true)
        })
    }, [])

    /**
     * Closes the resizer dialog and cleans up state
     */
    const close = useCallback(() => {
        setIsOpen(false)
        setImageUrl(null)
        resolveRef.current = null
        rejectRef.current = null
    }, [])

    /**
     * Called when the user saves the cropped image
     * Converts the canvas to a blob and resolves the promise with the blob URL
     * 
     * @internal Used by ImageResizerDialog component
     */
    const handleSave = useCallback((blob: Blob) => {
        const blobUrl = URL.createObjectURL(blob)
        resolveRef.current?.(blobUrl)
        close()
    }, [close])

    /**
     * Called when the user cancels the resize operation
     * Rejects the promise with a cancellation error
     * 
     * @internal Used by ImageResizerDialog component
     */
    const handleCancel = useCallback(() => {
        const error = new Error('Cancelled')
        rejectRef.current?.(error)
        close()
    }, [close])

    const contextValue: ImageResizerContextType & {
        handleSave: (blob: Blob) => void
        handleCancel: () => void
    } = {
        open,
        close,
        isOpen,
        imageUrl,
        styles,
        config,
        handleSave,
        handleCancel,
    }

    return (
        <ImageResizerContext.Provider value={contextValue as ImageResizerContextType}>
            {children}
            {/* ImageResizerDialog will be rendered here as a portal */}
            {/* This will be implemented in task 4 when we refactor the modal */}
        </ImageResizerContext.Provider>
    )
}

ImageResizerProvider.displayName = 'ImageResizerProvider'
