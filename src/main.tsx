import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { ImageResizerProvider } from './components/provider.tsx'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ImageResizerProvider />
    <App />
  </StrictMode>,
)
