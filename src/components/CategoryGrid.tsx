import { useState } from 'react';
import { useWatchlist } from '../context/WatchlistContext';
import WatchProviders from './WatchProviders';
import ContentModal from './ContentModal';

interface CategoryGridProps {
  content: {
    movies: any[];
    tvShows: any[];
  };
  onContentSelect: (content: any) => void;
  activeFilter: string;
  searchQuery: string;
  currentPage?: number;
  setPage?: (page: number) => void;
  totalPages?: number;
}

export default function CategoryGrid({ content, onContentSelect, activeFilter, searchQuery, currentPage = 1, setPage, totalPages = 1 }: CategoryGridProps) {
  const { isInWatchlist, addToWatchlist, removeFromWatchlist } = useWatchlist();
  const [selectedContent, setSelectedContent] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);

  const filterContent = () => {
    let allContent: any[] = [];

    // Add movies with type
    if (activeFilter === "all" || activeFilter === "movies") {
      if (content.movies && Array.isArray(content.movies)) {
        allContent = [...allContent, ...content.movies.map(item => ({
          ...item,
          contentType: 'movie'
        }))];
      }
    }

    // Add TV shows with type
    if (activeFilter === "all" || activeFilter === "series") {
      if (content.tvShows && Array.isArray(content.tvShows)) {
        allContent = [...allContent, ...content.tvShows.map(item => ({
          ...item,
          contentType: 'series'
        }))];
      }
    }

    // Filter by search query if present
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      allContent = allContent.filter(
        (item) =>
          item.title.toLowerCase().includes(query) ||
          item.description.toLowerCase().includes(query) ||
          (item.genre && item.genre.some((g: string) => 
            g.toLowerCase().includes(query)
          ))
      );
    }

    // Sort by rating
    allContent.sort((a, b) => b.rating - a.rating);

    return allContent;
  };

  const handleWatchlistClick = (content: any, event: React.MouseEvent) => {
    event.stopPropagation();
    if (isInWatchlist(content.id)) {
      removeFromWatchlist(content.id);
    } else {
      addToWatchlist(content);
    }
  };

  const handleInfoClick = (content: any, event: React.MouseEvent) => {
    event.stopPropagation();
    setSelectedContent(content);
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setSelectedContent(null);
  };

  const filteredContent = filterContent();

  if (filteredContent.length === 0) {
    return (
      <div className="category-grid">
        <div className="no-content">
          {searchQuery 
            ? `No results found for "${searchQuery}"`
            : activeFilter === "all" 
              ? "No content available"
              : `No ${activeFilter} available`}
        </div>
      </div>
    );
  }

  return (
    <div className="category-grid">
      <div className="content-masonry">
        {filteredContent.map((item, index) => (
          <div
            key={item.id}
            className={`content-card ${item.contentType} card-${(index % 3) + 1}`}
          >
            <div className="card-image" onClick={() => onContentSelect(item)}>
              <img src={item.image || "/placeholder.jpg"} alt={item.title} />
              <div className="card-overlay">
                <div className="play-button">▶</div>
              </div>
            </div>

            <div className="card-content">
              <div className="card-header">
                <h3 className="card-title">{item.title}</h3>
                <div className="card-rating">⭐ {item.rating.toFixed(1)}</div>
              </div>

              <div className="card-meta">
                <span className="card-year">{item.year}</span>
                <span className="card-type">
                  {item.contentType === 'movie' ? 'Movie' : 'TV Show'}
                </span>
              </div>

              <p className="card-description">
                {item.description.length > 150 
                  ? `${item.description.substring(0, 150)}...` 
                  : item.description}
              </p>

              <div className="card-actions">
                <button className="action-btn primary" onClick={() => onContentSelect(item)}>
                  Watch Trailer
                </button>
                <button 
                  className={`action-btn secondary ${isInWatchlist(item.id) ? 'in-list' : ''}`}
                  onClick={(e) => handleWatchlistClick(item, e)}
                >
                  {isInWatchlist(item.id) ? '✓' : '+'}
                </button>
                <button 
                  className="action-btn secondary"
                  onClick={(e) => handleInfoClick(item, e)}
                >
                  ℹ️
                </button>
              </div>

              <WatchProviders />
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Controls */}
      {setPage && totalPages > 1 && (
        <div className="pagination-controls">
          <button onClick={() => setPage(currentPage - 1)} disabled={currentPage === 1}>Prev</button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNum => (
            <button
              key={pageNum}
              onClick={() => setPage(pageNum)}
              disabled={pageNum === currentPage}
              style={{ fontWeight: pageNum === currentPage ? 'bold' : 'normal' }}
            >
              {pageNum}
            </button>
          ))}
          <button onClick={() => setPage(currentPage + 1)} disabled={currentPage === totalPages}>Next</button>
        </div>
      )}

      {selectedContent && (
        <ContentModal
          content={selectedContent}
          isOpen={showModal}
          onClose={handleModalClose}
          onPlay={() => {
            onContentSelect(selectedContent);
            handleModalClose();
          }}
        />
      )}
    </div>
  );
} 