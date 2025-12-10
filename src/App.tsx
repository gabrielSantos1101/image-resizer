import * as imageCropper from "@zag-js/image-cropper";
import { normalizeProps, useMachine } from "@zag-js/react";
import { useId, useRef, useState } from "react";
import { ResizeImageModal, type ImageResizerModalRef } from "./components/resize-image-modal";


function App() {
  const modalRef = useRef<ImageResizerModalRef>(null);
  const [croppedImage, setCroppedImage] = useState<string | null>(null);
  const service = useMachine(imageCropper.machine, {
    id: useId(),
    fixedCropArea: true
  });

  const api = imageCropper.connect(service, normalizeProps);

  const handleSave = (blob: Blob) => {
    console.log("📊 Tamanho do arquivo:", (blob.size / 1024).toFixed(2), "KB");
    console.log("📦 Blob completo:", blob);
    const imageUrl = URL.createObjectURL(blob);
    setCroppedImage(imageUrl);
  };

  return (
    <main className="dark p-8 space-y-4">
      <h1 className="text-2xl font-bold text-white">Image Resizer Test</h1>

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

      <ResizeImageModal
        ref={modalRef}
        imageSrc="https://picsum.photos/seed/crop/640/400"
        defaultRatio={16 / 9}
        onSave={handleSave}
        onError={(error) => console.error("Error:", error)}
      >
        <button className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded">
          Open with Trigger (16:9 Aspect)
        </button>
      </ResizeImageModal>

      {croppedImage && (
        <div className="mt-8 p-4 bg-gray-900 rounded-lg border border-gray-700">
          <h2 className="text-xl font-bold text-white mb-4">📸 Preview da Imagem Recortada</h2>
          <div className="flex flex-col gap-4">
            <img
              src={croppedImage}
              alt="Imagem recortada"
              className="max-w-full h-auto rounded-lg border border-gray-600"
            />
            <button
              onClick={() => setCroppedImage(null)}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded w-fit"
            >
              Limpar Preview
            </button>
          </div>
        </div>
      )}
    </main>
  )
}

export default App
