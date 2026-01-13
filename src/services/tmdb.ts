import axios from 'axios';

export const TMDB_API_KEY = '3adccab43a6c5c6bb3c0d67cbf676d85';
const TMDB_ACCESS_TOKEN = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzYWRjY2FiNDNhNmM1YzZiYjNjMGQ2N2NiZjY3NmQ4NSIsIm5iZiI6MTc1MDE1NTUzOS44MzksInN1YiI6IjY4NTE0MTEzOGE3N2RmZDdiNDkyZGQ1YyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.6LMwLcghFjTWpgq_ymrocV6SO_9YY-WPtd_KbwGF2Wo';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

console.log('TMDB Configuration:', {
  accessToken: TMDB_ACCESS_TOKEN ? 'Present' : 'Missing',
  baseUrl: BASE_URL,
  imageBaseUrl: IMAGE_BASE_URL
});

// Image sizes from TMDB
export const posterSizes = {
  small: 'w185',
  medium: 'w342',
  large: 'w500',
  original: 'original'
};

// Create axios instance for TMDB
const tmdbApi = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Authorization': `Bearer ${TMDB_ACCESS_TOKEN}`,
    'Content-Type': 'application/json'
  },
  params: {
    language: 'en-US',
    include_adult: false,
    'certification.lte': 'PG-13',
    'vote_count.gte': 100  // Only show well-reviewed content
  }
});

// Add request interceptor for debugging and content filtering
tmdbApi.interceptors.request.use(request => {
  // Ensure adult content filtering is always applied
  if (request.params) {
    request.params.include_adult = false;
    request.params['certification.lte'] = 'PG-13';
  }
  
  console.log('Making request:', {
    url: request.url,
    method: request.method,
    params: request.params
  });
  return request;
});

// Add response interceptor for content filtering
tmdbApi.interceptors.response.use(
  response => {
    // Filter out any potentially inappropriate content
    if (response.data && response.data.results) {
      response.data.results = response.data.results.filter((item: any) => {
        // Filter out items with inappropriate titles or descriptions
        const lowerTitle = (item.title || item.name || '').toLowerCase();
        const lowerOverview = (item.overview || '').toLowerCase();
        
        // List of terms to filter out
        const inappropriateTerms = ['adult', 'erotic', 'explicit', 'nsfw'];
        
        return !inappropriateTerms.some(term => 
          lowerTitle.includes(term) || lowerOverview.includes(term)
        );
      });
    }
    
    console.log('Received response:', {
      url: response.config.url,
      status: response.status,
      data: response.data
    });
    return response;
  },
  error => {
    console.error('API Error:', {
      url: error.config?.url,
      status: error.response?.status,
      message: error.message,
      response: error.response?.data
    });
    throw error;
  }
);

