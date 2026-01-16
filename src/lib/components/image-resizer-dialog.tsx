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
        ...config,
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

            // Use Zag's getCroppedImage() API to get the blob with all transformations applied
            let croppedImage: Blob | string | null = null
            try {
                croppedImage = await api.getCroppedImage()
            } catch (error) {
                const cropError = new Error("Failed to get cropped image from Zag API")
                console.error(cropError.message, error)
                cancel(cropError)
                return
            }

            if (!croppedImage) {
                const error = new Error("Failed to create blob from cropped image")
                console.error(error.message)
                cancel(error)
                return
            }

            // Convert to Blob if it's a data URL string
            let blob: Blob
            if (typeof croppedImage === 'string') {
                const response = await fetch(croppedImage)
                blob = await response.blob()
            } else {
                blob = croppedImage
            }

            // Extract crop data using Zag's getCropData() API
            const cropData = api.getCropData()
            if (!cropData) {
                const error = new Error("Failed to extract crop data from Zag API")
                console.error(error.message)
                cancel(error)
                return
            }

            try {
                const blobUrl = URL.createObjectURL(blob)
                addBlobUrl(blobUrl)
                save(blobUrl, cropData)
            } catch (error) {
                const blobError = error instanceof Error ? error : new Error("Failed to process blob")
                console.error(blobError.message)
                cancel(blobError)
            }
        } catch (error) {
            const unexpectedError = error instanceof Error ? error : new Error("Unknown error occurred during image cropping")
            console.error("Unexpected error cropping image:", unexpectedError)
            cancel(unexpectedError)
        }
    }, [imageUrl, api, save, cancel, addBlobUrl])

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
                <div className="p-4 flex flex-col">
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
