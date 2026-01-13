'use client'

import React, { useEffect } from 'react'
import { ImageResizerDialog } from './components/image-resizer-dialog'
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
}) => {
    // Initialize store with provider-level defaults
    useEffect(() => {
        // Store initialization is handled by the store itself
        // This effect is here for future initialization logic if needed
    }, [])

    return (
        <>
            {children}
            <ImageResizerDialog />
        </>
    )
}

ImageResizerProvider.displayName = 'ImageResizerProvider'

