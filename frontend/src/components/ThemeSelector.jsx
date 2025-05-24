import { useState, useEffect } from 'react';
import '../css/ThemeSelector.css';
import { FaPalette } from 'react-icons/fa';

function ThemeSelector() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentTheme, setCurrentTheme] = useState('dark');

  // Cargar tema guardado al iniciar
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    setCurrentTheme(savedTheme);
    applyTheme(savedTheme);
  }, []);

  const togglePanel = () => {
    setIsOpen(!isOpen);
  };

  const selectTheme = (theme) => {
    setCurrentTheme(theme);
    localStorage.setItem('theme', theme);
    applyTheme(theme);
    setIsOpen(false);
  };

  const applyTheme = (theme) => {
    // Eliminar todas las clases de tema anteriores
    document.body.classList.remove('theme-dark', 'theme-light', 'theme-protanopia', 'theme-tritanopia');
    // Aplicar la nueva clase de tema
    document.body.classList.add(`theme-${theme}`);
  };

  return (
    <div className="theme-selector-container">
      <button 
        className="theme-toggle-button"
        onClick={togglePanel}
        aria-label="Cambiar tema"
      >
        <FaPalette />
      </button>
      
      {isOpen && (
        <div className="theme-panel">
          <h3>Seleccionar Tema</h3>
          <div className="theme-options">
            <button 
              className={`theme-option ${currentTheme === 'dark' ? 'active' : ''}`}
              onClick={() => selectTheme('dark')}
            >
              <div className="color-preview dark-preview"></div>
              <span>Oscuro</span>
            </button>
            
            <button 
              className={`theme-option ${currentTheme === 'light' ? 'active' : ''}`}
              onClick={() => selectTheme('light')}
            >
              <div className="color-preview light-preview"></div>
              <span>Claro</span>
            </button>
            
            <button 
              className={`theme-option ${currentTheme === 'protanopia' ? 'active' : ''}`}
              onClick={() => selectTheme('protanopia')}
            >
              <div className="color-preview protanopia-preview"></div>
              <span>Protanopia</span>
            </button>
            
            <button 
              className={`theme-option ${currentTheme === 'tritanopia' ? 'active' : ''}`}
              onClick={() => selectTheme('tritanopia')}
            >
              <div className="color-preview tritanopia-preview"></div>
              <span>Tritanopia</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ThemeSelector;