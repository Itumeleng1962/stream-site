import { useEffect } from 'react';

interface VideoPlayerProps {
  content: {
    title: string;
    videoUrl?: string;
  };
  onClose: () => void;
  isOpen: boolean;
}

export default function VideoPlayer({ content, onClose, isOpen }: VideoPlayerProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="video-player-overlay">
      <div className="video-player-content">
        <button className="close-button" onClick={onClose}>×</button>
        <div className="video-container">
          {content.videoUrl ? (
            content.videoUrl.includes('youtube.com/embed/') ? (
              <iframe
                src={content.videoUrl}
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                style={{ width: '100%', height: '360px', background: '#000' }}
              />
            ) : (
              <video controls autoPlay>
                <source src={content.videoUrl} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            )
          ) : (
            <div className="video-placeholder">
              <h2>{content.title}</h2>
              <p>Video content not available</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 