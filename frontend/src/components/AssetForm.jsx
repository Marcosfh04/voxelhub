import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { createAsset } from '../features/assets/assetSlice'
import { toast } from 'react-toastify'

function AssetForm() {
  const [form, setForm] = useState({
    title: '',
    description: '',
    type: '2D',
    previewImage: '',
    assetUrl: '',
  })

  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.auth)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
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
      .catch(() => toast.error('Error al subir el asset'))
  }

  if (!user) {
    return <p>Debes iniciar sesión para subir un asset.</p>
  }

  return (
    <section className='form'>
      <form onSubmit={handleSubmit}>
        <h2>Subir nuevo Asset</h2>

        <label>Título</label>
        <input type='text' name='title' value={form.title} onChange={handleChange} required placeholder='Ej: Modelo 3D de espada' />

        <label>Descripción</label>
        <textarea name='description' value={form.description} onChange={handleChange} required placeholder='Breve descripción del asset' />

        <label>Tipo</label>
        <select name='type' value={form.type} onChange={handleChange}>
          <option value='2D'>2D</option>
          <option value='3D'>3D</option>
          <option value='audio'>Audio</option>
          <option value='video'>Video</option>
          <option value='code'>Código</option>
          <option value='other'>Otro</option>
        </select>

        <label>Imagen descriptiva (URL pública de Google Drive o FTP)</label>
        <input type='url' name='previewImage' value={form.previewImage} onChange={handleChange} required placeholder='https://drive.google.com/...' />

        <label>URL del asset (Google Drive, Dropbox, FTP...)</label>
        <input type='url' name='assetUrl' value={form.assetUrl} onChange={handleChange} required placeholder='https://...' />

        <button type='submit' className='btn btn-block'>Subir Asset</button>
      </form>
    </section>
  )
}

export default AssetForm
