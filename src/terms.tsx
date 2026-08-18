import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import UserAgreement from './components/UserAgreement.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <UserAgreement />
  </StrictMode>,
)
