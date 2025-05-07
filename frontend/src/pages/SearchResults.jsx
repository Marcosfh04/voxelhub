import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import assetService from '../features/assets/assetService';
import AssetItem from '../components/AssetItem';
import Spinner from '../components/Spinner';
import '../css/SearchResults.css';

function SearchResults() {
  const location = useLocation();
  const query = new URLSearchParams(location.search).get('q');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortOption, setSortOption] = useState('recent'); // Estado para la opción seleccionada
  const [currentPage, setCurrentPage] = useState(1); // Estado para la página actual
  const resultsPerPage = 15; // Máximo de resultados por página

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const data = await assetService.searchAssets(query);
        setResults(data);
      } catch (err) {
        console.error('Error fetching search results:', err);
      } finally {
        setLoading(false);
      }
    };

    if (query) fetchResults();
  }, [query]);

  // Efecto para desplazarse hacia arriba cuando cambia la página
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  // Función para ordenar los resultados
  const sortResults = (results) => {
    switch (sortOption) {
      case 'recent':
        return [...results].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); // Más recientes
      case 'alphabetical':
        return [...results].sort((a, b) => a.title.localeCompare(b.title)); // Orden alfabético por título
      case 'category':
        return [...results].sort((a, b) => a.type.localeCompare(b.type)); // Orden alfabético por categoría
      default:
        return results;
    }
  };

  // Calcular los resultados de la página actual
  const paginatedResults = () => {
    const sortedResults = sortResults(results);
    const startIndex = (currentPage - 1) * resultsPerPage;
    const endIndex = startIndex + resultsPerPage;
    return sortedResults.slice(startIndex, endIndex);
  };

  // Calcular el número total de páginas
  const totalPages = Math.ceil(results.length / resultsPerPage);

  if (loading) return <Spinner />;

  return (
    <div className="search-results-container">
      <h1>Resultados de búsqueda para: "{query}"</h1>

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

      {results.length > 0 ? (
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
              &#8592; {/* Flecha izquierda */}
            </button>
            <span>
              Página {currentPage} de {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              &#8594; {/* Flecha derecha */}
            </button>
          </div>
        </>
      ) : (
        <p>No se encontraron resultados.</p>
      )}
    </div>
  );
}

export default SearchResults;