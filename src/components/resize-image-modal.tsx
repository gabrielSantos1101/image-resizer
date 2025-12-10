import { useState } from "react";
import { useMediaQuery } from "../lib/use-mediaquery";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTrigger } from "./ui/dialog";
import { Drawer, DrawerContent, DrawerFooter, DrawerHeader, DrawerTrigger } from "./ui/drawer";

export type ImageResizerModalRef = {
    handleShow: (path?: string) => void;
};

type CropperContentProps = {
    imageSrc: string;
    defaultAspect?: number;
    onSave: (blob: Blob) => void;
    onRotate: () => void;
    onReset: () => void;
};


export const ResizeImageModal = () => {
    const isDesktop = useMediaQuery('(min-width: 768px)');
    const [open, setOpen] = useState(false)

    if (isDesktop) {
        return (
            <Dialog
                open={open}
                onOpenChange={(open) => {
                    setOpen(open);
                }}
            >
                <DialogContent className="max-w-[56.25rem] max-h-[90vh] overflow-y-auto">
                    <DialogHeader className="pb-0">
                        <h3 className="text-md">
                            Gerenciar Mídias do Banner
                        </h3>
                    </DialogHeader>

                    <DialogFooter>
                        <Button
                            type="submit"
                            variant="default"
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
            }}
        >
            <DrawerContent className="px-2 max-h-[90vh] overflow-y-auto">
                <DrawerHeader>
                    <h3 className="text-md">Gerenciar Mídias do Banner</h3>
                </DrawerHeader>

                <DrawerFooter>
                    <Button
                        type="submit"
                        variant="default"
                    >
                        Salvar
                    </Button>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    );
}