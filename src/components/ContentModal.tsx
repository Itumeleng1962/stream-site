import { useWatchlist } from '../context/WatchlistContext';
import WatchProviders from './WatchProviders';

interface ContentModalProps {
  content: any;
  isOpen: boolean;
  onClose: () => void;
  onPlay: () => void;
}

export default function ContentModal({ content, isOpen, onClose, onPlay }: ContentModalProps) {
  const { isInWatchlist, addToWatchlist, removeFromWatchlist } = useWatchlist();

  if (!isOpen) return null;

  const handleWatchlistClick = () => {
    if (isInWatchlist(content.id)) {
      removeFromWatchlist(content.id);
    } else {
      addToWatchlist(content);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>
        
        <div className="modal-image">
          <img src={content.image || "/placeholder.jpg"} alt={content.title} />
          <div className="modal-image-overlay">
            <button className="modal-play-btn" onClick={onPlay}>▶ Play</button>
          </div>
        </div>

        <div className="modal-info">
          <div className="modal-header">
            <h2>{content.title}</h2>
            <div className="modal-meta">
              <span>{content.year}</span>
              <span>{content.contentType === 'movie' ? 'Movie' : 'TV Show'}</span>
              <span>⭐ {content.rating.toFixed(1)}</span>
            </div>
          </div>

          <p className="modal-description">{content.description}</p>

          <div className="modal-genres">
            {content.genre?.map((genre: string, index: number) => (
              <span key={index} className="genre-tag">{genre}</span>
            ))}
          </div>

          <div className="modal-actions">
            <button className="action-btn primary" onClick={onPlay}>
              Watch Now
            </button>
            <button 
              className={`action-btn secondary ${isInWatchlist(content.id) ? 'in-list' : ''}`}
              onClick={handleWatchlistClick}
            >
              {isInWatchlist(content.id) ? '✓ In My List' : '+ My List'}
            </button>
          </div>

          {content.watchProviders && (
            <div className="modal-providers">
              <WatchProviders />
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 