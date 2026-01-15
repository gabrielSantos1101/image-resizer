"use client"

import { Button } from "@/components/ui/button"
import { Dialog, DialogClose, DialogContent, DialogFooter } from "@/components/ui/dialog"
import * as imageCropper from "@zag-js/image-cropper"
import { normalizeProps, useMachine } from "@zag-js/react"
import { FlipHorizontal, FlipVertical, RotateCw, ZoomIn, ZoomOut } from "lucide-react"
import { useCallback, useEffect, useId } from "react"
import { useShallow } from "zustand/react/shallow"
import { useImageResizerStore } from "../store"
import "../styles/image-resizer-dialog.css"
import { cn } from "../utils"

/**
 * ImageResizerDialog Component
 * 
 * A modal dialog component that provides image cropping and resizing functionality.
 * Reads state from the Zustand store and calls store actions for save/cancel operations.
 * Supports zoom, rotation, and flip operations with customizable styling.
 * 
 * This component is connected to the global image resizer store and should be
 * rendered as a portal by the ImageResizerProvider.
 * 
 * @internal
 */
export const ImageResizerDialog = () => {
    const { isOpen, imageUrl, classNames, config, save, cancel, addBlobUrl, revokeBlobUrls } = useImageResizerStore(
        useShallow((state) => ({
            isOpen: state.isOpen,
            imageUrl: state.imageUrl,
            classNames: state.classNames,
            config: state.config,
            save: state.save,
            cancel: state.cancel,
            addBlobUrl: state.addBlobUrl,
            revokeBlobUrls: state.revokeBlobUrls,
        }))
    )

    const id = useId()
    const machineId = `${id}-${imageUrl}`

    const service = useMachine(imageCropper.machine, {
        id: machineId,
        minZoom: config.minZoom ?? 1,
        maxZoom: config.maxZoom ?? 3,
    })

    const api = imageCropper.connect(service, normalizeProps)

    useEffect(() => {
        return () => {
            if (!isOpen) {
                try {
                    revokeBlobUrls()
                } catch (error) {
                    console.error("Error during blob URL cleanup:", error)
                }
            }
        }
    }, [isOpen, revokeBlobUrls])

    const handleSave = useCallback(async () => {
        try {
            if (!imageUrl) {
                const error = new Error("No image URL provided")
                console.error(error.message)
                cancel(error)
                return
            }

            const selectionEl = document.querySelector('[data-scope="image-cropper"][data-part="selection"]') as HTMLElement
            const imageEl = document.querySelector('[data-scope="image-cropper"][data-part="image"]') as HTMLImageElement

            if (!selectionEl || !imageEl) {
                const error = new Error("Cropper elements not found")
                console.error(error.message)
                cancel(error)
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

            let ctx: CanvasRenderingContext2D | null = null
            try {
                ctx = canvas.getContext("2d")
            } catch (error) {
                const contextError = new Error("Failed to create canvas context")
                console.error(contextError.message, error)
                cancel(contextError)
                return
            }

            if (!ctx) {
                const error = new Error("Canvas context is null")
                console.error(error.message)
                cancel(error)
                return
            }

            const img = new Image()
            img.crossOrigin = "anonymous"

            try {
                await new Promise<void>((resolve, reject) => {
                    img.onload = () => resolve()
                    img.onerror = () => {
                        reject(new Error(`Failed to load image from URL: ${imageUrl}`))
                    }
                    img.src = imageUrl
                })
            } catch (error) {
                const loadError = error instanceof Error ? error : new Error("Image load failed")
                console.error(loadError.message)
                cancel(loadError)
                return
            }

            try {
                ctx.drawImage(img, cropX, cropY, cropWidth, cropHeight, 0, 0, cropWidth, cropHeight)
            } catch (error) {
                const drawError = new Error("Failed to draw image on canvas")
                console.error(drawError.message, error)
                cancel(drawError)
                return
            }

            const imageFormat = config.imageFormat ?? 'image/png'
            const imageQuality = config.imageQuality ?? 0.92

            canvas.toBlob(
                (blob) => {
                    try {
                        if (!blob) {
                            cancel(new Error("Failed to create blob from canvas"))
                            return
                        }

                        const blobUrl = URL.createObjectURL(blob)
                        // Track the blob URL for cleanup
                        addBlobUrl(blobUrl)
                        save(blobUrl)
                    } catch (error) {
                        const blobError = error instanceof Error ? error : new Error("Failed to process blob")
                        console.error(blobError.message)
                        cancel(blobError)
                    }
                },
                imageFormat,
                imageQuality,
            )
        } catch (error) {
            const unexpectedError = error instanceof Error ? error : new Error("Unknown error occurred during image cropping")
            console.error("Unexpected error cropping image:", unexpectedError)
            cancel(unexpectedError)
        }
    }, [imageUrl, config, save, cancel, addBlobUrl])

    const handleOpenChange = (open: boolean) => {
        if (!open) {
            try {
                cancel(new Error("User cancelled the resize operation"))
            } catch (error) {
                console.error("Error during cancellation:", error)
            }
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
            <DialogContent
                className={cn("max-w-[70dvw]", classNames?.dialog)}
            >
                <div className="p-4 flex">
                    {imageUrl && isOpen && (
                        <div className={cn("flex bg-black rounded-sm image-container", classNames?.imageContainer)}>
                            <div {...api.getRootProps()} className="my-auto">
                                <div {...api.getViewportProps()} className={classNames?.viewport}>
                                    <img
                                        src={imageUrl}
                                        alt="Dog to be cropped"
                                        crossOrigin="anonymous"
                                        {...api.getImageProps()}
                                    />
                                    <div {...api.getSelectionProps()} className={classNames?.selection}>
                                        {imageCropper.handles.map((position) => (
                                            <div key={position} {...api.getHandleProps({ position })} className={classNames?.handle}>
                                                <div />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Controls */}
                    <div
                        className={cn("flex items-center justify-center gap-2 mt-4", classNames?.controls)}
                    >
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => api.zoomBy(-0.1)}
                            title="Zoom out"
                            className={classNames?.button}
                        >
                            <ZoomOut className="w-4 h-4" />
                        </Button>
                        <span className={cn("text-sm text-muted-foreground min-w-[60px] text-center", classNames?.zoomDisplay)}>
                            {Math.round(api.zoom * 100)}%
                        </span>
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => api.zoomBy(0.1)}
                            title="Zoom in"
                            className={classNames?.button}
                        >
                            <ZoomIn className="w-4 h-4" />
                        </Button>
                        <div className={cn("w-px h-6 bg-border mx-2", classNames?.separator)} />
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => api.rotateBy(90)}
                            title="Rotate 90°"
                            className={classNames?.button}
                        >
                            <RotateCw className="w-4 h-4" />
                        </Button>
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => api.flipHorizontally()}
                            title="Flip horizontally"
                            className={classNames?.button}
                        >
                            <FlipHorizontal className="w-4 h-4" />
                        </Button>
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => api.flipVertically()}
                            title="Flip vertically"
                            className={classNames?.button}
                        >
                            <FlipVertical className="w-4 h-4" />
                        </Button>
                    </div>
                </div>

                <DialogFooter className={cn("flex h-fit items-baseline justify-baseline", classNames?.footer)}>
                    <DialogClose asChild>
                        <Button variant="outline" className={classNames?.cancelButton}>Cancel</Button>
                    </DialogClose>
                    <Button className={cn("bg-primary dark:bg-primary text-white", classNames?.saveButton)} onClick={handleSave}>
                        Save Crop
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

ImageResizerDialog.displayName = "ImageResizerDialog"
