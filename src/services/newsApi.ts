/// <reference types="vite/client" />

// Use a default API key if environment variable is not available
const NEWS_API_KEY = import.meta.env.VITE_NEWS_API_KEY || 'YOUR_DEFAULT_API_KEY';

const BASE_URL = 'https://newsapi.org/v2';

export async function fetchNews(category = 'general') {
  try {
    const response = await fetch(
      `${BASE_URL}/top-headlines?country=us&category=${category}&apiKey=${NEWS_API_KEY}`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch news');
    }
    
    const data = await response.json();
    return data.articles;
  } catch (error) {
    console.error('Error fetching news:', error);
    return [];
  }
}

export async function searchNews(query: string) {
  try {
    if (!NEWS_API_KEY) {
      throw new Error('News API key is not configured');
    }

    const url = `${BASE_URL}/everything?q=${query}&sortBy=publishedAt&apiKey=${NEWS_API_KEY}`;
    console.log('Searching news from:', url.replace(NEWS_API_KEY, 'HIDDEN'));

    const response = await fetch(url);
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('API Error:', errorData);
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('Search API Response:', {
      status: data.status,
      totalResults: data.totalResults,
      articleCount: data.articles?.length
    });

    return data;
  } catch (error) {
    console.error('Error searching news:', error);
    throw error;
  }
} 