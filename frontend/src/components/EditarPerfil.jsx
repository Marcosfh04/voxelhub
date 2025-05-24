import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import { updateUser, logout } from '../features/auth/authSlice'; // Importa logout
import '../css/EditarPerfil.css';

function EditarPerfil() {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    profileImage: user?.profileImage || '',
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
  });

  const [subiendoImagen, setSubiendoImagen] = useState(false);
  const [previewImage, setPreviewImage] = useState(user?.profileImage || '');

  const { name, email, profileImage } = formData;
  const { currentPassword, newPassword } = passwordData;

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const onPasswordChange = (e) => {
    setPasswordData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const subirImagen = async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      setSubiendoImagen(true);
      const res = await axios.post('https://backend-42r2.onrender.com/api/drive/upload', formData)

      setFormData((prevState) => ({
        ...prevState,
        profileImage: res.data.url,
      }));
      setPreviewImage(res.data.url);
      toast.success('Imagen de perfil subida correctamente');
    } catch (err) {
      toast.error('Error al subir la imagen de perfil');
    } finally {
      setSubiendoImagen(false);
    }
  };

  const onImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
      subirImagen(file);
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();

    const updatedUser = {
      name,
      email,
      profileImage,
      currentPassword,
      newPassword,
    };

    dispatch(updateUser(updatedUser))
      .unwrap()
      .then(() => {
        toast.success('Perfil actualizado correctamente');
        dispatch(logout()); // Cierra sesión después de guardar los cambios
        navigate('/login'); // Redirige al login
      })
      .catch((err) => {
        toast.error('Error al actualizar el perfil');
      });
  };

  return (
    <div>
      <h1>Editar Perfil</h1>
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label>Nombre</label>
          <input
            type="text"
            name="name"
            value={name}
            onChange={onChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={email}
            onChange={onChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Contraseña actual</label>
          <input
            type="password"
            name="currentPassword"
            value={currentPassword}
            onChange={onPasswordChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Nueva contraseña</label>
          <input
            type="password"
            name="newPassword"
            value={newPassword}
            onChange={onPasswordChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Foto de perfil</label>
          <div
            className="asset-upload-box"
            onClick={() => document.getElementById('profileInput').click()}
          >
            {previewImage ? (
              <img
                src={previewImage}
                alt="Previsualización"
                style={{ maxWidth: '100%', borderRadius: '8px' }}
              />
            ) : (
              <>
                <i className="fas fa-image fa-3x"></i>
                <p>Selecciona una imagen</p>
              </>
            )}
          </div>
          <input
            id="profileInput"
            type="file"
            accept="image/*"
            onChange={onImageChange}
            style={{ display: 'none' }}
          />
          {subiendoImagen && <p>Subiendo imagen...</p>}
        </div>
        <button type="submit" className="btn btn-primary">
          Guardar Cambios
        </button>
      </form>
    </div>
  );
}

export default EditarPerfil;