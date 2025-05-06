import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import assetService from '../features/assets/assetService'; // Servicio para obtener los assets
import '../css/Perfil.css'; // Asegúrate de tener un archivo CSS para estilos personalizados

function Perfil() {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const [assets, setAssets] = useState([]);
  const [mostrarTodos, setMostrarTodos] = useState(false);

  // Función para procesar URLs de imágenes (reutilizada del Dashboard)
  const procesarImagen = (url) => {
    if (!url) return 'https://placehold.co/150x150?text=No+Image';
    if (url.includes('drive.google.com')) {
      const id = url.split('id=')[1];
      return `https://drive.google.com/uc?id=${id}`;
    }
    return url;
  };

  useEffect(() => {
    const fetchUserAssets = async () => {
      if (user) {
        try {
          const userAssets = await assetService.getUserAssets(user.token); // Obtener los assets del usuario
          console.log('Assets recibidos en el frontend:', userAssets);
          setAssets(userAssets);
        } catch (err) {
          console.error('Error al obtener los assets del usuario:', err);
        }
      }
    };

    fetchUserAssets();
  }, [user]);

  if (!user) {
    return <p>Debes iniciar sesión para ver tu perfil.</p>;
  }

  const defaultProfileImage = 'https://dummyimage.com/150x150/cccccc/000000&text=Sin+Foto';
  const profileImage = user.profileImage || defaultProfileImage;

  return (
    <div className="perfil-container">
      <div className="perfil-header">
        <div className="perfil-info">
          <img
            src={profileImage}
            alt="Foto de perfil"
            className="perfil-imagen"
          />
          <h2>{user.name}</h2>
          <p>{user.email}</p>
          <button onClick={() => navigate('/editar-perfil')} className="btn">
            Editar Perfil
          </button>
        </div>
      </div>

      <div className="perfil-portfolio">
        <h2>Portfolio</h2>
        {assets.length === 0 ? (
          <p>No has subido ningún asset todavía.</p>
        ) : (
          <div className="portfolio-grid">
            {assets
              .slice(0, mostrarTodos ? assets.length : 6) // Mostrar 6 assets por defecto
              .map((asset, index) => (
                <div key={index} className="portfolio-item">
                  <img
                    src={procesarImagen(asset.previewImage)}
                    alt={asset.title}
                    className="portfolio-image"
                  />
                  <h3>{asset.title}</h3>
                  <button
                    onClick={() => navigate(`/assets/${asset._id}`)}
                    className="btn"
                  >
                    Ver Detalles
                  </button>
                </div>
              ))}
          </div>
        )}
        {assets.length > 6 && (
          <button
            className="btn ver-mas"
            onClick={() => setMostrarTodos(!mostrarTodos)}
          >
            {mostrarTodos ? 'Ver menos' : 'Ver más'}
          </button>
        )}
      </div>
    </div>
  );
}

export default Perfil;