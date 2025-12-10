import * as imageCropper from "@zag-js/image-cropper";
import { normalizeProps, useMachine } from "@zag-js/react";
import { useId, useRef } from "react";
import { ResizeImageModal, type ImageResizerModalRef } from "./components/resize-image-modal";


function App() {
  const modalRef = useRef<ImageResizerModalRef>(null);
  const service = useMachine(imageCropper.machine, {
    id: useId(),
  });

  const api = imageCropper.connect(service, normalizeProps);

  const handleSave = (blob: Blob) => {
    console.log(blob);
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
        onSave={handleSave}
        onError={(error) => console.error("Error:", error)}
      >
        <button className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded">
          Open with Trigger (16:9 Aspect)
        </button>
      </ResizeImageModal>
    </main>
  )
}

export default App
