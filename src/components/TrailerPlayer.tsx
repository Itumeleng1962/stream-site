import { useState, useEffect } from 'react';
import LoadingSpinner from './LoadingSpinner';

interface TrailerPlayerProps {
  videoUrl: string;
  onClose: () => void;
}

export default function TrailerPlayer({ videoUrl, onClose }: TrailerPlayerProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log('TrailerPlayer received videoUrl:', videoUrl);
    
    // Validate video URL
    if (videoUrl && !videoUrl.includes('youtube.com/embed/')) {
      console.error('Invalid video URL format:', videoUrl);
      setError('Invalid video format');
      return;
    }

    setIsLoading(false);
  }, [videoUrl]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  if (!videoUrl) {
    console.log('No video URL provided to TrailerPlayer');
    return (
      <div className="no-trailer-message">
        <h3>No Trailer Available</h3>
        <p>Sorry, there is no trailer available for this content.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="no-trailer-message">
        <h3>Error Playing Trailer</h3>
        <p>{error}</p>
        <button className="retry-btn" onClick={() => window.location.reload()}>
          Try Again
        </button>
      </div>
    );
  }

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="video-player-modal">
      <button className="close-button" onClick={onClose}>×</button>
      <div className="youtube-player">
        <iframe
          src={videoUrl}
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      </div>
    </div>
  );
} 