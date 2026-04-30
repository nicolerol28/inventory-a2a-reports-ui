import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'

const requiredEnvVars = ['VITE_API_URL', 'VITE_REPORTS_API_URL'];
const missing = requiredEnvVars.filter(k => !import.meta.env[k]);
if (missing.length > 0) {
  throw new Error(`Missing required env vars: ${missing.join(', ')}`);
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
)