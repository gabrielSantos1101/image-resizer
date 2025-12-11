"use client"

import { Button } from "@/components/ui/button"
import * as imageCropper from "@zag-js/image-cropper"
import { normalizeProps, useMachine } from "@zag-js/react"
import { FlipHorizontal, FlipVertical, RotateCw, ZoomIn, ZoomOut } from "lucide-react"
import { forwardRef, useCallback, useId, useImperativeHandle, useRef, useState } from "react"
import { Dialog, DialogClose, DialogContent } from "../ui/dialog"
import "./styles.css"

export interface ImageCropperModalRef {
	open: (imagePath: string) => void
	close: () => void
}

export interface ImageCropperModalProps {
	onCrop?: (blob: Blob) => void
}

export const ImageCropperModal = forwardRef<ImageCropperModalRef, ImageCropperModalProps>(({ onCrop }, ref) => {
	const [isOpen, setIsOpen] = useState(false)
	const [imageSrc, setImageSrc] = useState<string>("")
	const [machineKey, setMachineKey] = useState(0)
	const id = useId()
	const imageRef = useRef<HTMLImageElement>(null)

	const service = useMachine(imageCropper.machine, {
		id: `${id}-${machineKey}`,
		minZoom: 1,
		maxZoom: 3,
	})

	const api = imageCropper.connect(service, normalizeProps)

	useImperativeHandle(ref, () => ({
		open: (imagePath: string) => {
			setImageSrc(imagePath)
			setMachineKey((k) => k + 1)
			setIsOpen(true)
		},
		close: () => {
			setIsOpen(false)
			setImageSrc("")
		},
	}))

	const handleSave = useCallback(async () => {
		try {
			const imgElement = imageRef.current
			if (!imgElement) {
				console.error("Imagem não encontrada")
				return
			}

			const selectionEl = document.querySelector('[data-scope="image-cropper"][data-part="selection"]') as HTMLElement
			const imageEl = document.querySelector('[data-scope="image-cropper"][data-part="image"]') as HTMLImageElement

			if (!selectionEl || !imageEl) {
				console.error("Elementos não encontrados")
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
				console.error("Não foi possível criar contexto do canvas")
				return
			}

			const img = new Image()
			img.crossOrigin = "anonymous"

			await new Promise<void>((resolve, reject) => {
				img.onload = () => resolve()
				img.onerror = reject
				img.src = imageSrc
			})

			ctx.drawImage(img, cropX, cropY, cropWidth, cropHeight, 0, 0, cropWidth, cropHeight)

			canvas.toBlob(
				(blob) => {
					if (blob) {
						onCrop?.(blob)
						setIsOpen(false)
					}
				},
				"image/png",
				0.92,
			)
		} catch (error) {
			console.error("Erro ao recortar imagem:", error)
		}
	}, [imageSrc, onCrop])

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogContent className="md:max-w-6xl">
				<div className="p-4">
					{imageSrc && isOpen && (
						<div key={machineKey} {...api.getRootProps()} className="relative w-full">
							<div className="flex-1 min-h-0 relative bg-black/5 rounded-lg overflow-hidden flex items-center justify-center">
								<div {...api.getRootProps()}>
									<div {...api.getViewportProps()}>
										<img
											ref={imageRef}
											key={machineKey}
											src={imageSrc}
											alt="Imagem para recorte"
											crossOrigin="anonymous"
											{...api.getImageProps()}
										/>

										<div {...api.getSelectionProps()}>
											{imageCropper.handles.map((position) => (
												<div
													key={position}
													{...api.getHandleProps({
														position
													})}
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
					<div className="flex items-center justify-center gap-2 mt-4">
						<Button variant="outline" size="icon" onClick={() => api.zoomBy(-0.1)} title="Diminuir zoom">
							<ZoomOut className="w-4 h-4" />
						</Button>
						<span className="text-sm text-muted-foreground min-w-[60px] text-center">
							{Math.round(api.zoom * 100)}%
						</span>
						<Button variant="outline" size="icon" onClick={() => api.zoomBy(0.1)} title="Aumentar zoom">
							<ZoomIn className="w-4 h-4" />
						</Button>
						<div className="w-px h-6 bg-border mx-2" />
						<Button variant="outline" size="icon" onClick={() => api.rotateBy(90)} title="Rotacionar 90°">
							<RotateCw className="w-4 h-4" />
						</Button>
						<Button variant="outline" size="icon" onClick={() => api.flipHorizontally()} title="Espelhar horizontal">
							<FlipHorizontal className="w-4 h-4" />
						</Button>
						<Button variant="outline" size="icon" onClick={() => api.flipVertically()} title="Espelhar vertical">
							<FlipVertical className="w-4 h-4" />
						</Button>
					</div>
				</div>

				<div className="flex items-center justify-end gap-3 p-4">
					<DialogClose asChild>
						<Button variant="outline">Cancelar</Button>
					</DialogClose>
					<Button className="bg-primary dark:bg-primary text-white" onClick={handleSave}>Salvar Recorte</Button>
				</div>
			</DialogContent>

		</Dialog>
	)
})

ImageCropperModal.displayName = "ImageCropperModal"
