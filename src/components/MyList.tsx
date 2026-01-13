import { useWatchlist } from '../context/WatchlistContext';

interface MyListProps {
  searchQuery: string;
  onContentSelect: (content: any) => void;
}

export default function MyList({ searchQuery, onContentSelect }: MyListProps) {
  const { watchlist } = useWatchlist();

  // Filter content based on search query
  const filteredContent = watchlist.filter(item =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="landing-page-colors my-list-container">
      <div className="my-list-header">
        <div className="my-list-title">
          <h1>My List</h1>
          <p className="my-list-subtitle">Your saved movies and TV shows</p>
        </div>
        {watchlist.length > 0 && (
          <div className="my-list-stats">
            <span className="stats-number">{watchlist.length}</span>
            <span className="stats-text">Titles</span>
          </div>
        )}
      </div>

      {filteredContent.length > 0 ? (
        <div className="my-list-grid">
          {filteredContent.map((content) => (
            <div key={content.id} className="my-list-item" onClick={() => onContentSelect(content)}>
              <div className="item-image-container">
                <img 
                  src={content.image || "/placeholder.svg"} 
                  alt={content.title} 
                  className="item-image"
                />
                <div className="item-overlay">
                  <button className="play-btn">▶</button>
                </div>
              </div>
              <div className="item-info">
                <h3 className="item-title">{content.title}</h3>
                <div className="item-meta">
                  <span className="item-year">{content.year}</span>
                  <span className="item-type">{content.type}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-list">
          <div className="empty-list-content">
            <div className="empty-icon">📺</div>
            <h2>No content available</h2>
            <p>Start building your list by clicking the + button on any movie or TV show</p>
          </div>
        </div>
      )}
    </div>
  );
} 