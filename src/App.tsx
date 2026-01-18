import { useState } from 'react'
import reactLogo from './assets/react.svg'
import { resizeImage } from './lib/resize-image'
import viteLogo from '/vite.svg'

function App() {
  const [image, setImage] = useState('')

  async function handleResizeImage() {
    const { blobUrl } = await resizeImage('https://images.unsplash.com/photo-1763839361290-4d711e42ab5f?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')
    setImage(blobUrl)

  }

  return (
    <div className='h-dvh w-dvw grid place-items-center'>
      <div className='flex flex-col items-center mx-auto'>
        <div className='flex'>
          <a href="https://vite.dev" target="_blank">
            <img src={viteLogo} className="logo" alt="Vite logo" />
          </a>
          <a href="https://react.dev" target="_blank">
            <img src={reactLogo} className="logo react" alt="React logo" />
          </a>
        </div>
        <h1>Vite + React</h1>
        <div className="flex flex-col items-center">
          <button onClick={handleResizeImage}>
            count is
          </button>
          <p>
            Edit <code>src/App.tsx</code> and save to test HMR
          </p>
        </div>
        {image && <img src={image} />}
      </div>
    </div>
  )
}

export default App
