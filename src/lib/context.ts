import { createContext } from 'react'
import type { ImageResizerContextType } from './types'

/**
 * React Context for the Image Resizer Toast Library
 * 
 * This context provides access to the image resizer functionality throughout
 * the application. It should be used with the ImageResizerProvider component.
 * 
 * @internal Use the useImageResizer hook instead of accessing this context directly
 */
export const ImageResizerContext = createContext<ImageResizerContextType | undefined>(undefined)

ImageResizerContext.displayName = 'ImageResizerContext'
