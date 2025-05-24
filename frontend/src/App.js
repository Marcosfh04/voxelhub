import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Header from './components/Header'
import Dashboard from './pages/Dashboard'
import Login from './pages/Login'
import Register from './pages/Register'
import AssetDetail from './pages/AssetDetail'
import AssetForm from './components/AssetForm'
import '../src/css/Header.css'
import ScrollToTop from './components/ScrollToTop'
import Perfil from './pages/Perfil'
import EditarPerfil from './components/EditarPerfil'
import EditarAsset from './components/EditarAsset'
import SearchResults from './pages/SearchResults';
import VideoPlayer from './components/VideoPlayer'
import Categories from './components/Categories'
import ThemeSelector from './components/ThemeSelector' 



function AppWrapper() {
  const location = useLocation()
  const isDashboard = location.pathname === '/'

  return (
    <div className={isDashboard ? 'container-full' : 'container'}>
      <Header />
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/assets/:id" element={<AssetDetail />} />
        <Route path='/subir' element={<AssetForm />} />
        <Route path='/perfil' element={<Perfil />} />
        <Route path='/editar-perfil' element={<EditarPerfil />} />
        <Route path='/editar-asset/:id' element={<EditarAsset />} />
        <Route path="/search" element={<SearchResults />} /> 
        <Route path="/video-player" element={<VideoPlayer driveUrl="https://drive.google.com/file/d/1a2b3c4d5e6f7g8h9i0j/view?usp=sharing" />} /> {/* Cambia la URL por la que necesites */}
        <Route path="/categories" element={<Categories />} /> {/* Cambia la URL por la que necesites */}
      </Routes>
      <ThemeSelector />
    </div>
  )
}

function App() {
  return (
    <Router>
      <AppWrapper />
      <ToastContainer />
    </Router>
  )
}

export default App
