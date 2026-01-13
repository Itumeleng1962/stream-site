import { FaSearch } from 'react-icons/fa';

interface FilterBarProps {
  activeFilter: string
  onFilterChange: (filter: string) => void
  searchQuery: string
  onSearch: (query: string) => void
}

export default function FilterBar({ activeFilter, onFilterChange, searchQuery, onSearch }: FilterBarProps) {
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearch(e.target.value);
  };

  const filters = [
    { id: "all", label: "All Content", icon: "🎬" },
    { id: "movies", label: "Movies", icon: "🎭" },
    { id: "series", label: "Series", icon: "📺" },
    { id: "reality", label: "Reality", icon: "🌟" },
    { id: "podcasts", label: "Podcasts", icon: "🎙️" },
    { id: "documentaries", label: "Documentary", icon: "📚" },
  ]

  return (
    <div className="filter-bar">
      <div className="filter-container">
        <div className="filter-tabs">
          {filters.map((filter) => (
            <button
              key={filter.id}
              className={`filter-tab ${activeFilter === filter.id ? "active" : ""}`}
              onClick={() => onFilterChange(filter.id)}
            >
              <span className="filter-icon">{filter.icon}</span>
              <span className="filter-label">{filter.label}</span>
            </button>
          ))}
        </div>
        <div className="filter-search">
          <div className="search-bar">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search movies and TV shows..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="search-input"
            />
          </div>
        </div>
      </div>

      {searchQuery && (
        <div className="search-results-info">
          <span>Searching for: "{searchQuery}"</span>
        </div>
      )}
    </div>
  )
} 