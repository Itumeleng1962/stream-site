import { useState } from "react"

interface ContentRowProps {
  title: string
  content: any[]
  onContentSelect: (content: any) => void
  searchQuery?: string
}

export default function ContentRow({ title, content, onContentSelect, searchQuery }: ContentRowProps) {
  const [hoveredItem, setHoveredItem] = useState(null)

  const filteredContent = searchQuery
    ? content.filter(
        (item) =>
          item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.genre.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : content

  if (filteredContent.length === 0) return null

  return (
    <div className="content-row">
      <h2 className="row-title">{title}</h2>
      <div className="row-content">
        <div className="content-slider">
          {filteredContent.map((item) => (
            <div
              key={item.id}
              className="content-item"
              onMouseEnter={() => setHoveredItem(item.id)}
              onMouseLeave={() => setHoveredItem(null)}
              onClick={() => onContentSelect(item)}
            >
              <img src={item.image || "/placeholder.svg"} alt={item.title} className="content-image" />
              {hoveredItem === item.id && (
                <div className="content-preview">
                  <div className="preview-image">
                    <img src={item.image || "/placeholder.svg"} alt={item.title} />
                    <button className="preview-play-btn">▶</button>
                  </div>
                  <div className="preview-info">
                    <div className="preview-buttons">
                      <button className="preview-btn play">▶</button>
                      <button className="preview-btn add">+</button>
                      <button className="preview-btn like">👍</button>
                      <button className="preview-btn dislike">👎</button>
                    </div>
                    <div className="preview-meta">
                      <span className="preview-rating">{item.rating}</span>
                      <span className="preview-year">{item.year}</span>
                      <span className="preview-duration">{item.duration}</span>
                    </div>
                    <div className="preview-genre">{item.genre}</div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
} 