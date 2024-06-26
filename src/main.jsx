import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import 'bootstrap/dist/css/bootstrap.min.css';
import { RegisterProvider } from './context/RegisterContext.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <RegisterProvider>
        <App />
      </RegisterProvider>
    </AuthProvider>
  </React.StrictMode>,
)
