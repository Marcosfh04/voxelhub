import PropTypes from 'prop-types';
import '../css/VideoPlayer.css';

const VideoPlayer = ({ driveUrl }) => {
    const extractGoogleDriveId = (url) => {
        if (!url) return null;
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

    const fileId = extractGoogleDriveId(driveUrl);
    const proxyUrl = fileId ? `/api/proxy/stream-video/${fileId}` : null;

    if (!proxyUrl) {
        return <p>Error: No se pudo procesar la URL del video.</p>;
    }

    return (
        <div className="video-player-container">
            <video controls width="100%" height="auto">
                <source src={proxyUrl} type="video/mp4" />
                Tu navegador no soporta la reproducción de video.
            </video>
        </div>
    );
};

VideoPlayer.propTypes = {
    driveUrl: PropTypes.string.isRequired,
};

export default VideoPlayer;