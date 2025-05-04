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

      </Routes>
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
