import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import assetService from '../features/assets/assetService';
import Spinner from '../components/Spinner';
import Slider from 'react-slick';
import AudioPlayer from '../components/AudioPlayer'; // Importar el nuevo componente
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import '../css/AssetDetail.css';
import VideoPlayer from '../components/VideoPlayer'; // Importar el nuevo componente


function AssetDetail() {
  const { id } = useParams();
  const [asset, setAsset] = useState(null);
  const [loading, setLoading] = useState(true);
  const [nuevoComentario, setNuevoComentario] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [mostrarTodos, setMostrarTodos] = useState(false);
  const [copied, setCopied] = useState(false);
  const [rating, setRating] = useState(0);
  const [hasRated, setHasRated] = useState(false);
  const [isVoting, setIsVoting] = useState(false);

  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchAsset = async () => {
      try {
        const data = await assetService.getAssetById(id);
        console.log('Asset recibido:', data); // Depuración: Verificar el asset completo
        setAsset(data);
        if (data.ratings.some((r) => r.user === user?._id)) {
          setHasRated(true);
        }
      } catch (err) {
        console.error('Error al obtener asset:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAsset();
  }, [id, user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nuevoComentario.trim()) return;

    try {
      setEnviando(true);
      const token = user.token;
      const comentariosActualizados = await assetService.comentarAsset(
        id,
        { text: nuevoComentario },
        token
      );
      setAsset({ ...asset, comments: comentariosActualizados });
      setNuevoComentario('');
      window.location.reload();
    } catch (err) {
      console.error('Error al enviar comentario:', err);
    } finally {
      setEnviando(false);
    }
  };

  const handleShare = () => {
    const url = `${window.location.origin}/assets/${id}`; // Construir la URL del asset
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true); // Mostrar el mensaje de confirmación
      setTimeout(() => setCopied(false), 2000); // Ocultar el mensaje después de 2 segundos
    });
  };


  const extraerIdGoogle = (url) => {
    if (!url) return '';
    console.log('URL para extraer ID:', url); // Depuración: Verificar la URL recibida
    const idMatch = url.match(/[?&]id=([a-zA-Z0-9_-]+)/i);
    if (idMatch) return idMatch[1];
    const dMatch = url.match(/\/d\/([a-zA-Z0-9_-]+)\/?/i);
    if (dMatch) return dMatch[1];
    const ucMatch = url.match(/uc\?id=([a-zA-Z0-9_-]+)/i);
    if (ucMatch) return ucMatch[1];
    return '';
  };

  const procesarImagenPerfil = (url) => {
    console.log('URL recibida para procesar:', url); // Depuración: Verificar la URL antes de procesar
    const id = extraerIdGoogle(url);
    console.log('ID extraído:', id); // Depuración: Verificar el ID extraído
    return id
      ? `https://lh3.googleusercontent.com/d/${id}=s150`
      : 'https://dummyimage.com/150x150/cccccc/000000&text=Sin+Foto';
  };

  const descargarDesdeGoogleDrive = () => {
    if (asset.assetUrl) {
      window.open(asset.assetUrl, '_blank'); // Abre la URL en una nueva pestaña
    } else {
      console.error('No se encontró la URL del asset para descargar.');
    }
  };

  const handleRating = (value) => {
    if (!hasRated) {
      setRating(value);
    }
  };

  const submitRating = async () => {
    if (rating > 0) {
      try {
        await assetService.rateAsset(id, { value: rating }, user.token);
        setHasRated(true);
        window.location.reload(); // Recargar para actualizar las valoraciones
      } catch (err) {
        console.error('Error al enviar valoración:', err);
      }
    }
  };


  if (loading) return <Spinner />;
  if (!asset) return <p>No se ha encontrado el asset.</p>;

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
  };

  const totalRatings = asset.ratings.length;
  const averageRating = totalRatings > 0
  ? Number((asset.ratings.reduce((sum, r) => sum + r.value, 0) / totalRatings).toFixed(1))
  : 0;

  return (
    <div className="asset-detail-card">
      <div className="asset-image-section">
        {asset.images && asset.images.length > 1 ? (
          <Slider {...settings} className="carousel">
            {asset.images.map((img, index) => (
              <div key={index}>
                <img
                  src={`https://lh3.googleusercontent.com/d/${extraerIdGoogle(img)}=s512`}
                  alt={`Imagen ${index + 1}`}
                  className="carousel-image"
                />
              </div>
            ))}
          </Slider>
        ) : (
          <img
            src={`https://lh3.googleusercontent.com/d/${extraerIdGoogle(asset.images?.[0] || asset.previewImage)}=s512`}
            alt={asset.title}
            className="asset-detail-image"
          />
        )}

        {asset.type === 'audio' && asset.assetUrl && (
          <div className="audio-player-wrapper">
            <AudioPlayer driveUrl={asset.assetUrl} />
          </div>
        )}
        {asset.type === 'video' && asset.assetUrl && (
          <div className="video-player-wrapper">
            <VideoPlayer driveUrl={asset.assetUrl} />
          </div>
        )}

        <div className="asset-actions">
          <button className="icon-button" title="Compartir" onClick={handleShare}>
            <i className="fas fa-share-alt"></i>
          </button>
          {asset.assetUrl && (
            <button
              className="icon-button"
              title="Descargar Asset"
              onClick={descargarDesdeGoogleDrive}
            >
              <i className="fas fa-download"></i>
            </button>
          )}
        </div>
        {copied && <p className="copied-message">¡URL copiada al portapapeles!</p>} {/* Mensaje de confirmación */}
      </div>

      <div className="asset-info-section">
        <h2>
          Asset {asset.type.toUpperCase()} – {asset.title}
        </h2>
        <p>
          <strong>Descripción: </strong>
          {asset.description}
        </p>
        <p>
          <strong>Autor:</strong> {asset.user?.name}
        </p>
        <p>
          <strong>Fecha de publicación:</strong>{' '}
          {new Date(asset.createdAt).toLocaleDateString()}
        </p>

        <p>
          <strong>Categoria:</strong> {asset.type}
        </p>
        <div className="rating-section">
          <p>Hay {totalRatings} valoraciones (Media: {averageRating})</p>
          <div className="stars">
            {[1, 2, 3, 4, 5].map((star) => {
              const isHalfStar = !Number.isInteger(averageRating) && Math.ceil(averageRating) === star;
              const isSelected = star <= rating; // Determina si la estrella está seleccionada por el usuario

              // Mostrar estrellas según el estado de votación
              const starClass = isVoting
                ? isSelected
                  ? 'fa-star filled'
                  : 'fa-star'
                : isHalfStar
                ? 'fa-star half-filled'
                : star <= averageRating
                ? 'fa-star filled'
                : 'fa-star';

              return (
                <i
                  key={star}
                  className={`fas ${starClass}`}
                  onClick={() => {
                    if (!hasRated) {
                      setIsVoting(true); // Activar el estado de votación
                      handleRating(star);
                    }
                  }}
                  style={{ cursor: hasRated ? 'not-allowed' : 'pointer' }}
                ></i>
              );
            })}
          </div>
          {!hasRated && (
            <button onClick={submitRating} disabled={rating === 0}>
              Enviar valoración
            </button>
          )}
      </div>
      
        <div className="asset-comments">
          <h3>Comentarios</h3>

          {asset.comments
            ?.slice(0, mostrarTodos ? asset.comments.length : 2)
            .map((comentario, index) => {
              console.log('Comentario:', comentario); // Depuración: Verificar el comentario completo
              console.log('Imagen de perfil:', comentario.user?.profileImage); // Depuración: Verificar la imagen de perfil
              return (
                <div key={index} className="comentario">
                  <div className="comentario-header">
                    <img
                      src={procesarImagenPerfil(comentario.user?.profileImage)}
                      alt={comentario.user?.name || 'Usuario'}
                      className="comentario-imagen"
                    />
                    <p>
                      <strong>{comentario.user?.name || 'Usuario'}:</strong>{' '}
                      {comentario.text}
                    </p>
                  </div>
                </div>
              );
            })}

          {asset.comments?.length > 2 && (
            <button
              className="btn-ver-mas"
              onClick={() => setMostrarTodos(!mostrarTodos)}
            >
              {mostrarTodos ? 'Ver menos' : 'Ver más'}
            </button>
          )}

          {user && (
            <form onSubmit={handleSubmit} className="form-comentario">
              <textarea
                rows={2}
                value={nuevoComentario}
                onChange={(e) => setNuevoComentario(e.target.value)}
                placeholder="Escribe tu comentario..."
                required
              />
              <button type="submit" disabled={enviando}>
                {enviando ? 'Enviando...' : 'Comentar'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default AssetDetail;