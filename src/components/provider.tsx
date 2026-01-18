'use client'

import React from 'react'
import { ImageResizerDialog } from './resize-image-dialog'

/**
 * ImageResizerProvider Component
 * 
 * Provides global access to the image resizer functionality using Zustand for state management.
 * Simply place this component once in your application (typically in your root layout or main App).
 * 
 * The provider manages the image resizer dialog globally, allowing you to trigger
 * the resizer from anywhere in your application using the resizeImage function.
 * 
 * @example
 * ```typescript
 * import { ImageResizerProvider } from '@/lib'
 * 
 * export default function RootLayout() {
 *   return (
 *     <html>
 *       <body>
 *         <ImageResizerProvider />
 *         <YourApp />
 *       </body>
 *     </html>
 *   )
 * }
 * ```
 */
export const ImageResizerProvider: React.FC = () => {
    return <ImageResizerDialog />
}

ImageResizerProvider.displayName = 'ImageResizerProvider'

