import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Partners from './components/Partners.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Partners />
  </StrictMode>,
)
