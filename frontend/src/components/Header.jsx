import { FaSignInAlt, FaSignOutAlt, FaUser, FaUpload } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout, reset } from '../features/auth/authSlice';
import '../css/Header.css';
import { useState } from 'react';

function Header() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const [searchTerm, setSearchTerm] = useState('');

  const onLogout = () => {
    dispatch(logout());
    dispatch(reset());
    navigate('/');
  };

  const handleUploadClick = () => {
    if (user) {
      navigate('/subir');
    } else {
      navigate('/login');
    }
  };

  const handleProfileClick = () => {
    navigate('/perfil');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?q=${searchTerm}`);
      setSearchTerm('');
    }
  };

  return (
    <header className="header">
      <div className="logo">
        <Link to="/">VoxelHub</Link>
      </div>
      <form className="search-bar" onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Buscar..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button type="submit">Buscar</button>
      </form>
      
      <ul>
        <li>
          <Link to="/categories">
            Categorías
          </Link>
        </li>
        <li>
          <button className="btn" onClick={handleUploadClick}>
            <FaUpload /> Subir Asset
          </button>
        </li>

        {user ? (
          <>
            <li>
              <button className="btn" onClick={handleProfileClick}>
                <FaUser /> {user.name}
              </button>
            </li>
            <li>
              <button className="btn" onClick={onLogout}>
                <FaSignOutAlt /> Logout
              </button>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link to="/login">
                <FaSignInAlt /> Login
              </Link>
            </li>
            <li>
              <Link to="/register">
                <FaUser /> Register
              </Link>
            </li>
          </>
        )}
      </ul>

    </header>
  );
}

export default Header;