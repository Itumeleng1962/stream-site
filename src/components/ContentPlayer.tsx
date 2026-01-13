import { useState, useEffect } from "react"

interface Content {
  type: string
  title: string
  duration?: number
  image?: string
  description?: string
  genre?: string
  category?: string
  rating?: number
  host?: string
}

interface ContentPlayerProps {
  content: Content
  onClose: () => void
}

export default function ContentPlayer({ content, onClose }: ContentPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [showAd, setShowAd] = useState(true)
  const [adCountdown, setAdCountdown] = useState(15)
  const [currentTime, setCurrentTime] = useState(0)
  const duration = content.duration || (content.type === "podcast" ? 2700 : 7200) // 45min or 2h

  useEffect(() => {
    if (showAd && adCountdown > 0) {
      const timer = setTimeout(() => setAdCountdown(adCountdown - 1), 1000)
      return () => clearTimeout(timer)
    } else if (showAd && adCountdown === 0) {
      setShowAd(false)
      setIsPlaying(true)
    }
  }, [showAd, adCountdown])

  useEffect(() => {
    if (isPlaying && !showAd) {
      const timer = setInterval(() => {
        setCurrentTime(prev => {
          if (prev >= duration) {
            clearInterval(timer)
            onClose()
            return prev
          }
          return prev + 1
        })
      }, 1000)
      return () => clearInterval(timer)
    }
  }, [isPlaying, showAd, duration, onClose])

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600)
    const m = Math.floor((seconds % 3600) / 60)
    const s = seconds % 60
    return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`
  }

  const skipAd = () => {
    if (adCountdown <= 5) {
      setShowAd(false)
      setIsPlaying(true)
    }
  }

  return (
    <div className="content-player-overlay">
      <div className="player-container">
        <button className="close-player" onClick={onClose}>
          ✕
        </button>

        <div className="player-screen">
          {showAd ? (
            <div className="ad-container">
              <div className="ad-content">
                <img src="/placeholder.svg?height=300&width=500" alt="Advertisement" />
                <div className="ad-overlay">
                  <div className="ad-info">
                    <span className="ad-label">Advertisement</span>
                    <span className="ad-countdown">
                      {adCountdown > 5 ? (
                        `${adCountdown}s`
                      ) : (
                        <button onClick={skipAd} className="skip-ad-btn">
                          Skip Ad
                        </button>
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="main-content-player">
              {content.type === "podcast" ? (
                <div className="podcast-player">
                  <div className="podcast-artwork-large">
                    <img src={content.image || "/placeholder.svg"} alt={content.title} />
                  </div>
                  <div className="audio-visualizer">
                    {Array.from({ length: 50 }, (_, i) => (
                      <div
                        key={i}
                        className="audio-bar"
                        style={{
                          height: `${Math.random() * 100}%`,
                          animationDelay: `${i * 0.1}s`,
                        }}
                      ></div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="video-player">
                  <img src={content.image || "/placeholder.svg"} alt={content.title} />
                  <div className="video-overlay">
                    <button className="play-pause-btn" onClick={() => setIsPlaying(!isPlaying)}>
                      {isPlaying ? "⏸️" : "▶️"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {!showAd && (
          <div className="player-controls">
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${(currentTime / duration) * 100}%` }}></div>
            </div>

            <div className="control-buttons">
              <button onClick={() => setCurrentTime(Math.max(0, currentTime - 10))}>⏪</button>
              <button onClick={() => setIsPlaying(!isPlaying)}>{isPlaying ? "⏸️" : "▶️"}</button>
              <button onClick={() => setCurrentTime(Math.min(duration, currentTime + 10))}>⏩</button>
              <span className="time-display">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
            </div>
          </div>
        )}

        <div className="player-info">
          <h2>{content.title}</h2>
          <p>{content.description}</p>
          <div className="content-tags">
            <span className="tag">{content.genre || content.category}</span>
            {content.rating && <span className="tag">⭐ {content.rating}</span>}
            {content.type === "podcast" && content.host && <span className="tag">🎙️ {content.host}</span>}
          </div>
        </div>
      </div>
    </div>
  )
} 