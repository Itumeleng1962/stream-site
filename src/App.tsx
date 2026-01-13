import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import Header from './components/Header'
import HeroSection from './components/HeroSection'
import FilterBar from './components/FilterBar'
import CategoryGrid from './components/CategoryGrid'
import VideoPlayer from './components/VideoPlayer'
import MyList from './components/MyList'
import BrowseLanguages from './components/BrowseLanguages'
import News from './components/News'
import Login from './components/Login'
import Signup from './components/Signup'
import Profile from './components/Profile'
import LoadingSpinner from './components/LoadingSpinner'
import LandingPage from './components/LandingPage'
import { WatchlistProvider } from './context/WatchlistContext'
import { AuthProvider, useAuth } from './context/AuthContext'
import { fetchHomePageData, formatContent } from './data/tmdbData'
import './App.css'
import { tmdb } from './services/tmdb'

// Home page component
function Home({ data, searchQuery, activeFilter, onContentSelect, handleFilterChange, onSearch }: any) {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const languageFilter = searchParams.get('language');

  // Only show hero section when no search, filter, or language filter is active
  const showHero = !searchQuery && activeFilter === 'all' && !languageFilter;

  // Filter content based on language if specified
  const filteredData = languageFilter ? {
    movies: data?.movies?.filter((movie: any) => movie.original_language === languageFilter) || [],
    tvShows: data?.tvShows?.filter((show: any) => show.original_language === languageFilter) || []
  } : data;

  return (
    <>
      {showHero && data?.hero && (
        <HeroSection 
          content={data.hero} 
          onPlay={() => onContentSelect(data.hero)} 
        />
      )}
      <FilterBar 
        activeFilter={activeFilter} 
        onFilterChange={handleFilterChange}
        searchQuery={searchQuery}
        onSearch={onSearch}
      />
      {filteredData && (
        <CategoryGrid 
          content={{
            movies: filteredData.movies || [],
            tvShows: filteredData.tvShows || []
          }}
          onContentSelect={onContentSelect}
          activeFilter={activeFilter}
          searchQuery={searchQuery}
        />
      )}
      
      {/* Trending Section */}
      {data?.trending && !searchQuery && !languageFilter && (
        <div className="trending-section">
          <h2>Trending Now</h2>
          <div className="trending-content">
            {activeFilter !== 'series' && data.trending.movies.length > 0 && (
              <div className="trending-category">
                <h3>Trending Movies</h3>
                <CategoryGrid 
                  content={{
                    movies: data.trending.movies,
                    tvShows: []
                  }}
                  onContentSelect={onContentSelect}
                  activeFilter="movies"
                  searchQuery=""
                />
              </div>
            )}
            {activeFilter !== 'movies' && data.trending.tvShows.length > 0 && (
              <div className="trending-category">
                <h3>Trending TV Shows</h3>
                <CategoryGrid 
                  content={{
                    movies: [],
                    tvShows: data.trending.tvShows
                  }}
                  onContentSelect={onContentSelect}
                  activeFilter="series"
                  searchQuery=""
                />
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

// Movies page component
function Movies({ data, searchQuery, onContentSelect, onSearch }: any) {
  return (
    <>
      <FilterBar 
        activeFilter="movies" 
        onFilterChange={() => {}}
        searchQuery={searchQuery}
        onSearch={onSearch}
      />
      {data && (
        <CategoryGrid 
          content={{
            movies: data.movies || [],
            tvShows: []
          }}
          onContentSelect={onContentSelect}
          activeFilter="movies"
          searchQuery={searchQuery}
        />
      )}
    </>
  );
}

// TV Shows page component
function TVShows({ data, searchQuery, onContentSelect, onSearch }: any) {
  return (
    <>
      <FilterBar 
        activeFilter="series" 
        onFilterChange={() => {}}
        searchQuery={searchQuery}
        onSearch={onSearch}
      />
      {data && (
        <CategoryGrid 
          content={{
            movies: [],
            tvShows: data.tvShows || []
          }}
          onContentSelect={onContentSelect}
          activeFilter="series"
          searchQuery={searchQuery}
        />
      )}
    </>
  );
}

function App() {
  const [data, setData] = useState<any>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilter, setActiveFilter] = useState('all')
  const [selectedContent, setSelectedContent] = useState<any>(null)
  const [showPlayer, setShowPlayer] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setIsLoading(true)
      // Fetch paginated data for home
      const homeData = await fetchHomePageData(1) // Assuming homePage is 1 for now
      // Fetch paginated movies and tv shows
      const moviesData = await tmdb.getPopularMovies(1)
      const tvData = await tmdb.getPopularTVShows(1)
      // Format movies and tv shows to match expected structure
      const formattedMovies = await Promise.all((moviesData.results || []).map((item: any) => formatContent(item, 'movie')))
      const formattedTVShows = await Promise.all((tvData.results || []).map((item: any) => formatContent(item, 'tv')))
      setData({
        ...homeData,
        movies: formattedMovies,
        tvShows: formattedTVShows
      })
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSearch = async (query: string) => {
    setIsLoading(true)
    setSearchQuery(query)
    try {
      // Add a small delay to show loading state
      await new Promise(resolve => setTimeout(resolve, 500))
    } finally {
      setIsLoading(false)
    }
  }

  const handleFilterChange = async (filter: string) => {
    setIsLoading(true)
    setActiveFilter(filter)
    try {
      // Add a small delay to show loading state
      await new Promise(resolve => setTimeout(resolve, 500))
    } finally {
      setIsLoading(false)
    }
  }

  const handleContentSelect = (content: any) => {
    // Pass trailer as videoUrl for VideoPlayer
    setSelectedContent({ ...content, videoUrl: content.trailer })
    setShowPlayer(true)
  }

  const handleClosePlayer = () => {
    setShowPlayer(false)
    setSelectedContent(null)
  }

  return (
    <Router>
      <AuthProvider>
        <WatchlistProvider>
          <AppContent 
            data={data}
            searchQuery={searchQuery}
            activeFilter={activeFilter}
            selectedContent={selectedContent}
            showPlayer={showPlayer}
            isLoading={isLoading}
            handleSearch={handleSearch}
            handleFilterChange={handleFilterChange}
            handleContentSelect={handleContentSelect}
            handleClosePlayer={handleClosePlayer}
          />
        </WatchlistProvider>
      </AuthProvider>
    </Router>
  )
}

function AppContent({ 
  data, 
  searchQuery, 
  activeFilter, 
  selectedContent, 
  showPlayer, 
  isLoading,
  handleSearch,
  handleFilterChange,
  handleContentSelect,
  handleClosePlayer
}: any) {
  const { user } = useAuth()
  const location = useLocation()

  // Show landing page for unauthenticated users except on login and signup pages
  if (!user && !['/login', '/signup'].includes(location.pathname)) {
    return <LandingPage />
  }

  return (
    <div className="app">
      <Header />
      <main>
        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <Routes>
            <Route 
              path="/" 
              element={
                <Home 
                  data={data}
                  searchQuery={searchQuery}
                  activeFilter={activeFilter}
                  onContentSelect={handleContentSelect}
                  handleFilterChange={handleFilterChange}
                  onSearch={handleSearch}
                />
              } 
            />
            <Route 
              path="/movies" 
              element={
                <Movies 
                  data={data}
                  searchQuery={searchQuery}
                  onContentSelect={handleContentSelect}
                  onSearch={handleSearch}
                />
              } 
            />
            <Route 
              path="/tv-shows" 
              element={
                <TVShows 
                  data={data}
                  searchQuery={searchQuery}
                  onContentSelect={handleContentSelect}
                  onSearch={handleSearch}
                />
              } 
            />
            <Route path="/my-list" element={<MyList searchQuery={searchQuery} onContentSelect={handleContentSelect} />} />
            <Route path="/browse-languages" element={<BrowseLanguages searchQuery={searchQuery} />} />
            <Route path="/news" element={<News />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        )}
      </main>

      {showPlayer && selectedContent && (
        <VideoPlayer 
          content={selectedContent} 
          onClose={handleClosePlayer}
          isOpen={showPlayer}
        />
      )}
    </div>
  )
}

export default App 