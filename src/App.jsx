import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'

import Home from './pages/Home/Home';
import Register from './pages/auth/Register';
import Login from './pages/auth/Login';
import Navigation from './components/Navbar';
import Perfil from './pages/Perfil/Perfil';
import AccountSettings from './pages/AccountSettings/AccountSettings';
import CreatePost from './pages/CreatePost/CreatePost';
import DetalhesDoPost from './pages/DetalhesDoPost/DetalhesDoPost';
import Favorites from './pages/Favorites/Favorites';
import UserDetails from './pages/UserDetails/UserDetails';

import { useAuth } from './context/AuthContext';
import './App.css';

function App() {

  const { user, loading } = useAuth();

  if (loading) return <div>Carregando...</div>

  return (
    <div>
      <BrowserRouter>
        <Navigation />
        <Routes>
          <Route path='/BlogTech' element={<Home />} />
          <Route path='/perfil' element={user ? <Perfil /> : <Navigate to='/login' />} />
          <Route path='/userdetails/:userId' element={user ? <UserDetails /> : <Navigate to='/login' />} />
          <Route path='/favorites' element={user ? <Favorites /> : <Navigate to='/login' />} />
          <Route path='/register' element={user ? <Navigate to='/BlogTech' /> : <Register />} />
          <Route path='/login' element={user ? <Navigate to='/BlogTech' /> : <Login />} />
          <Route path='/settings' element={user ? <AccountSettings /> : <Navigate to='/login' />} />
          <Route path='/createpost' element={user ? <CreatePost /> : <Navigate to='/login' />} />
          <Route path='/postdetails/:postId' element={user ? <DetalhesDoPost /> : <Navigate to='/login' />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App
