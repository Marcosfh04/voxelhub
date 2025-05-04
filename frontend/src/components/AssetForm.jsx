import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { createAsset } from '../features/assets/assetSlice'
import { toast } from 'react-toastify'
import axios from 'axios' 

function AssetForm() {
  const [form, setForm] = useState({
    title: '',
    description: '',
    type: '2D',
    previewImage: '',
    assetUrl: '',
  })

  const [subiendoAsset, setSubiendoAsset] = useState(false)
  const [subiendoImagen, setSubiendoImagen] = useState(false)
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.auth)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const subirArchivoADrive = async (file, campo) => {
    const formData = new FormData()
    formData.append('file', file)

    try {
      if (campo === 'assetUrl') setSubiendoAsset(true)
      if (campo === 'previewImage') setSubiendoImagen(true)

      const res = await axios.post('/api/drive/upload', formData)
      setForm((prev) => ({ ...prev, [campo]: res.data.url }))
      toast.success(`${campo === 'assetUrl' ? 'Asset' : 'Imagen'} subida correctamente`)
    } catch (err) {
      toast.error(`Error al subir ${campo === 'assetUrl' ? 'el asset' : 'la imagen'}`)
    } finally {
      setSubiendoAsset(false)
      setSubiendoImagen(false)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!form.previewImage.startsWith('http') || !form.assetUrl.startsWith('http')) {
      return toast.error('Las URLs deben empezar por http:// o https://')
    }

    dispatch(createAsset(form))
      .unwrap()
      .then(() => {
        toast.success('Asset subido correctamente')
        setForm({
          title: '',
          description: '',
          type: '2D',
          previewImage: '',
          assetUrl: '',
        })
      })
      .catch(() => toast.error('Error al guardar el asset'))
  }

  if (!user) {
    return <p>Debes iniciar sesión para subir un asset.</p>
  }

  return (
    <section className='form'>
      <form onSubmit={handleSubmit}>
        <h2>Subir nuevo Asset</h2>

        <label>Título</label>
        <input type='text' name='title' value={form.title} onChange={handleChange} required />

        <label>Descripción</label>
        <textarea name='description' value={form.description} onChange={handleChange} required />

        <label>Tipo</label>
        <select name='type' value={form.type} onChange={handleChange}>
          <option value='2D'>2D</option>
          <option value='3D'>3D</option>
          <option value='audio'>Audio</option>
          <option value='video'>Video</option>
          <option value='code'>Código</option>
          <option value='other'>Otro</option>
        </select>

        <label>Imagen descriptiva (se subirá a Drive)</label>
        <input type='file' accept='image/*' onChange={(e) => subirArchivoADrive(e.target.files[0], 'previewImage')} />
        {subiendoImagen && <p>Subiendo imagen...</p>}
        {form.previewImage && <img src={form.previewImage} alt='preview' width='150' />}

        <label>Archivo del asset</label>
        <input type='file' onChange={(e) => subirArchivoADrive(e.target.files[0], 'assetUrl')} />
        {subiendoAsset && <p>Subiendo asset...</p>}
        {form.assetUrl && (
          <p>
            <strong>Asset subido:</strong>{' '}
            <a href={form.assetUrl} target='_blank' rel='noreferrer'>
              Ver archivo
            </a>
          </p>
        )}

        <button type='submit' className='btn btn-block'>Guardar Asset</button>
      </form>
    </section>
  )
}

export default AssetForm
