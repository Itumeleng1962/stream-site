import { useState, useEffect } from 'react';
import { fetchNews } from '../services/newsApi';
import LoadingSpinner from './LoadingSpinner';

interface NewsArticle {
  title: string;
  description: string;
  url: string;
  urlToImage: string;
  publishedAt: string;
  source: {
    name: string;
  };
}

export default function News() {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [category, setCategory] = useState('general');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    loadNews();
  }, [category, retryCount]);

  const loadNews = async () => {
    try {
      console.log('Starting to fetch news for category:', category);
      setLoading(true);
      setError(null);
      
      const data = await fetchNews(category);
      console.log('News data received:', {
        status: data.status,
        totalResults: data.totalResults,
        articleCount: data.articles?.length,
        firstArticle: data.articles?.[0]
      });
      
      if (!data.articles || !Array.isArray(data.articles)) {
        throw new Error('Invalid response format: articles array is missing');
      }
      
      if (data.articles.length === 0) {
        console.log('No articles returned for category:', category);
        setError(`No articles available for ${category} category at the moment. This could be due to API limitations or no recent news in this category.`);
      }
      
      setArticles(data.articles);
    } catch (err: any) {
      console.error('Error loading news:', err);
      let errorMessage = 'Failed to load news. ';
      
      if (err.message.includes('429')) {
        errorMessage += 'API rate limit exceeded. Please try again later.';
      } else if (err.message.includes('401')) {
        errorMessage += 'API key validation failed. Please check your configuration.';
      } else {
        errorMessage += 'Please try again or select a different category.';
      }
      
      setError(errorMessage);
      setArticles([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    setRetryCount(count => count + 1);
  };

  const categories = [
    'general',
    'technology',
    'entertainment',
    'sports',
    'business',
    'health'
  ];

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('en-ZA', options);
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="news-container">
      <div className="news-header">
        <h1>Latest News</h1>
        <div className="category-filters">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`category-btn ${category === cat ? 'active' : ''}`}
              onClick={() => setCategory(cat)}
              disabled={loading}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="news-grid">
        {error ? (
          <div className="no-news">
            <h2>{error}</h2>
            <p>You can try:</p>
            <ul>
              <li>Selecting a different category</li>
              <li>Waiting a few minutes and trying again</li>
              <li>Checking if there are any API service issues</li>
            </ul>
            <button onClick={handleRetry} className="retry-btn" disabled={loading}>
              Try Again
            </button>
          </div>
        ) : articles.length === 0 ? (
          <div className="no-news">
            <h2>No news articles found</h2>
            <p>Try selecting a different category or check back later.</p>
          </div>
        ) : (
          articles.map((article, index) => (
            <article key={index} className="news-card">
              <div className="news-image">
                {article.urlToImage ? (
                  <img src={article.urlToImage} alt={article.title} />
                ) : (
                  <div className="placeholder-image">
                    <span>No Image Available</span>
                  </div>
                )}
              </div>
              <div className="news-content">
                <div className="news-meta">
                  <span className="news-source">{article.source.name}</span>
                  <span className="news-date">{formatDate(article.publishedAt)}</span>
                </div>
                <h2 className="news-title">{article.title}</h2>
                <p className="news-description">{article.description}</p>
                <a
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="read-more"
                >
                  Read More
                </a>
              </div>
            </article>
          ))
        )}
      </div>
    </div>
  );
} 