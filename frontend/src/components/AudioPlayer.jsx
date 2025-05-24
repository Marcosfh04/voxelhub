// CustomAudioPlayer.jsx - Versión con estilos personalizados negro, blanco y naranja
import { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import '../css/AudioPlayer.css';


const CustomAudioPlayer = ({ driveUrl }) => {
    const [status, setStatus] = useState('loading'); // 'loading', 'ready', 'error'
    const [audioInfo, setAudioInfo] = useState({
        fileId: '',
        proxyUrl: '',
        directUrl: '',
        downloadUrl: ''
    });
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const audioRef = useRef(null);
    const maxRetries = 2;
    const [retryCount, setRetryCount] = useState(0);
    
    // Extraer ID de Google Drive de varias formas
    const extractGoogleDriveId = (url) => {
        if (!url) return null;
        
        // Intenta varios patrones de URL
        const patterns = [
            /[?&]id=([a-zA-Z0-9_-]+)/i,
            /\/d\/([a-zA-Z0-9_-]+)\/?/i,
            /\/file\/d\/([a-zA-Z0-9_-]+)\/?/i,
            /uc\?id=([a-zA-Z0-9_-]+)/i,
            /export=download&id=([a-zA-Z0-9_-]+)/i,
            /[-\w]{25,}/
        ];
        
        for (const pattern of patterns) {
            const match = url.match(pattern);
            if (match) return match[1];
        }
        
        return null;
    };
    
    // Verificar y preparar el archivo de audio
    useEffect(() => {
        const prepareAudio = async () => {
            if (!driveUrl) {
                setStatus('error');
                return;
            }
            
            try {
                const fileId = extractGoogleDriveId(driveUrl);
                
                if (!fileId) {
                    console.error('No se pudo extraer el ID de Google Drive:', driveUrl);
                    setStatus('error');
                    return;
                }
                
                // Verificar si el archivo es accesible a través del proxy
                try {
                    const checkResponse = await axios.get(`https://backend-42r2.onrender.com/api/proxy/check/${fileId}`);

                    
                    if (checkResponse.data.success) {
                        setAudioInfo({
                            fileId,
                            proxyUrl: `https://backend-42r2.onrender.com${checkResponse.data.streamUrl}`,
                            directUrl: `https://docs.google.com/uc?export=open&id=${fileId}`,
                            downloadUrl: `https://drive.google.com/uc?export=download&id=${fileId}`
                        });
                        setStatus('ready');
                        return;
                    }
                } catch (proxyError) {
                    console.log('No se pudo usar el proxy, intentando método directo:', proxyError);
                }
                
                // Método directo (fallback)
                setAudioInfo({
                    fileId,
                    directUrl: `https://docs.google.com/uc?export=open&id=${fileId}`,
                    downloadUrl: `https://drive.google.com/uc?export=download&id=${fileId}`
                });
                setStatus('ready');
                
            } catch (err) {
                console.error('Error al procesar la URL de audio:', err);
                setStatus('error');
            }
        };
        
        prepareAudio();
    }, [driveUrl]);

    // Actualizar estado de reproducción y tiempo
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        const handleTimeUpdate = () => {
            setCurrentTime(audio.currentTime);
        };

        const handleDurationChange = () => {
            setDuration(audio.duration);
        };

        const handlePlay = () => {
            setIsPlaying(true);
        };

        const handlePause = () => {
            setIsPlaying(false);
        };

        audio.addEventListener('timeupdate', handleTimeUpdate);
        audio.addEventListener('durationchange', handleDurationChange);
        audio.addEventListener('play', handlePlay);
        audio.addEventListener('pause', handlePause);

        return () => {
            audio.removeEventListener('timeupdate', handleTimeUpdate);
            audio.removeEventListener('durationchange', handleDurationChange);
            audio.removeEventListener('play', handlePlay);
            audio.removeEventListener('pause', handlePause);
        };
    }, [status]);
    
    // Manejar errores y cambiar entre fuentes de audio
    const handleError = () => {
        console.error(`Error en reproducción (intento ${retryCount + 1}/${maxRetries + 1})`);
        
        if (retryCount >= maxRetries) {
            console.error('Se alcanzó el número máximo de intentos');
            setStatus('error');
            return;
        }
        
        if (audioRef.current) {
            // Rotar entre las diferentes URLs disponibles
            switch (retryCount) {
                case 0:
                    // Si el proxy falló, intentar con la URL directa
                    audioRef.current.src = audioInfo.directUrl;
                    break;
                case 1:
                    // Si la URL directa falló, intentar con la URL de descarga
                    audioRef.current.src = audioInfo.downloadUrl;
                    break;
                default:
                    setStatus('error');
                    return;
            }
            
            setRetryCount(prev => prev + 1);
            audioRef.current.load();
            audioRef.current.play().catch(e => {
                console.error('Error en reproducción con URL alternativa:', e);
            });
        }
    };

    // Funciones de control del reproductor
    const togglePlayPause = () => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
            } else {
                audioRef.current.play();
            }
        }
    };

    const handleSliderChange = (e) => {
        const newTime = e.target.value;
        setCurrentTime(newTime);
        if (audioRef.current) {
            audioRef.current.currentTime = newTime;
        }
    };

    // Formatear tiempo en formato MM:SS
    const formatTime = (time) => {
        if (isNaN(time)) return "0:00";
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60).toString().padStart(2, '0');
        return `${minutes}:${seconds}`;
    };
    
    // Renderizado según el estado
    if (status === 'loading') {
        return (
            <div className="custom-audio-loading">
                <div className="custom-loading-spinner"></div>
                <span>Cargando...</span>
            </div>
        );
    }
    
    if (status === 'error') {
        return (
            <div className="custom-audio-container">
                <div className="custom-audio-error">
                    <p>No se pudo reproducir el audio</p>
                </div>
            </div>
        );
    }
    
    // Seleccionar la mejor URL disponible para la reproducción inicial
    const initialSource = audioInfo.proxyUrl || audioInfo.directUrl;
    
    return (
        <div className="custom-audio-container">
            {/* Audio nativo oculto para gestionar la reproducción */}
            <audio 
                ref={audioRef}
                src={initialSource}
                onError={handleError}
                preload="metadata"
                style={{ display: 'none' }}
            />
            
            {/* Interfaz personalizada */}
            <div className="custom-audio-controls">
                <button 
                    className="custom-play-button" 
                    onClick={togglePlayPause}
                    aria-label={isPlaying ? "Pausar" : "Reproducir"}
                >
                    {isPlaying ? (
                        <svg width="20" height="20" viewBox="0 0 24 24">
                            <rect x="6" y="4" width="4" height="16" fill="white" />
                            <rect x="14" y="4" width="4" height="16" fill="white" />
                        </svg>
                    ) : (
                        <svg width="20" height="20" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z" fill="white" />
                        </svg>
                    )}
                </button>
                
                <div className="custom-time-display">
                    <span className="custom-current-time">{formatTime(currentTime)}</span>
                    <span className="custom-time-separator">/</span>
                    <span className="custom-duration">{formatTime(duration)}</span>
                </div>
                
                <div className="custom-progress-container">
                    <input
                        type="range"
                        className="custom-progress-slider"
                        value={currentTime}
                        min="0"
                        max={duration || 0}
                        step="0.01"
                        onChange={handleSliderChange}
                    />
                </div>
            </div>
        </div>
    );
};

CustomAudioPlayer.propTypes = {
    driveUrl: PropTypes.string.isRequired
};

export default CustomAudioPlayer;