export const tmdb = {
  // Get trending movies and TV shows
  getTrending: async (mediaType: 'all' | 'movie' | 'tv' = 'all', timeWindow: 'day' | 'week' = 'week') => {
    try {
      const response = await tmdbApi.get(`/trending/${mediaType}/${timeWindow}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching trending content:', error);
      throw error;
    }
  },

  // Get popular movies
  getPopularMovies: async (page = 1) => {
    try {
      const response = await tmdbApi.get('/movie/popular', { 
        params: { page } 
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching popular movies:', error);
      throw error;
    }
  },

  // Get popular TV shows
  getPopularTVShows: async (page = 1) => {
    try {
      const response = await tmdbApi.get('/tv/popular', { 
        params: { page } 
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching popular TV shows:', error);
      throw error;
    }
  },

  // Get movie details
  getMovieDetails: async (movieId: number) => {
    try {
      const [details, trailers] = await Promise.all([
        tmdbApi.get(`/movie/${movieId}`, {
          params: {
            append_to_response: 'credits,similar,recommendations'
          }
        }),
        tmdb.getMovieTrailers(movieId)
      ]);

      return {
        ...details.data,
        trailer: trailers[0]?.url
      };
    } catch (error) {
      console.error('Error fetching movie details:', error);
      throw error;
    }
  },

  // Get TV show details
  getTVShowDetails: async (tvId: number) => {
    try {
      const [details, trailers] = await Promise.all([
        tmdbApi.get(`/tv/${tvId}`, {
          params: {
            append_to_response: 'credits,similar,recommendations'
          }
        }),
        tmdb.getTVShowTrailers(tvId)
      ]);

      return {
        ...details.data,
        trailer: trailers[0]?.url
      };
    } catch (error) {
      console.error('Error fetching TV show details:', error);
      throw error;
    }
  },

  // Search movies and TV shows
  search: async (query: string, page = 1) => {
    try {
      const response = await tmdbApi.get('/search/multi', {
        params: {
          query,
          page,
          include_adult: false
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error searching content:', error);
      throw error;
    }
  },

  // Get movie genres
  getMovieGenres: async () => {
    try {
      const response = await tmdbApi.get('/genre/movie/list');
      return response.data;
    } catch (error) {
      console.error('Error fetching movie genres:', error);
      throw error;
    }
  },

  // Get TV show genres
  getTVGenres: async () => {
    try {
      const response = await tmdbApi.get('/genre/tv/list');
      return response.data;
    } catch (error) {
      console.error('Error fetching TV show genres:', error);
      throw error;
    }
  },

  // Get movies by genre
  getMoviesByGenre: async (genreId: number, page = 1) => {
    try {
      const response = await tmdbApi.get('/discover/movie', {
        params: {
          with_genres: genreId,
          page,
          sort_by: 'popularity.desc'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching movies by genre:', error);
      throw error;
    }
  },

  // Get TV shows by genre
  getTVShowsByGenre: async (genreId: number, page = 1) => {
    try {
      const response = await tmdbApi.get('/discover/tv', {
        params: {
          with_genres: genreId,
          page,
          sort_by: 'popularity.desc'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching TV shows by genre:', error);
      throw error;
    }
  },

  // Helper function to get full image URL
  getImageUrl: (path: string | null, size = posterSizes.original) => {
    if (!path) return null;
    return `${IMAGE_BASE_URL}/${size}${path}`;
  },

  // Get movie trailers
  getMovieTrailers: async (movieId: number) => {
    try {
      const response = await tmdbApi.get(`/movie/${movieId}/videos`);
      const trailers = response.data.results.filter(
        (video: any) => video.type === 'Trailer' && video.site === 'YouTube'
      );
      return trailers.map((trailer: any) => ({
        key: trailer.key,
        name: trailer.name,
        url: `https://www.youtube.com/embed/${trailer.key}?autoplay=1&modestbranding=1&rel=0`
      }));
    } catch (error) {
      console.error('Error fetching movie trailers:', error);
      return [];
    }
  },

  // Get TV show trailers
  getTVShowTrailers: async (tvId: number) => {
    try {
      const response = await tmdbApi.get(`/tv/${tvId}/videos`);
      const trailers = response.data.results.filter(
        (video: any) => video.type === 'Trailer' && video.site === 'YouTube'
      );
      return trailers.map((trailer: any) => ({
        key: trailer.key,
        name: trailer.name,
        url: `https://www.youtube.com/embed/${trailer.key}?autoplay=1&modestbranding=1&rel=0`
      }));
    } catch (error) {
      console.error('Error fetching TV show trailers:', error);
      return [];
    }
  },

  // Get watch providers (where to stream/rent/buy)
  getWatchProviders: async (id: number, type: 'movie' | 'tv') => {
    try {
      const response = await tmdbApi.get(`/${type}/${id}/watch/providers`);
      return response.data;
    } catch (error) {
      console.error('Error fetching watch providers:', error);
      throw error;
    }
  },

  // Get region specific watch providers
  getRegionProviders: (providers: any, region: string = 'ZA') => {
    if (!providers?.results?.[region]) {
      return null;
    }

    const regionData = providers.results[region];
    return {
      stream: regionData.flatrate || [],
      rent: regionData.rent || [],
      buy: regionData.buy || [],
      link: regionData.link
    };
  }
}; 