import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import assetService from '../features/assets/assetService';
import AssetItem from '../components/AssetItem';
import Spinner from '../components/Spinner';
import '../css/Categories.css';

function Categories() {
  const location = useLocation();
  const query = new URLSearchParams(location.search).get('q') || '';
  const [searchInput, setSearchInput] = useState(query);
  const [results, setResults] = useState([]);
  const [randomAssets, setRandomAssets] = useState([]); // Estado para assets aleatorios
  const [loading, setLoading] = useState(true);
  const [sortOption, setSortOption] = useState('recent');
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    '3D': false,
    '2D': false,
    'audio': false,
    'video': false,
    'code': false,
  });
  const resultsPerPage = 12;

  useEffect(() => {
    const fetchRandomAssets = async () => {
      try {
        const data = await assetService.getAssets(); // Obtén todos los assets
        const shuffled = data.sort(() => 0.5 - Math.random()); // Mezcla aleatoriamente
        setRandomAssets(shuffled.slice(0, resultsPerPage)); // Selecciona los primeros N aleatorios
      } catch (err) {
        console.error('Error fetching random assets:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRandomAssets();
  }, []);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        let data = await assetService.searchAssets(searchInput);

        // Aplicar filtros de categoría
        if (Object.values(filters).some((value) => value)) {
          data = data.filter((asset) => {
            if (filters['3D'] && asset.type.toLowerCase().includes('3d')) return true;
            if (filters['2D'] && asset.type.toLowerCase().includes('2d')) return true;
            if (filters['audio'] && asset.type.toLowerCase().includes('audio')) return true;
            if (filters['video'] && asset.type.toLowerCase().includes('video')) return true;
            if (filters['code'] && asset.type.toLowerCase().includes('code')) return true;
            return false;
          });
        }

        setResults(data);
      } catch (err) {
        console.error('Error fetching results:', err);
      } finally {
        setLoading(false);
      }
    };

    if (searchInput) {
      fetchResults();
    }
  }, [searchInput, filters]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  const sortResults = (results) => {
    switch (sortOption) {
      case 'recent':
        return [...results].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      case 'alphabetical':
        return [...results].sort((a, b) => a.title.localeCompare(b.title));
      case 'category':
        return [...results].sort((a, b) => a.type.localeCompare(b.type));
      default:
        return results;
    }
  };

  const paginatedResults = () => {
    const sortedResults = sortResults(results);
    const startIndex = (currentPage - 1) * resultsPerPage;
    const endIndex = startIndex + resultsPerPage;
    return sortedResults.slice(startIndex, endIndex);
  };

  const totalPages = Math.ceil(results.length / resultsPerPage);

  const handleFilterChange = (filterName) => {
    setFilters((prev) => ({
      ...prev,
      [filterName]: !prev[filterName],
    }));
    setCurrentPage(1); // Resetear a la primera página al cambiar filtros
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchInput(e.target.search.value);
    setCurrentPage(1); // Resetear a la primera página al buscar
  };

  if (loading) return <Spinner />;

  return (
    <div className="categories-container">
      <div className="categories-content">
        {/* Widget de filtro lateral */}
        <div className="filter-widget">
          <h3>Filtrar por categoría</h3>
          <div className="filter-options">
            <label>
              <input
                type="checkbox"
                checked={filters['3D']}
                onChange={() => handleFilterChange('3D')}
              />
              3D
            </label>
            <label>
              <input
                type="checkbox"
                checked={filters['2D']}
                onChange={() => handleFilterChange('2D')}
              />
              2D
            </label>
            <label>
              <input
                type="checkbox"
                checked={filters['audio']}
                onChange={() => handleFilterChange('audio')}
              />
              Audio
            </label>
            <label>
              <input
                type="checkbox"
                checked={filters['video']}
                onChange={() => handleFilterChange('video')}
              />
              Video
            </label>
            <label>
              <input
                type="checkbox"
                checked={filters['code']}
                onChange={() => handleFilterChange('code')}
              />
              Code
            </label>
          </div>
        </div>

        {/* Contenido principal */}
        <div className="categories-main">
          <h1>Explorar Categorías</h1>

          {/* Barra de búsqueda */}
          <form onSubmit={handleSearch} className="search-bar">
            <input
              type="text"
              name="search"
              placeholder="Buscar por título, descripción o autor..."
              defaultValue={searchInput}
            />
            <button type="submit">Buscar</button>
          </form>

          {/* Desplegable para ordenar */}
          <div className="sort-dropdown">
            <label htmlFor="sort">Ordenar por:</label>
            <select
              id="sort"
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
            >
              <option value="recent">Más recientes</option>
              <option value="alphabetical">Orden alfabético</option>
              <option value="category">Categorías (alfabético)</option>
            </select>
          </div>

          {searchInput || Object.values(filters).some((value) => value) ? (
            results.length > 0 ? (
              <>
                <div className="results-grid">
                  {paginatedResults().map((asset) => (
                    <AssetItem key={asset._id} asset={asset} />
                  ))}
                </div>

                <div className="pagination">
                  <button
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                  >
                    &#8592;
                  </button>
                  <span>
                    Página {currentPage} de {totalPages}
                  </span>
                  <button
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                  >
                    &#8594;
                  </button>
                </div>
              </>
            ) : (
              <p>No se encontraron resultados.</p>
            )
          ) : (
            <>
              <h2>Assets Aleatorios</h2>
              <div className="results-grid">
                {randomAssets.map((asset) => (
                  <AssetItem key={asset._id} asset={asset} />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Categories;