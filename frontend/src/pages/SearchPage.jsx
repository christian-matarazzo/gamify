import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useWish } from '../context/WishlistContext';
import GameCard from '../components/GameCard';
import GhostCard from '../components/GhostCard';
import "../styles/SearchPage.css";
import { Link } from 'react-router-dom';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000';

export default function SearchPage() {
  const { wish, handleWish } = useWish();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const urlQuery = searchParams.get('query') || '';
  const urlSort = searchParams.get('sort') || 'title';
  const [inputValue, setInputValue] = useState(urlQuery);
  useEffect(() => {
    setInputValue(urlQuery);
  }, [urlQuery]);
  const fetchSearchResults = useCallback(async (query, sort) => {
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.get(`${API_BASE_URL}/api/games/search`, {
        params: { 
          query: query.trim(),
          sort 
        },
        timeout: 10000,
        paramsSerializer: params => {
          return new URLSearchParams(
            Object.entries(params).map(([key, value]) => [key, String(value)])
          ).toString();
        }
      });
      
      if (response.data?.success) {
        setGames(response.data.results);
      } else {
        throw new Error(response.data?.message || 'Errore nella ricerca');
      }
    } catch (err) {
      
      if (err.code === 'ERR_NETWORK') {
        setError('Impossibile connettersi al server. Backend in esecuzione su localhost:3000?');
      } else if (err.response?.status === 404) {
        setError('Endpoint non trovato. Verifica route /api/games/search');
      } else {
        setError(err.message || 'Impossibile caricare i risultati');
      }
      setGames([]);
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => {
    console.log('🚀 Initial fetch with:', { query: urlQuery, sort: urlSort }); 
    fetchSearchResults(urlQuery, urlSort);
  }, []);
  const handleQueryChange = (e) => {
    const newQuery = e.target.value;
    setInputValue(newQuery); 
    debouncedUpdateUrlAndFetch(newQuery, urlSort); 
  };
  
  const handleSortChange = (e) => {
    const newSort = e.target.value;
    updateUrlAndFetch(inputValue, newSort);
  };
  
  const debounceTimerRef = useRef(null);
  const debouncedUpdateUrlAndFetch = (query, sort) => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    debounceTimerRef.current = setTimeout(() => {
      updateUrlAndFetch(query, sort);
    }, 300);
  };
  const updateUrlAndFetch = (query, sort) => {
    const params = new URLSearchParams();
    
    if (query && query.trim() !== '') {
      params.set('query', query.trim());
    }
    if (sort && sort !== 'title') {
      params.set('sort', sort);
    }
    
    setSearchParams(params);
    navigate(`?${params.toString()}`, { replace: true });
    fetchSearchResults(query, sort);
  };
  
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);
  
  const getShareableSlug = () => {
    if (!inputValue?.trim()) return 'all';
    const parts = [];
    const querySlug = inputValue.trim().toLowerCase().replace(/\s+/g, '-');
    parts.push(`query-${querySlug}`);
    if (urlSort && urlSort !== 'title') {
      parts.push(`sort-${urlSort}`);
    }
    return parts.join('-');
  };

  return (
    <main className="container py-4">
      <Link to="/" className="gamify-detail-back-btn ms-2">
        <i className="bi bi-arrow-left"></i>Back to Homepage
      </Link>
      <hr/>
      
      <div className="d-flex justify-content-between align-items-baseline mb-4">
        <h1 className="gamify-section-title mb-0">
          <span>Search</span> Games
        </h1>
        <h1 className="gamify-section-title mb-0">
          <span>Filter</span> By
        </h1>
      </div>
      
      <div className="gamify-search-bar mb-4">
        <div className="gamify-search-input-wrapper">
          <i className="bi bi-search gamify-search-icon"></i>
          <input
            type="text"
            placeholder="Search game..."
            value={inputValue}
            onChange={handleQueryChange}
            className="gamify-search-input"
            aria-label="Cerca giochi"
            autoComplete="off"
            autoCorrect="off"
            spellCheck="false"
          />
        </div>
        <select
          value={urlSort}
          onChange={handleSortChange}
          className="gamify-select"
          aria-label="Ordina risultati"
        >
          <option value="title">Sort by: Title</option>
          <option value="release_newer">Release Date: Recent</option>
          <option value="release_older">Release Date: Old</option>
          <option value="higher_price">Price: High to Low</option>
          <option value="lower_price">Price: Low to High</option>
        </select>
      </div>
      
      {!loading && !error && (
        <p className="gamify-results mb-3">
          <span>{games.length}</span> result{games.length !== 1 ? "s" : ""}
          {inputValue?.trim() && ` for "${inputValue.trim()}"`}
          <small className="ms-2 text-muted d-block">
          </small>
        </p>
      )}
      
      {error && (
        <div className="alert alert-danger" role="alert">
          <i className="bi bi-exclamation-triangle"></i> {error}
        </div>
      )}
      
      <div className="row g-3">
        {loading ? (
          [...Array(6)].map((_, i) => <GhostCard key={i} />)
        ) : games.length === 0 ? (
          <div className="text-center py-5 col-12">
            <i className="bi bi-emoji-frown display-1 text-secondary"></i>
            <p className="gamify-no-results">
              No games found{inputValue?.trim() ? ` for "${inputValue.trim()}"` : ''}.
            </p>
            {inputValue?.trim() && (
              <button 
                className="btn btn-outline-secondary"
                onClick={() => {
                  setInputValue('');
                  updateUrlAndFetch('', urlSort);
                }}
              >
                Clear search
              </button>
            )}
          </div>
        ) : (
          games.map(game => {
            const isInWishlist = wish.some(id => String(id) === String(game.id));
            return (
              <GameCard
                key={game.id}
                game={game}
                isInWishlist={isInWishlist}
                onToggleWish={() => handleWish(game.id)}
              />
            );
          })
        )}
      </div>
    </main>
  );
}