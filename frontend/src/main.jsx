import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { registerSW } from 'virtual:pwa-register'
import './index.css'
import App from './App.jsx'

// Check for updates every hour
const updateSW = registerSW({
  onNeedRefresh() {
    if (confirm('تطبيق جديد متوفر! هل تريد التحديث؟')) {
      updateSW(true)
    }
  },
  onOfflineReady() {
    console.log('التطبيق جاهز للعمل بدون إنترنت')
  },
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
