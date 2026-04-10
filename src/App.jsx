import { useState, useEffect } from 'react'
import './App.css'

const API_KEY = '6360d7da'
const BASE_URL = 'https://www.omdbapi.com/'

function MovieCard({ movie, onClick }) {
  return (
    <div className="movie-card" onClick={() => onClick(movie)}>
      <img 
        src={movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/300x450?text=No+Poster'} 
        alt={movie.Title}
        className="movie-poster"
      />
      <div className="movie-info">
        <h3 className="movie-title">{movie.Title}</h3>
        <p className="movie-year">{movie.Year}</p>
        <p className="movie-type">{movie.Type}</p>
      </div>
    </div>
  )
}

function MovieDetails({ movie, onClose }) {
  const [details, setDetails] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const response = await fetch(`${BASE_URL}?i=${movie.imdbID}&apikey=${API_KEY}`)
        const data = await response.json()
        setDetails(data)
      } catch (error) {
        console.log('Error fetching details:', error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchDetails()
  }, [movie.imdbID])

  if (loading) {
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>×</button>
        {details && (
          <div className="details-container">
            <img 
              src={details.Poster !== 'N/A' ? details.Poster : 'https://via.placeholder.com/300x450?text=No+Poster'} 
              alt={details.Title}
              className="details-poster"
            />
            <div className="details-info">
              <h2>{details.Title}</h2>
              <p><strong>Year:</strong> {details.Year}</p>
              <p><strong>Rated:</strong> {details.Rated}</p>
              <p><strong>Runtime:</strong> {details.Runtime}</p>
              <p><strong>Genre:</strong> {details.Genre}</p>
              <p><strong>Director:</strong> {details.Director}</p>
              <p><strong>Actors:</strong> {details.Actors}</p>
              <p><strong>Plot:</strong> {details.Plot}</p>
              <p><strong>IMDb Rating:</strong> {details.imdbRating}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function App() {
  const [searchQuery, setSearchQuery] = useState('')
  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [selectedMovie, setSelectedMovie] = useState(null)

  const searchMovies = async () => {
    if (!searchQuery.trim()) {
      setError('Please enter a movie name')
      return
    }

    setLoading(true)
    setError('')
    
    try {
      const response = await fetch(`${BASE_URL}?s=${searchQuery}&apikey=${API_KEY}`)
      const data = await response.json()
      
      if (data.Response === 'True') {
        setMovies(data.Search)
      } else {
        setMovies([])
        setError(data.Error || 'No movies found')
      }
    } catch (err) {
      setError('Something went wrong. Please try again.')
      console.log('Error:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    searchMovies()
  }

  return (
    <div className="app">
      <header className="header">
        <h1>Movie Browser</h1>
        <p>Search for your favorite movies and TV shows</p>
      </header>

      <div className="search-section">
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Search for movies..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
          <button type="submit" className="search-btn">
            Search
          </button>
        </form>
      </div>

      {error && <p className="error-message">{error}</p>}

      {loading && <p className="loading-message">Loading...</p>}

      <div className="movies-container">
        {movies.length > 0 ? (
          <div className="movies-grid">
            {movies.map((movie) => (
              <MovieCard 
                key={movie.imdbID} 
                movie={movie} 
                onClick={setSelectedMovie}
              />
            ))}
          </div>
        ) : (
          !loading && !error && (
            <div className="empty-state">
              <p>Search for movies to see results here</p>
            </div>
          )
        )}
      </div>

      {selectedMovie && (
        <MovieDetails 
          movie={selectedMovie} 
          onClose={() => setSelectedMovie(null)}
        />
      )}
    </div>
  )
}

export default App
