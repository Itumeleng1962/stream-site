import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/ui/dialog';

interface HeroSectionProps {
  content: any
  onPlay: (content: any) => void
}

export default function HeroSection({ content, onPlay }: HeroSectionProps) {
  const [infoOpen, setInfoOpen] = useState(false);
  const isMobile = window.innerWidth <= 900; // crude check, can be improved

  return (
    <section className="hero-section">
      <div className="hero-background">
        <img src={content.image || "/placeholder.svg"} alt={content.title} />
        <div className="hero-gradient"></div>
      </div>

      <div className="hero-content">
        <div className="hero-info">
          <div className="hero-logo">
            <h1 className="text-4xl font-bold">{content.title}</h1>
          </div>
          {!isMobile && (
            <>
              <p className="hero-description">{content.description}</p>
              <div className="hero-meta">
                <span>{content.year}</span>
                <span>{content.rating}</span>
                <span>{content.duration}</span>
                <span>{content.genre}</span>
              </div>
            </>
          )}
          <div className="hero-buttons">
            <button className="play-btn" onClick={() => onPlay(content)}>
              ▶ Play
            </button>
            <button className="info-btn" onClick={() => setInfoOpen(true)}>ℹ More Info</button>
          </div>
        </div>
      </div>
      {isMobile && (
        <Dialog open={infoOpen} onOpenChange={setInfoOpen}>
          <DialogContent className="edit-profile-modal">
            <DialogHeader>
              <DialogTitle>{content.title}</DialogTitle>
            </DialogHeader>
            <DialogDescription>{content.description}</DialogDescription>
            <div className="hero-meta" style={{ marginTop: 16 }}>
              <span>{content.year}</span>
              <span>{content.rating}</span>
              <span>{content.duration}</span>
              <span>{content.genre}</span>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </section>
  )
} 