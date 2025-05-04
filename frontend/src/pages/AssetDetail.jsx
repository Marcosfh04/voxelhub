import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import assetService from '../features/assets/assetService'
import Spinner from '../components/Spinner'

function AssetDetail() {
  const { id } = useParams()
  const [asset, setAsset] = useState(null)
  const [loading, setLoading] = useState(true)
  const [nuevoComentario, setNuevoComentario] = useState('')
  const [enviando, setEnviando] = useState(false)

  const { user } = useSelector((state) => state.auth)

  useEffect(() => {
    const fetchAsset = async () => {
      try {
        const data = await assetService.getAssetById(id)
        setAsset(data)
      } catch (err) {
        console.error('Error al obtener asset:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchAsset()
  }, [id])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!nuevoComentario.trim()) return

    try {
      setEnviando(true)
      const token = user.token
      const comentariosActualizados = await assetService.comentarAsset(id, { text: nuevoComentario }, token)
      setAsset({ ...asset, comments: comentariosActualizados })
      setNuevoComentario('')
    } catch (err) {
      console.error('Error al enviar comentario:', err)
    } finally {
      setEnviando(false)
    }
  }

  if (loading) return <Spinner />
  if (!asset) return <p>No se ha encontrado el asset.</p>

  return (
    <div className="asset-detail">
      <h1>{asset.title}</h1>
      <img src={asset.previewImage} alt={asset.title} />
      <p><strong>Descripción:</strong> {asset.description}</p>
      <p><strong>Tipo:</strong> {asset.type}</p>
      <p><strong>Autor:</strong> {asset.user?.name}</p>
      <p><strong>Asset URL:</strong> <a href={asset.assetURL}>{asset.assetURL}</a></p>

      <h3>Comentarios</h3>
      {asset.comments?.map((comentario, index) => (
        <div key={index}>
          <p><strong>{comentario.user?.name || 'Usuario'}:</strong> {comentario.text}</p>
        </div>
      ))}

      {user && (
        <form onSubmit={handleSubmit}>
          <textarea
            rows={3}
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
  )
}

export default AssetDetail
