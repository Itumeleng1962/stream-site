interface PodcastSectionProps {
  podcasts: any[]
  onPodcastSelect: (podcast: any) => void
}

export default function PodcastSection({ podcasts, onPodcastSelect }: PodcastSectionProps) {
  return (
    <div className="podcast-section">
      <div className="section-header">
        <h2>🎙️ Featured Podcasts</h2>
        <p>Audio content for your commute</p>
      </div>

      <div className="podcast-grid">
        {podcasts.map((podcast) => (
          <div
            key={podcast.id}
            className="podcast-card"
            onClick={() => onPodcastSelect({ ...podcast, type: "podcast" })}
          >
            <div className="podcast-artwork">
              <img src={podcast.image || "/placeholder.svg"} alt={podcast.title} />
              <div className="waveform">
                <div className="wave-bar" style={{ height: "20%" }}></div>
                <div className="wave-bar" style={{ height: "60%" }}></div>
                <div className="wave-bar" style={{ height: "40%" }}></div>
                <div className="wave-bar" style={{ height: "80%" }}></div>
                <div className="wave-bar" style={{ height: "30%" }}></div>
                <div className="wave-bar" style={{ height: "70%" }}></div>
                <div className="wave-bar" style={{ height: "50%" }}></div>
                <div className="wave-bar" style={{ height: "90%" }}></div>
              </div>
            </div>

            <div className="podcast-info">
              <h4 className="podcast-title">{podcast.title}</h4>
              <p className="podcast-host">by {podcast.host}</p>
              <div className="podcast-meta">
                <span className="podcast-category">{podcast.category}</span>
                <span className="podcast-episodes">{podcast.episodes} episodes</span>
              </div>
              <p className="podcast-description">{podcast.description}</p>
            </div>

            <button className="podcast-play-btn">▶</button>
          </div>
        ))}
      </div>
    </div>
  )
} 