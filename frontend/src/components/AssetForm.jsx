import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { createAsset } from '../features/assets/assetSlice'

function AssetForm() {
  const [form, setForm] = useState({
    title: '',
    description: '',
    type: '2D',
    previewImage: '',
    assetUrl: '',
  })

  const dispatch = useDispatch()

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    dispatch(createAsset(form))
    setForm({
      title: '',
      description: '',
      type: '2D',
      previewImage: '',
      assetUrl: '',
    })
  }

  return (
    <section className='form'>
      <form onSubmit={handleSubmit}>
        <h2>Subir nuevo Asset</h2>
        <input type='text' name='title' placeholder='Título' value={form.title} onChange={handleChange} required />
        <textarea name='description' placeholder='Descripción' value={form.description} onChange={handleChange} required />
        <select name='type' value={form.type} onChange={handleChange}>
          <option value='2D'>2D</option>
          <option value='3D'>3D</option>
          <option value='audio'>Audio</option>
          <option value='video'>Video</option>
          <option value='code'>Código</option>
          <option value='other'>Otro</option>
        </select>
        <input type='url' name='previewImage' placeholder='URL imagen (Drive)' value={form.previewImage} onChange={handleChange} required />
        <input type='url' name='assetUrl' placeholder='URL asset (Drive)' value={form.assetUrl} onChange={handleChange} required />
        <button type='submit' className='btn btn-block'>Guardar</button>
      </form>
    </section>
  )
}

export default AssetForm
