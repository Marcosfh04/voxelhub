import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import assetService from '../features/assets/assetService';
import Spinner from '../components/Spinner';
import Slider from 'react-slick'; // Importar React Slick
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import '../css/AssetDetail.css';

function AssetDetail() {
    const { id } = useParams();
    const [asset, setAsset] = useState(null);
    const [loading, setLoading] = useState(true);
    const [nuevoComentario, setNuevoComentario] = useState('');
    const [enviando, setEnviando] = useState(false);
    const [mostrarTodos, setMostrarTodos] = useState(false);
    

    

    const { user } = useSelector((state) => state.auth);

    useEffect(() => {
        const fetchAsset = async () => {
            try {
                const data = await assetService.getAssetById(id);
                setAsset(data);
            } catch (err) {
                console.error('Error al obtener asset:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchAsset();
    }, [id]);

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
        } catch (err) {
            console.error('Error al enviar comentario:', err);
        } finally {
            setEnviando(false);
        }
    };

    const extraerIdGoogle = (url) => {
        const match = url.match(/id=([a-zA-Z0-9_-]+)/);
        return match ? match[1] : '';
    };

    const descargarDesdeGoogleDrive = () => {
        const id = extraerIdGoogle(asset.assetUrl);
        if (!id) {
            alert('No se pudo encontrar el ID del archivo.');
            return;
        }

        const link = document.createElement('a');
        link.href = `https://drive.google.com/uc?export=download&id=${id}`;
        link.download = asset.title || 'asset';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    if (loading) return <Spinner />;
    if (!asset) return <p>No se ha encontrado el asset.</p>;

    // Configuración del carrusel
    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: true,
    };

    return (
        <div className="asset-detail-card">
            <div className="asset-image-section">
                {/* Mostrar carrusel solo si hay más de una imagen */}
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
                    /* Mostrar una sola imagen si no hay más de una */
                    <img
                        src={`https://lh3.googleusercontent.com/d/${extraerIdGoogle(asset.images?.[0] || asset.previewImage)}=s512`}
                        alt={asset.title}
                        className="asset-detail-image"
                    />
                )}

                {/* Mostrar reproductor de audio si el asset es de tipo audio */}
                {asset.type === 'audio' && asset.assetUrl && (
    <div className="audio-player">
        {console.log('URL del audio:', asset.assetUrl)}
        <audio controls>
            <source src={asset.assetUrl} />
            Tu navegador no soporta el elemento de audio. 
            <a href={asset.assetUrl} target="_blank" rel="noopener noreferrer">
                Escuchar aquí
            </a>
        </audio>
    </div>
)}

                <div className="asset-actions">
                    <button className="icon-button" title="Compartir">
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
            </div>

            <div className="asset-info-section">
                <h2>
                    Asset {asset.type.toUpperCase()} – {asset.title}
                </h2>
                <p>
                    <strong>Descripción:</strong>
                    <br />
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

                <div className="asset-comments">
                    <h3>Comentarios</h3>

                    {asset.comments
                        ?.slice(0, mostrarTodos ? asset.comments.length : 2)
                        .map((comentario, index) => (
                            <div key={index} className="comentario">
                                <p>
                                    <strong>
                                        {comentario.user?.name || 'Usuario'}:
                                    </strong>{' '}
                                    {comentario.text}
                                </p>
                            </div>
                        ))}

                    {asset.comments?.length > 2 && (
                        <button
                            className="btn-ver-mas"
                            onClick={() => setMostrarTodos(!mostrarTodos)}
                        >
                            {mostrarTodos ? 'Ver menos' : 'Ver más'}
                        </button>
                    )}

                    {/* Formulario siempre visible */}
                    {user && (
                        <form
                            onSubmit={handleSubmit}
                            className="form-comentario"
                        >
                            <textarea
                                rows={2}
                                value={nuevoComentario}
                                onChange={(e) =>
                                    setNuevoComentario(e.target.value)
                                }
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