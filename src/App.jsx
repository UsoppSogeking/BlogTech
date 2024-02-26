import { BrowserRouter, Route, Routes } from 'react-router-dom'

import Home from './pages/Home/Home'
import Register from './pages/auth/Register'
import Login from './pages/auth/Login'
import Navigation from './components/Navbar'
import Perfil from './pages/Perfil/Perfil'

import { AuthProvider } from './context/AuthContext'

import './App.css'
import { RegisterProvider } from './context/RegisterContext'

function App() {

  return (
    <div>
      <BrowserRouter>
        <AuthProvider>
          <RegisterProvider>
            <Navigation />
            <Routes>
              <Route path='/' element={<Home />} />
              <Route path='/perfil' element={<Perfil />} />
              <Route path='/register' element={<Register />} />
              <Route path='/login' element={<Login />} />
            </Routes>
          </RegisterProvider>
        </AuthProvider>
      </BrowserRouter>
    </div>
  );
}

export default App
