import * as imageCropper from "@zag-js/image-cropper"
import { normalizeProps, useMachine } from "@zag-js/react"
import { useId, useState, useCallback } from "react"

function App() {
  const [src, setSrc] = useState("https://picsum.photos/seed/crop/640/400")
  const service = useMachine(imageCropper.machine, {
    id: useId(),
    image: src,
    fixedCropArea: true,
    defaultZoom: 1.25,
    minZoom: 1,
    maxZoom: 5,
    defaultRotation: 0,
    defaultFlip: { horizontal: false, vertical: false },
  })

  const api = imageCropper.connect(service, normalizeProps)

  const handleFileChange = useCallback((event) => {
    const file = event.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (e) => setSrc(e.target.result)
    reader.readAsDataURL(file)
  }, [])

  return (
    <main>
      <input type="file" accept="image/*" onChange={handleFileChange} />
      <div {...api.getRootProps()}>
        <div {...api.getViewportProps()}>
          <img
            src={src}
            crossOrigin="anonymous"
            {...api.getImageProps()}
          />

          <div {...api.getSelectionProps()}>
            {imageCropper.handles.map((position) => (
              <div key={position} {...api.getHandleProps({ position })}>
                <span />
              </div>
            ))}
          </div>
        </div>
      </div>
      <button onClick={() => api.setZoom(api.zoom - 0.1)}>-</button>
      <button onClick={() => api.setZoom(api.zoom + 0.1)}>+</button>
      <button onClick={() => api.setRotation(90)}>Rotate</button>
      <button onClick={() => api.flipHorizontally(!api.flip.horizontal)}>Flip Horizontal</button>
      <button onClick={() => api.flipVertically(!api.flip.vertical)}>Flip Vertical</button>
      <button onClick={() => api.setZoom(1.25)}>Reset Zoom</button>
      <button onClick={() => api.setRotation(0)}>Reset Rotation</button>
      <button onClick={() => api.setFlip({ horizontal: false, vertical: false })}>Reset Flip</button>

    </main>
  )
}

export default App
