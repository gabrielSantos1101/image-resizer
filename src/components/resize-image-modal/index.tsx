import * as imageCropper from "@zag-js/image-cropper";
import { normalizeProps, useMachine } from "@zag-js/react";
import { forwardRef, useId, useImperativeHandle, useState } from "react";
import { useMediaQuery } from "../../lib/use-mediaquery";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTrigger } from "../ui/dialog";
import { Drawer, DrawerContent, DrawerFooter, DrawerHeader, DrawerTrigger } from "../ui/drawer";
import "./styles.css";

export type ImageResizerModalRef = {
	handleShow: (path?: string) => void;
	handleHide: () => void;
	isOpen: boolean;
};

type CropperContentProps = {
	children: React.ReactNode;
	imageSrc: string;
	defaultAspect?: number;
	onSave: (blob: Blob) => void;
	onError?: (error: string) => void;
};

export const ResizeImageModal = forwardRef<ImageResizerModalRef, CropperContentProps>(
	({ children, imageSrc, defaultAspect, onSave, onError }, ref) => {
		const isDesktop = useMediaQuery('(min-width: 768px)');
		const [open, setOpen] = useState(false);
		const [currentImageSrc, setCurrentImageSrc] = useState(imageSrc);
		const [imageLoaded, setImageLoaded] = useState(false);

		const service = useMachine(imageCropper.machine, {
			id: useId(),
			aspectRatio: defaultAspect,
		});

		const api = imageCropper.connect(service, normalizeProps);

		if (currentImageSrc !== imageSrc) {
			setCurrentImageSrc(imageSrc);
			setImageLoaded(false);
		}

		useImperativeHandle(ref, () => ({
			handleShow: (path?: string) => {
				if (path) {
					setCurrentImageSrc(path);
					setImageLoaded(false);
				}
				setOpen(true);
			},
			handleHide: () => {
				setOpen(false);
				setImageLoaded(false);
			},
			isOpen: open,
		}), [open]);

		const handleSave = async () => {
			try {
				const result = await api.getCroppedImage();
				if (result instanceof Blob) {
					onSave(result);
					setOpen(false);
				} else if (typeof result === 'string') {
					fetch(result)
						.then(res => res.blob())
						.then(blob => {
							onSave(blob);
							setOpen(false);
						})
						.catch(() => onError?.("Failed to convert image"));
				} else {
					onError?.("Failed to generate image blob");
				}
			} catch (error) {
				onError?.("Failed to crop image: " + (error as Error).message);
			}
		};

		const renderContent = () => {
			return (
				<div className="modal-cropper-container" style={{ padding: '20px 0' }}>
					<div className="flex-1 min-h-0 relative bg-black/5 rounded-lg overflow-hidden flex items-center justify-center">
						<div {...api.getRootProps()}>
							<div {...api.getViewportProps()}>
								<img
									src="https://picsum.photos/seed/crop/640/400"
									crossOrigin="anonymous"
									{...api.getImageProps()}
								/>

								<div {...api.getSelectionProps()}>
									{imageCropper.handles.map((position) => (
										<div
											key={position}
											{...api.getHandleProps({ position })}
										>
											<span />
										</div>
									))}
								</div>
							</div>
						</div>
					</div>
				</div>
			);
		};

		if (isDesktop) {
			return (
				<Dialog
					open={open}
					onOpenChange={(open) => {
						setOpen(open);
						if (!open) {
							setImageLoaded(false);
						}
					}}
				>
					<DialogTrigger asChild>{children}</DialogTrigger>
					<DialogContent className="max-w-4xl w-full max-h-[95vh] overflow-hidden" forceMount>
						<DialogHeader className="pb-4">
							<h3 className="text-lg font-semibold">
								Gerenciar Mídias do Banner
							</h3>
						</DialogHeader>
						<div className="overflow-y-auto max-h-[calc(95vh-120px)]">
							{renderContent()}
						</div>
						<DialogFooter className="pt-4">
							<Button
								type="button"
								variant="outline"
								onClick={() => setOpen(false)}
							>
								Cancelar
							</Button>
							<Button
								type="button"
								variant="default"
								onClick={handleSave}
								disabled={!imageLoaded}
							>
								Salvar
							</Button>
						</DialogFooter>
					</DialogContent>
				</Dialog>
			);
		}

		return (
			<Drawer
				open={open}
				onOpenChange={(open) => {
					setOpen(open);
					if (!open) {
						setImageLoaded(false);
					}
				}}
			>
				<DrawerTrigger asChild>{children}</DrawerTrigger>
				<DrawerContent className="px-4 max-h-[95vh] overflow-hidden" forceMount>
					<DrawerHeader>
						<h3 className="text-lg font-semibold">Gerenciar Mídias do Banner</h3>
					</DrawerHeader>
					<div className="overflow-y-auto max-h-[calc(95vh-140px)]">
						{renderContent()}
					</div>
					<DrawerFooter className="pt-4">
						<Button
							type="button"
							variant="outline"
							onClick={() => setOpen(false)}
						>
							Cancelar
						</Button>
						<Button
							type="button"
							variant="default"
							onClick={handleSave}
							disabled={!imageLoaded}
						>
							Salvar
						</Button>
					</DrawerFooter>
				</DrawerContent>
			</Drawer>
		);
	}
);

ResizeImageModal.displayName = "ResizeImageModal";