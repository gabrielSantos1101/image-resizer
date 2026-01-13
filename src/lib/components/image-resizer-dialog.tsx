"use client"

import { Button } from "@/components/ui/button"
import { Dialog, DialogClose, DialogContent } from "@/components/ui/dialog"
import * as imageCropper from "@zag-js/image-cropper"
import { normalizeProps, useMachine } from "@zag-js/react"
import { FlipHorizontal, FlipVertical, RotateCw, ZoomIn, ZoomOut } from "lucide-react"
import { useCallback, useEffect, useId, useRef, useState } from "react"
import "../styles/image-resizer-dialog.css"
import type { ImageResizerStyles } from "../types"

/**
 * Props for the ImageResizerDialog component
 */
export interface ImageResizerDialogProps {
    /**
     * Whether the dialog is currently open
     */
    isOpen: boolean

    /**
     * The URL of the image to resize
     */
    imageUrl: string | null

    /**
     * Callback when the user saves the cropped image
     * @param blob - The cropped image as a Blob
     */
    onSave: (blob: Blob) => void

    /**
     * Callback when the user cancels the operation
     */
    onCancel: () => void

    /**
     * Custom styles configuration for the dialog UI
     */
    styles?: ImageResizerStyles
}

/**
 * ImageResizerDialog Component
 * 
 * A modal dialog component that provides image cropping and resizing functionality.
 * Supports zoom, rotation, and flip operations with customizable styling.
 * 
 * @example
 * ```typescript
 * <ImageResizerDialog
 *   isOpen={isOpen}
 *   imageUrl={imageUrl}
 *   onSave={(blob) => console.log('Saved:', blob)}
 *   onCancel={() => setIsOpen(false)}
 *   styles={{ dialog: { className: 'custom-dialog' } }}
 * />
 * ```
 */
