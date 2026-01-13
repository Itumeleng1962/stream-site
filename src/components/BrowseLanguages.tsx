import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface BrowseLanguagesProps {
  searchQuery: string;
}

interface Language {
  code: string;
  name: string;
  contentCount?: number;
}

const languages: Language[] = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
  { code: 'it', name: 'Italian' },
  { code: 'ja', name: 'Japanese' },
  { code: 'ko', name: 'Korean' },
  { code: 'zh', name: 'Chinese' },
  { code: 'hi', name: 'Hindi' },
  { code: 'ar', name: 'Arabic' },
  { code: 'ru', name: 'Russian' },
  { code: 'pt', name: 'Portuguese' },
];

export default function BrowseLanguages({ searchQuery }: BrowseLanguagesProps) {
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);
  const [languagesWithCount, setLanguagesWithCount] = useState<Language[]>(languages);
  const navigate = useNavigate();

  useEffect(() => {
    // Get content counts from localStorage if available
    const storedCounts = localStorage.getItem('languageContentCounts');
    if (storedCounts) {
      const counts = JSON.parse(storedCounts);
      setLanguagesWithCount(languages.map(lang => ({
        ...lang,
        contentCount: counts[lang.code] || 0
      })));
    }
  }, []);

  // Filter languages based on search query
  const filteredLanguages = languagesWithCount.filter(lang =>
    lang.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleBrowse = (language: Language) => {
    setSelectedLanguage(language.code);
    // Navigate to home page with language filter
    navigate(`/?language=${language.code}`);
  };

  return (
    <div className="landing-page-colors browse-languages-container">
      <div className="browse-languages-header">
        <div className="browse-languages-title">
          <h1>Browse by Languages</h1>
          <p className="browse-languages-subtitle">Discover content in different languages</p>
        </div>
      </div>

      <div className="languages-grid">
        {filteredLanguages.map((language) => (
          <div
            key={language.code}
            className={`language-card ${selectedLanguage === language.code ? 'selected' : ''}`}
            onClick={() => handleBrowse(language)}
          >
            <div className="language-content">
              <div className="language-icon">🌐</div>
              <h3 className="language-name">{language.name}</h3>
              <p className="language-code">{language.code.toUpperCase()}</p>
              {language.contentCount !== undefined && (
                <p className="content-count">{language.contentCount} titles</p>
              )}
            </div>
            <div className="language-overlay">
              <button 
                className="browse-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  handleBrowse(language);
                }}
              >
                Browse
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredLanguages.length === 0 && (
        <div className="empty-languages">
          <div className="empty-languages-content">
            <div className="empty-icon">🔍</div>
            <h2>No languages found</h2>
            <p>Try searching with a different term</p>
          </div>
        </div>
      )}
    </div>
  );
} 