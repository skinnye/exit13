import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import PrivacyPolicy from './components/PrivacyPolicy.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <PrivacyPolicy />
  </StrictMode>,
)
