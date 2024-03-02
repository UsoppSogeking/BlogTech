import { BrowserRouter, Route, Routes } from 'react-router-dom'

import Home from './pages/Home/Home'
import Register from './pages/auth/Register'
import Login from './pages/auth/Login'
import Navigation from './components/Navbar'
import Perfil from './pages/Perfil/Perfil'
import AccountSettings from './pages/AccountSettings/AccountSettings'
import CreatePost from './pages/CreatePost/CreatePost'

import { AuthProvider } from './context/AuthContext'
import { RegisterProvider } from './context/RegisterContext'

import './App.css'
import DetalhesDoPost from './pages/DetalhesDoPost/DetalhesDoPost'




function App() {

  return (
    <div>
      <BrowserRouter>
        <AuthProvider>
          <RegisterProvider>
            <Navigation />
            <Routes>
              <Route path='/BlogTech' element={<Home />} />
              <Route path='/perfil' element={<Perfil />} />
              <Route path='/register' element={<Register />} />
              <Route path='/login' element={<Login />} />
              <Route path='/settings' element={<AccountSettings />} />
              <Route path='/createpost' element={<CreatePost />} />
              <Route path='/postdetails/:postId' element={<DetalhesDoPost />} />
            </Routes>
          </RegisterProvider>
        </AuthProvider>
      </BrowserRouter>
    </div>
  );
}

export default App
