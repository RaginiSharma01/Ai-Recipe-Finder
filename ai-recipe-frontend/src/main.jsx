import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/variables.css';
import './styles/globals.css';   // instead of ./index.css
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
