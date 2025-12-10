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
	defaultRatio?: number;
	onSave: (blob: Blob) => void;
	onError?: (error: string) => void;
};

export const ResizeImageModal = forwardRef<ImageResizerModalRef, CropperContentProps>(
	({ children, imageSrc, defaultRatio, onSave, onError }, ref) => {
		const isDesktop = useMediaQuery('(min-width: 768px)');
		const [open, setOpen] = useState(false);
		const [currentImageSrc, setCurrentImageSrc] = useState(imageSrc);
		const [lockedRatio, setLockedRatio] = useState<number | undefined>(defaultRatio);

		const service = useMachine(imageCropper.machine, {
			id: useId(),
			aspectRatio: lockedRatio,
		});

		const api = imageCropper.connect(service, normalizeProps);

		if (currentImageSrc !== imageSrc) {
			setCurrentImageSrc(imageSrc);
		}

		useImperativeHandle(ref, () => ({
			handleShow: (path?: string) => {
				if (path) {
					setCurrentImageSrc(path);
				}
				setLockedRatio(defaultRatio);
				setOpen(true);
			},
			handleHide: () => {
				setOpen(false);
			},
			isOpen: open,
		}), [open, defaultRatio]);

		const handleSave = async () => {
			try {
				console.log("🔄 Iniciando save da imagem...");
				const result = await api.getCroppedImage();
				console.log("📦 Resultado do crop:", result);

				if (result instanceof Blob) {
					console.log("✅ Blob gerado com sucesso");
					console.log("📊 Tamanho:", result.size, "bytes");
					console.log("📝 Tipo:", result.type);
					onSave(result);
					setOpen(false);
				} else if (typeof result === 'string') {
					console.log("🔗 Resultado é uma URL, convertendo para blob...");
					fetch(result)
						.then(res => res.blob())
						.then(blob => {
							console.log("✅ Blob convertido com sucesso");
							console.log("📊 Tamanho:", blob.size, "bytes");
							console.log("📝 Tipo:", blob.type);
							onSave(blob);
							setOpen(false);
						})
						.catch((err) => {
							console.error("❌ Erro ao converter URL para blob:", err);
							onError?.("Failed to convert image");
						});
				} else {
					console.error("❌ Resultado inválido:", result);
					onError?.("Failed to generate image blob");
				}
			} catch (error) {
				console.error("❌ Erro ao fazer crop:", error);
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

								<div {...api.getSelectionProps()} className="left-0">
									{imageCropper.handles.map((position) => (
										<div
											key={position}
											{...api.getHandleProps({ position })}
										>
											<span className="bg-red-500" />
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
						<DialogFooter className="pt-4 flex justify-between">
							<div className="flex gap-2">
								{defaultRatio && (
									<Button
										type="button"
										variant={lockedRatio === defaultRatio ? "default" : "secondary"}
										onClick={() => {
											setLockedRatio(lockedRatio === defaultRatio ? undefined : defaultRatio);
										}}
									>
										{lockedRatio === defaultRatio ? "🔒 Proporção Travada" : "🔓 Liberar Proporção"}
									</Button>
								)}
							</div>
							<div className="flex gap-2">
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
								>
									Salvar
								</Button>
							</div>
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
					<DrawerFooter className="pt-4 flex flex-col gap-2">
						{defaultRatio && (
							<Button
								type="button"
								variant={lockedRatio === defaultRatio ? "default" : "secondary"}
								onClick={() => {
									setLockedRatio(lockedRatio === defaultRatio ? undefined : defaultRatio);
								}}
							>
								{lockedRatio === defaultRatio ? "🔒 Proporção Travada" : "🔓 Liberar Proporção"}
							</Button>
						)}
						<div className="flex gap-2">
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
							>
								Salvar
							</Button>
						</div>
					</DrawerFooter>
				</DrawerContent>
			</Drawer>
		);
	}
);

ResizeImageModal.displayName = "ResizeImageModal";