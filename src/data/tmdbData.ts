import { TMDB_API_KEY } from '../services/tmdb';

interface TMDBMovie {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  genre_ids: number[];
  vote_average: number;
  release_date: string;
}

interface TMDBTVShow {
  id: number;
  name: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  genre_ids: number[];
  vote_average: number;
  first_air_date: string;
}

interface TMDBGenre {
  id: number;
  name: string;
}

interface TMDBVideo {
  key: string;
  type: string;
  site: string;
  name: string;
  official?: boolean;
  published_at?: string;
}

interface TMDBProvider {
  provider_id: number;
  provider_name: string;
  logo_path: string;
}

interface TMDBWatchProviders {
  results: {
    [country: string]: {
      link: string;
      flatrate?: TMDBProvider[];
      rent?: TMDBProvider[];
      buy?: TMDBProvider[];
    };
  };
}

interface Content {
  id: number;
  title: string;
  description: string;
  image: string;
  backdrop?: string;
  genre: string[];
  rating: number;
  year: number;
  type: 'movie' | 'tv';
  trailer?: string;
  watchProviders?: {
    stream?: TMDBProvider[];
    rent?: TMDBProvider[];
    buy?: TMDBProvider[];
    link?: string;
  };
}

const inappropriateTerms = ['adult', 'erotic', 'explicit', 'nsfw', 'xxx', 'porn', 'sex'];

function isAppropriateContent(item: TMDBMovie | TMDBTVShow): boolean {
  const title = ('title' in item ? item.title : item.name).toLowerCase();
  const overview = (item.overview || '').toLowerCase();
  
  return !inappropriateTerms.some(term => 
    title.includes(term) || overview.includes(term)
  );
}

async function formatContent(item: TMDBMovie | TMDBTVShow, type: 'movie' | 'tv'): Promise<Content> {
  const id = item.id;
  const title = 'title' in item ? item.title : item.name;
  const description = item.overview;
  const image = item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : '/placeholder.jpg';
  const backdrop = item.backdrop_path ? `https://image.tmdb.org/t/p/original${item.backdrop_path}` : undefined;
  
  try {
    // Fetch additional details with videos
    const details = await fetch(
      `https://api.themoviedb.org/3/${type}/${id}/videos?api_key=${TMDB_API_KEY}`
    ).then(res => res.json());

    console.log('Fetched video details:', details);

    // Get trailer
    const trailers = details.results || [];
    const trailerVideo = trailers.find((video: TMDBVideo) => 
      video.type === 'Trailer' && video.site === 'YouTube'
    );

    console.log('Found trailer:', trailerVideo);

    let trailer;
    if (trailerVideo) {
      trailer = `https://www.youtube.com/embed/${trailerVideo.key}?autoplay=1&modestbranding=1&rel=0`;
      console.log('Generated trailer URL:', trailer);
    }

    // Fetch genres and watch providers
    const contentDetails = await fetch(
      `https://api.themoviedb.org/3/${type}/${id}?api_key=${TMDB_API_KEY}&append_to_response=watch/providers`
    ).then(res => res.json());

    // Get genres
    const genres = contentDetails.genres?.map((g: TMDBGenre) => g.name) || [];

    // Get watch providers
    const watchProviders = contentDetails['watch/providers'] as TMDBWatchProviders;
    const regionProviders = watchProviders?.results?.['US'] || null;

    const formattedContent: Content = {
      id,
      title,
      description,
      image,
      backdrop,
      genre: genres,
      rating: item.vote_average,
      year: new Date('release_date' in item ? item.release_date : item.first_air_date).getFullYear(),
      type,
      trailer,
      watchProviders: regionProviders ? {
        stream: regionProviders.flatrate,
        rent: regionProviders.rent,
        buy: regionProviders.buy,
        link: regionProviders.link
      } : undefined
    };

    return formattedContent;
  } catch (error) {
    console.error('Error formatting content:', error);
    // Return basic content without trailer on error
    return {
      id,
      title,
      description,
      image,
      backdrop,
      genre: [],
      rating: item.vote_average,
      year: new Date('release_date' in item ? item.release_date : item.first_air_date).getFullYear(),
      type
    };
  }
}

export { formatContent };
export async function searchContent(query: string) {
  try {
    const results = await fetch(
      `https://api.themoviedb.org/3/search/multi?api_key=${TMDB_API_KEY}&query=${query}&include_adult=false`
    ).then(res => res.json());
    
    return results.results.map((item: TMDBMovie | TMDBTVShow) => ({
      id: item.id,
      title: 'title' in item ? item.title : item.name,
      description: item.overview,
      image: item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : '/placeholder.jpg',
      rating: item.vote_average,
      year: new Date('release_date' in item ? item.release_date : item.first_air_date).getFullYear(),
      type: 'title' in item ? 'movie' : 'tv'
    }));
  } catch (error) {
    console.error('Error searching content:', error);
    throw error;
  }
}

