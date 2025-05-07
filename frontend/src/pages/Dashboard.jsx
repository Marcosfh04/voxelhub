import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getAssets, reset } from '../features/assets/assetSlice'
import AssetItem from '../components/AssetItem'
import Spinner from '../components/Spinner'
import '../dashboard.css'

function Dashboard() {
  const dispatch = useDispatch()
  const { assets, isLoading, isError, message } = useSelector((state) => state.assets)

  const categorias = ['3D', '2D', 'audio', 'video', 'code', 'other']
  const [visibleCategories, setVisibleCategories] = useState(
    categorias.reduce((acc, categoria) => {
      acc[categoria] = true // Todas las categorías visibles por defecto
      return acc
    }, {})
  )

  useEffect(() => {
    if (isError) console.error(message)
    dispatch(getAssets())
    return () => dispatch(reset())
  }, [dispatch, isError, message])

  if (isLoading) return <Spinner />

  const toggleCategoryVisibility = (categoria) => {
    setVisibleCategories((prev) => ({
      ...prev,
      [categoria]: !prev[categoria], // Alternar visibilidad
    }))
  }

  return (
    <section className='dashboard'>
      {categorias.map((categoria) => {
        const assetsFiltrados = assets.filter((a) => a.type === categoria)
        if (assetsFiltrados.length === 0) return null

        return (
          <div key={categoria} className='categoria-bloque'>
            <button
              className='categoria-titulo'
              onClick={() => toggleCategoryVisibility(categoria)}
            >
              {categoria.toUpperCase()} {visibleCategories[categoria] ? '↓' : '→'}
            </button>
            {visibleCategories[categoria] && (
              <div className='categoria-scroll'>
                {assetsFiltrados.map((asset) => (
                  <AssetItem key={asset._id} asset={asset} />
                ))}
              </div>
            )}
          </div>
        )
      })}
    </section>
  )
}

export default Dashboard