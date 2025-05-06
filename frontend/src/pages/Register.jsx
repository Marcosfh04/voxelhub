import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaUser } from 'react-icons/fa';
import { register, reset } from '../features/auth/authSlice';
import Spinner from '../components/Spinner';
import axios from 'axios';
import '../css/Login.css';

function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password2: '',
    profileImage: '', // URL de la imagen subida
  });

  const { name, email, password, password2, profileImage } = formData;

  const [subiendoImagen, setSubiendoImagen] = useState(false); // Estado para la subida de imagen
  const [previewImage, setPreviewImage] = useState(''); // Estado para la previsualización

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (isError) {
      toast.error(message);
    }

    if (isSuccess || user) {
      navigate('/');
    }

    dispatch(reset());
  }, [user, isError, isSuccess, message, navigate, dispatch]);

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const subirImagen = async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      setSubiendoImagen(true);
      const res = await axios.post('/api/drive/upload', formData);
      setFormData((prevState) => ({
        ...prevState,
        profileImage: res.data.url,
      }));
      setPreviewImage(res.data.url); // Actualizar la previsualización
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
        setPreviewImage(reader.result); // Mostrar la previsualización local
      };
      reader.readAsDataURL(file);
      subirImagen(file); // Subir la imagen a Google Drive
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();

    if (password !== password2) {
      toast.error('Passwords do not match');
    } else {
      const userData = {
        name,
        email,
        password,
        profileImage, // Enviar la URL de la imagen de perfil
      };

      dispatch(register(userData));
    }
  };

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <>
      <section className="heading">
        <h1>
          <FaUser /> Registro
        </h1>
      </section>

      <section className="form">
        <form onSubmit={onSubmit}>
          <div className="form-group">
            <input
              type="text"
              className="form-control"
              id="name"
              name="name"
              value={name}
              placeholder="Enter your name"
              onChange={onChange}
            />
          </div>
          <div className="form-group">
            <input
              type="email"
              className="form-control"
              id="email"
              name="email"
              value={email}
              placeholder="Enter your email"
              onChange={onChange}
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              className="form-control"
              id="password"
              name="password"
              value={password}
              placeholder="Enter password"
              onChange={onChange}
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              className="form-control"
              id="password2"
              name="password2"
              value={password2}
              placeholder="Confirm password"
              onChange={onChange}
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
          <div className="form-group">
            <button type="submit" className="btn-btn-block">
              Submit
            </button>
          </div>
        </form>
      </section>
    </>
  );
}

export default Register;