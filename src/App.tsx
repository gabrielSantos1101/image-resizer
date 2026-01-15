import { useState } from "react";
import { Button } from "./components/ui/button";
import { ImageResizerProvider, resizeImage } from "./lib";

/**
 * AppContent component that uses the resizeImage function
 */
function AppContent() {
  const [croppedImage, setCroppedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleResizeImage = () => {
    setIsLoading(true);
    resizeImage('https://files.curseduca.com/f6ccf6de9e56976a4b4032a16e5019e294221b00/8c777108.JPG', {
      classNames: {
        dialog: "",
        separator: "",
        controls: 'hidden'
      }
    })
      .then((blobUrl: string) => {
        console.log("✅ Imagem redimensionada com sucesso:", blobUrl);
        setCroppedImage(blobUrl);
      })
      .catch((error: Error) => {
        console.error("❌ Erro ao redimensionar imagem:", error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <main className="w-dvw h-dvh flex flex-col items-center justify-center py-14 px-8 space-y-4">
      <h1 className="text-4xl font-bold text-white">Image Resizer Test</h1>

      <Button
        className="text-white"
        onClick={handleResizeImage}
        disabled={isLoading}
      >
        {isLoading ? "Processando..." : "Recortar Imagem"}
      </Button>

      {
        croppedImage && (
          <div className="mt-8 p-4 bg-gray-900 rounded-lg border border-gray-700">
            <h2 className="text-xl font-bold text-white mb-4">📸 Preview da Imagem Recortada</h2>
            <div className="flex flex-col gap-4">
              <div>
                <img
                  src={croppedImage}
                  alt="Imagem recortada"
                  className="rounded-lg aspect-auto max-h-[50dvh] max-w-[70dvw] w-auto border border-gray-600"
                />
              </div>
              <button
                onClick={() => setCroppedImage(null)}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded w-fit"
              >
                Limpar Preview
              </button>
            </div>
          </div>
        )
      }
    </main >
  );
}

/**
 * Main App component
 * The ImageResizerProvider is placed at the root to make the image resizer
 * globally accessible from any component
 */
function App() {
  return (
    <>
      <ImageResizerProvider />
      <AppContent />
    </>
  );
}

export default App