export const ImageResizerDialog = ({
    isOpen,
    imageUrl,
    onSave,
    onCancel,
    styles,
}: ImageResizerDialogProps) => {
    const id = useId()
    const imageRef = useRef<HTMLImageElement>(null)
    const [machineKey, setMachineKey] = useState(0)

    const service = useMachine(imageCropper.machine, {
        id: `${id}-${machineKey}`,
        minZoom: 1,
        maxZoom: 3,
    })

    const api = imageCropper.connect(service, normalizeProps)

    // Reset machine key when image URL changes
    useEffect(() => {
        if (isOpen && imageUrl) {
            setMachineKey((prev: number) => prev + 1)
        }
    }, [isOpen, imageUrl])

    const handleSave = useCallback(async () => {
        try {
            if (!imageUrl) {
                console.error("No image URL provided")
                return
            }

            const selectionEl = document.querySelector('[data-scope="image-cropper"][data-part="selection"]') as HTMLElement
            const imageEl = document.querySelector('[data-scope="image-cropper"][data-part="image"]') as HTMLImageElement

            if (!selectionEl || !imageEl) {
                console.error("Cropper elements not found")
                return
            }

            const selectionRect = selectionEl.getBoundingClientRect()
            const imageRect = imageEl.getBoundingClientRect()

            const relX = selectionRect.left - imageRect.left
            const relY = selectionRect.top - imageRect.top
            const relWidth = selectionRect.width
            const relHeight = selectionRect.height

            const scaleX = imageEl.naturalWidth / imageRect.width
            const scaleY = imageEl.naturalHeight / imageRect.height

            const cropX = Math.max(0, relX * scaleX)
            const cropY = Math.max(0, relY * scaleY)
            const cropWidth = Math.min(relWidth * scaleX, imageEl.naturalWidth - cropX)
            const cropHeight = Math.min(relHeight * scaleY, imageEl.naturalHeight - cropY)

            const canvas = document.createElement("canvas")
            canvas.width = cropWidth
            canvas.height = cropHeight
            const ctx = canvas.getContext("2d")

            if (!ctx) {
                console.error("Failed to create canvas context")
                return
            }

            const img = new Image()
            img.crossOrigin = "anonymous"

            await new Promise<void>((resolve, reject) => {
                img.onload = () => resolve()
                img.onerror = reject
                img.src = imageUrl
            })

            ctx.drawImage(img, cropX, cropY, cropWidth, cropHeight, 0, 0, cropWidth, cropHeight)

            canvas.toBlob(
                (blob) => {
                    if (blob) {
                        onSave(blob)
                    }
                },
                "image/png",
                0.92,
            )
        } catch (error) {
            console.error("Error cropping image:", error)
        }
    }, [imageUrl, onSave])

    const handleOpenChange = (open: boolean) => {
        if (!open) {
            onCancel()
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
            <DialogContent
                className={styles?.dialog?.className}
                style={styles?.dialog?.style}
            >
                <div className="p-4">
                    {imageUrl && isOpen && (
                        <div key={machineKey} {...api.getRootProps()} className="relative w-full">
                            <div
                                className="flex-1 min-h-0 relative bg-black/5 rounded-lg overflow-hidden flex items-center justify-center"
                                {...(styles?.viewport?.className && { className: styles.viewport.className })}
                                style={styles?.viewport?.style}
                            >
                                <div {...api.getRootProps()}>
                                    <div {...api.getViewportProps()}>
                                        <img
                                            ref={imageRef}
                                            key={machineKey}
                                            src={imageUrl}
                                            alt="Image for cropping"
                                            crossOrigin="anonymous"
                                            {...api.getImageProps()}
                                        />

                                        <div
                                            {...api.getSelectionProps()}
                                            {...(styles?.selection?.className && { className: styles.selection.className })}
                                            style={styles?.selection?.style}
                                        >
                                            {imageCropper.handles.map((position) => (
                                                <div
                                                    key={position}
                                                    {...api.getHandleProps({
                                                        position
                                                    })}
                                                    {...(styles?.handle?.className && { className: styles.handle.className })}
                                                    style={styles?.handle?.style}
                                                >
                                                    <span className="bg-red-500" />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Controls */}
                    <div
                        className="flex items-center justify-center gap-2 mt-4"
                        {...(styles?.controls?.className && { className: styles.controls.className })}
                        style={styles?.controls?.style}
                    >
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => api.zoomBy(-0.1)}
                            title="Zoom out"
                            {...(styles?.button?.className && { className: styles.button.className })}
                            style={styles?.button?.style}
                        >
                            <ZoomOut className="w-4 h-4" />
                        </Button>
                        <span className="text-sm text-muted-foreground min-w-[60px] text-center">
                            {Math.round(api.zoom * 100)}%
                        </span>
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => api.zoomBy(0.1)}
                            title="Zoom in"
                            {...(styles?.button?.className && { className: styles.button.className })}
                            style={styles?.button?.style}
                        >
                            <ZoomIn className="w-4 h-4" />
                        </Button>
                        <div className="w-px h-6 bg-border mx-2" />
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => api.rotateBy(90)}
                            title="Rotate 90°"
                            {...(styles?.button?.className && { className: styles.button.className })}
                            style={styles?.button?.style}
                        >
                            <RotateCw className="w-4 h-4" />
                        </Button>
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => api.flipHorizontally()}
                            title="Flip horizontally"
                            {...(styles?.button?.className && { className: styles.button.className })}
                            style={styles?.button?.style}
                        >
                            <FlipHorizontal className="w-4 h-4" />
                        </Button>
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => api.flipVertically()}
                            title="Flip vertically"
                            {...(styles?.button?.className && { className: styles.button.className })}
                            style={styles?.button?.style}
                        >
                            <FlipVertical className="w-4 h-4" />
                        </Button>
                    </div>
                </div>

                <div className="flex items-center justify-end gap-3 p-4">
                    <DialogClose asChild>
                        <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button className="bg-primary dark:bg-primary text-white" onClick={handleSave}>
                        Save Crop
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}

ImageResizerDialog.displayName = "ImageResizerDialog"
