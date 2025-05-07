import { FaSignInAlt, FaSignOutAlt, FaUser, FaUpload, FaBars } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout, reset } from '../features/auth/authSlice';
import '../css/Header.css';
import { useState, useEffect, useRef } from 'react';

function Header() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const [searchTerm, setSearchTerm] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const navRef = useRef(null);
  const menuButtonRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        navRef.current &&
        !navRef.current.contains(event.target) &&
        menuButtonRef.current &&
        !menuButtonRef.current.contains(event.target)
      ) {
        setMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [navRef, menuButtonRef]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 1100) {
        setMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const onLogout = () => {
    dispatch(logout());
    dispatch(reset());
    navigate('/');
    setMenuOpen(false);
  };

  const handleUploadClick = () => {
    if (user) {
      navigate('/subir');
    } else {
      navigate('/login');
    }
    setMenuOpen(false);
  };

  const handleProfileClick = () => {
    navigate('/perfil');
    setMenuOpen(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?q=${searchTerm}`);
      setSearchTerm('');
    }
  };

  const toggleMenu = () => {
    setMenuOpen(prevState => !prevState);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <header className="header">
      <div className="header-top">
        <div className="left">
          <div className="logo-container">
            <div className="logo">
              <Link to="/">VoxelHub</Link>
            </div>
          </div>
        </div>

        <div className="center">
          <form className="search-bar" onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Buscar..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button type="submit">Buscar</button>
          </form>
        </div>

        <div className="right">
          <button
            ref={menuButtonRef}
            className="menu-toggle"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            <FaBars />
          </button>
        </div>
      </div>


      <div className={`nav-container ${menuOpen ? 'active' : ''}`} ref={navRef}>
        <ul className="nav-menu">
          <li>
            <button className="btn" onClick={() => navigate('/categories')}>
              Categorías
            </button>
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
                <Link to="/login" onClick={closeMenu}>
                  <FaSignInAlt /> Login
                </Link>
              </li>
              <li>
                <Link to="/register" onClick={closeMenu}>
                  <FaUser /> Register
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </header>
  );
}

export default Header;