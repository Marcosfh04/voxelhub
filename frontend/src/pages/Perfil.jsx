import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import assetService from '../features/assets/assetService'; // Asegúrate de tener un servicio para obtener los assets

function Perfil() {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const [assets, setAssets] = useState([]);
  const [mostrarTodos, setMostrarTodos] = useState(false);

  useEffect(() => {
    const fetchUserAssets = async () => {
      if (user) {
        try {
          const userAssets = await assetService.getUserAssets(user.token); // Llama al servicio para obtener los assets del usuario
          console.log('Assets recibidos:', userAssets); // Verifica la estructura de los datos
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
    <div>
      <h1>Perfil de {user.name}</h1>
      <img
        src={profileImage}
        alt="Foto de perfil"
        style={{ width: '150px', borderRadius: '50%' }}
      />
      <p>Email: {user.email}</p>
      <button onClick={() => navigate('/editar-perfil')} className="btn">
        Editar Perfil
      </button>

      <h2>Mis Assets</h2>
      {assets.length === 0 ? (
        <p>No has subido ningún asset todavía.</p>
      ) : (
        <div>
          {Array.isArray(assets) && assets
            .slice(0, mostrarTodos ? assets.length : 5)
            .map((asset, index) => (
              <div key={index} className="asset-item">
                <h3>{asset.title}</h3>
                <p>{asset.description}</p>
                <button onClick={() => navigate(`/assets/${asset._id}`)} className="btn">
                  Ver Detalles
                </button>
              </div>
            ))}
          {assets.length > 5 && (
            <button
              className="btn"
              onClick={() => setMostrarTodos(!mostrarTodos)}
            >
              {mostrarTodos ? 'Ver menos' : 'Ver más'}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default Perfil;