async function fetchTrendingContent() {
  try {
    // Fetch trending movies
    const trendingMoviesResponse = await fetch(
      `https://api.themoviedb.org/3/trending/movie/week?api_key=${TMDB_API_KEY}&include_adult=false&certification_country=US&certification.lte=PG-13`
    );
    const trendingMoviesData = await trendingMoviesResponse.json();

    // Fetch trending TV shows
    const trendingTVResponse = await fetch(
      `https://api.themoviedb.org/3/trending/tv/week?api_key=${TMDB_API_KEY}&include_adult=false&certification_country=US&certification.lte=PG-13`
    );
    const trendingTVData = await trendingTVResponse.json();

    // Filter and format the trending content
    const trendingMovies = await Promise.all(
      trendingMoviesData.results
        .filter(isAppropriateContent)
        .map((item: TMDBMovie) => formatContent(item, 'movie'))
    );
    const trendingTVShows = await Promise.all(
      trendingTVData.results
        .filter(isAppropriateContent)
        .map((item: TMDBTVShow) => formatContent(item, 'tv'))
    );

    return {
      movies: trendingMovies,
      tvShows: trendingTVShows
    };
  } catch (error) {
    console.error('Error fetching trending content:', error);
    return { movies: [], tvShows: [] };
  }
}

export async function fetchHomePageData(page = 1) {
  try {
    // Fetch popular movies and TV shows for the home page (one page only)
    const moviesResponse = await fetch(
      `https://api.themoviedb.org/3/movie/popular?api_key=${TMDB_API_KEY}&page=${page}`
    );
    const moviesData = await moviesResponse.json();

    const tvResponse = await fetch(
      `https://api.themoviedb.org/3/tv/popular?api_key=${TMDB_API_KEY}&page=${page}`
    );
    const tvData = await tvResponse.json();

    // Format movies and tv shows
    const formattedMovies = await Promise.all(
      moviesData.results.filter(isAppropriateContent).map((item: TMDBMovie) => formatContent(item, 'movie'))
    );
    const formattedTVShows = await Promise.all(
      tvData.results.filter(isAppropriateContent).map((item: TMDBTVShow) => formatContent(item, 'tv'))
    );

    // Get a random item for the hero section from movies
    const hero = formattedMovies.length > 0 ? formattedMovies[Math.floor(Math.random() * formattedMovies.length)] : null;

    // Fetch trending content (not paginated)
    const trendingContent = await fetchTrendingContent();

    return {
      movies: formattedMovies,
      tvShows: formattedTVShows,
      hero,
      trending: trendingContent,
      totalPages: Math.max(moviesData.total_pages, tvData.total_pages)
    };
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
}

export async function getContentDetails(id: number, type: 'movie' | 'tv') {
  try {
    // First fetch videos to get the trailer
    const videosResponse = await fetch(
      `https://api.themoviedb.org/3/${type}/${id}/videos?api_key=${TMDB_API_KEY}`
    ).then(res => res.json());

    console.log('Fetched videos:', videosResponse);

    // Find the best trailer (official trailer if available, otherwise any trailer)
    const trailers = videosResponse.results || [];
    let trailerVideo = trailers.find((video: TMDBVideo) => 
      video.type === 'Trailer' && 
      video.site === 'YouTube' && 
      video.name.toLowerCase().includes('official')
    );

    // If no official trailer, get any trailer
    if (!trailerVideo) {
      trailerVideo = trailers.find((video: TMDBVideo) => 
        video.type === 'Trailer' && 
        video.site === 'YouTube'
      );
    }

    console.log('Selected trailer:', trailerVideo);

    // Now fetch the content details
    const details = await fetch(
      `https://api.themoviedb.org/3/${type}/${id}?api_key=${TMDB_API_KEY}&append_to_response=watch/providers`
    ).then(res => res.json());

    // Format the trailer URL with autoplay and other parameters
    const trailer = trailerVideo 
      ? `https://www.youtube.com/embed/${trailerVideo.key}?autoplay=1&modestbranding=1&rel=0&showinfo=1`
      : undefined;

    console.log('Final trailer URL:', trailer);

    return {
      id: details.id,
      title: details.title || details.name,
      description: details.overview,
      image: details.backdrop_path ? `https://image.tmdb.org/t/p/w500${details.backdrop_path}` : '/placeholder.jpg',
      poster: details.poster_path ? `https://image.tmdb.org/t/p/w500${details.poster_path}` : '/placeholder.jpg',
      genre: details.genres.map((g: TMDBGenre) => g.name).join(', '),
      rating: details.vote_average,
      year: new Date(details.release_date || details.first_air_date).getFullYear(),
      type,
      trailer,
      watchProviders: details['watch/providers']?.results?.['US'] || null
    };
  } catch (error) {
    console.error('Error fetching content details:', error);
    throw error;
  }
} 