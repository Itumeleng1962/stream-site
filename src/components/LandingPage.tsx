import { Link, useNavigate } from 'react-router-dom';
import { FaPlay, FaInfoCircle, FaChevronLeft, FaChevronRight, FaFacebook, FaTwitter, FaInstagram, FaTiktok, FaYoutube } from 'react-icons/fa';
import { useState, useEffect, useRef } from 'react';
import Header from './Header'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/ui/dialog';

export default function LandingPage() {
  const [currentHeroSlide, setCurrentHeroSlide] = useState(0);
  const infinitySliderRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const [infoOpen, setInfoOpen] = useState(false);
  const isMobile = window.innerWidth <= 900; // crude check, can be improved

  const heroSlides = [
    {
      title: "Breaking Bad",
      description: "A high school chemistry teacher turned methamphetamine manufacturer partners with a former student to secure his family's financial future as he battles terminal lung cancer.",
      image: "/assets/posters/breaking-bad.jpg",
      genre: "Crime, Drama",
      rating: "9.5/10"
    },
    {
      title: "The Dark Knight",
      description: "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.",
      image: "/assets/posters/dark-knight.jpg",
      genre: "Action, Crime, Drama",
      rating: "9.0/10"
    },
    {
      title: "Oppenheimer",
      description: "The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb.",
      image: "/assets/posters/oppenheimer.jpg",
      genre: "Biography, Drama, History",
      rating: "8.9/10"
    }
  ];

  const infinityMovies = [
    { title: "Breaking Bad", image: "/assets/posters/breaking-bad.jpg" },
    { title: "The Dark Knight", image: "/assets/posters/dark-knight.jpg" },
    { title: "Oppenheimer", image: "/assets/posters/oppenheimer.jpg" },
    { title: "Planet Earth II", image: "/assets/posters/planet-earth-2.jpg" },
    { title: "Better Call Saul", image: "/assets/posters/better-call-saul.jpg" },
    { title: "Inception", image: "/assets/posters/inception.jpg" },
    // Duplicate the movies for seamless loop
    { title: "Breaking Bad", image: "/assets/posters/breaking-bad.jpg" },
    { title: "The Dark Knight", image: "/assets/posters/dark-knight.jpg" },
    { title: "Oppenheimer", image: "/assets/posters/oppenheimer.jpg" },
    { title: "Planet Earth II", image: "/assets/posters/planet-earth-2.jpg" },
    { title: "Better Call Saul", image: "/assets/posters/better-call-saul.jpg" },
    { title: "Inception", image: "/assets/posters/inception.jpg" }
  ];

  const categories = [
    { name: "Action", icon: "🎬", count: "1.2K+" },
    { name: "Drama", icon: "🎭", count: "800+" },
    { name: "Comedy", icon: "😂", count: "950+" },
    { name: "Documentary", icon: "🌍", count: "400+" },
    { name: "Sci-Fi", icon: "🚀", count: "600+" },
    { name: "Horror", icon: "👻", count: "300+" }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentHeroSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  const nextHeroSlide = () => {
    setCurrentHeroSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const prevHeroSlide = () => {
    setCurrentHeroSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  return (
    <div className="landing-page">
      {/* Header */}
      <Header />

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-background">
          {heroSlides.map((slide, index) => (
            <div 
              key={index} 
              className="hero-slide"
              style={{ 
                opacity: index === currentHeroSlide ? 1 : 0,
                transition: 'opacity 0.5s ease-in-out'
              }}
            >
              <img src={slide.image} alt={slide.title} />
              <div className="hero-gradient"></div>
              <div className="hero-content">
                <div className="hero-info">
                  <h1>{slide.title}</h1>
                  {!isMobile && (
                    <>
                      <div className="hero-meta">
                        <span className="rating">{slide.rating}</span>
                        <span className="genre">{slide.genre}</span>
                      </div>
                      <p className="hero-description">{slide.description}</p>
                    </>
                  )}
                  <div className="hero-buttons">
                    <button className="play-btn" onClick={() => navigate('/signup')}>
                      <FaPlay /> Play Now
                    </button>
                    <button className="info-btn" onClick={() => setInfoOpen(true)}>
                      <FaInfoCircle /> More Info
                    </button>
                  </div>
                </div>
              </div>
              {isMobile && index === currentHeroSlide && (
                <Dialog open={infoOpen} onOpenChange={setInfoOpen}>
                  <DialogContent className="edit-profile-modal">
                    <DialogHeader>
                      <DialogTitle>{slide.title}</DialogTitle>
                    </DialogHeader>
                    <DialogDescription>{slide.description}</DialogDescription>
                    <div className="hero-meta" style={{ marginTop: 16 }}>
                      <span className="rating">{slide.rating}</span>
                      <span className="genre">{slide.genre}</span>
                    </div>
                  </DialogContent>
                </Dialog>
              )}
            </div>
          ))}
          </div>
        <button className="carousel-control prev" onClick={prevHeroSlide}>
          <FaChevronLeft />
        </button>
        <button className="carousel-control next" onClick={nextHeroSlide}>
          <FaChevronRight />
        </button>
        <div className="carousel-indicators">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              className={`indicator ${index === currentHeroSlide ? 'active' : ''}`}
              onClick={() => setCurrentHeroSlide(index)}
            ></button>
          ))}
        </div>
      </section>

      {/* Discover Section */}
      <section className="discover-section">
        <div className="discover-container">
          <div className="discover-left">
            <h2 className="discover-title">
              It's a great day to <br />
              <span>Discover.</span>
            </h2>
            <p className="discover-desc">
              Select from the best streaming services (like <span className="highlight-hulu">Hulu</span>, <span className="highlight-netflix">Netflix</span>, Max, and Disney+) to discover more, search faster, and get curated recommendations—all without ever leaving Plex.
            </p>
          </div>
          <div className="discover-right">
            <div className="discover-mockup">
              <img src="/assets/posters/streamingui.jpg" alt="Streaming UI" className="discover-mockup-img" />
              <div className="discover-services-card">
                <div className="services-title">Your Selected Services</div>
                <div className="services-logos">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/f/f1/Prime_Video.png" alt="Prime Video" />
                  <img src="/assets/posters/AppleTV.jpg" alt="Apple TV+" />
                  <img src="https://upload.wikimedia.org/wikipedia/commons/1/17/HBO_Max_Logo.svg" alt="Max" />
                  <img src="/assets/posters/Paramount_Global.svg.png" alt="Paramount+" />
                  <img src="https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg" alt="Netflix" />
          </div>
        </div>
          </div>
          </div>
        </div>
      </section>

      {/* Streaming Experience Section */}
      <section className="streaming-experience-section">
        <div className="streaming-experience-container">
          <div className="streaming-experience-image">
            <img src="/assets/posters/movies.jpg" alt="Streaming Experience" />
          </div>
          <div className="streaming-experience-content">
            <h2>All Your Favorites, Streaming in One Place</h2>
            <p>Enjoy seamless access to a world of entertainment. Stream the latest blockbusters, timeless classics, and trending shows—all from the comfort of your home. Discover, watch, and enjoy with no limits.</p>
          </div>
        </div>
      </section>

      {/* Movie Night Section */}
      <section className="movie-night-section">
        <div className="movie-night-container">
          <div className="movie-night-content">
            <h2>Movie Night, Redefined</h2>
            <p>Grab your popcorn and settle in! Whether it's a solo binge or a family movie night, our platform brings the cinema experience to you. Relax, snack, and let the stories unfold.</p>
          </div>
          <div className="movie-night-image">
            <img src="/assets/posters/movie2.jpg" alt="Person with Popcorn" />
          </div>
        </div>
      </section>

      {/* Info Features Section */}
      <section className="info-features-section">
        <h2 className="info-features-title">ALL THIS AND MORE...</h2>
        <div className="info-features-row">
          <div className="info-feature-block">
            <span className="info-feature-icon" style={{color: 'var(--secondary-color)'}}>
              <svg width="56" height="56" viewBox="0 0 48 48"><g><rect x="8" y="14" width="32" height="20" rx="3" fill="none" stroke="var(--secondary-color)" strokeWidth="3"/><rect x="16" y="22" width="8" height="4" rx="1" fill="var(--secondary-color)"/><rect x="28" y="22" width="8" height="4" rx="1" fill="var(--secondary-color)"/></g></svg>
            </span>
            <div className="info-feature-headline">Stream live and on demand TV</div>
          </div>
          <div className="info-feature-block">
            <span className="info-feature-icon" style={{color: 'var(--secondary-color)'}}>
              <svg width="56" height="56" viewBox="0 0 48 48"><g><rect x="8" y="14" width="32" height="20" rx="3" fill="none" stroke="var(--secondary-color)" strokeWidth="3"/><path d="M24 34v4" stroke="var(--secondary-color)" strokeWidth="3"/><circle cx="24" cy="40" r="2" fill="var(--secondary-color)"/></g></svg>
            </span>
            <div className="info-feature-headline">All you need is Wi-Fi - no dish, no box, no need for an aerial</div>
          </div>
          <div className="info-feature-block">
            <span className="info-feature-icon info-feature-stat" style={{color: 'var(--secondary-color)', fontWeight: 'bold', fontSize: '2.8rem'}}>97%</span>
            <div className="info-feature-headline">of the most popular shows available</div>
          </div>
          <div className="info-feature-block">
            <span className="info-feature-icon" style={{color: 'var(--secondary-color)'}}>
              <svg width="56" height="56" viewBox="0 0 48 48"><g><rect x="8" y="14" width="32" height="20" rx="3" fill="none" stroke="var(--secondary-color)" strokeWidth="3"/><polygon points="20,22 32,24 20,26" fill="var(--secondary-color)"/></g></svg>
            </span>
            <div className="info-feature-headline">Pause and restart live TV</div>
          </div>
          <div className="info-feature-block">
            <span className="info-feature-icon" style={{color: 'var(--secondary-color)'}}>
              <svg width="56" height="56" viewBox="0 0 48 48"><g><rect x="16" y="16" width="16" height="16" rx="3" fill="none" stroke="var(--secondary-color)" strokeWidth="3"/><circle cx="24" cy="24" r="4" fill="var(--secondary-color)"/></g></svg>
            </span>
            <div className="info-feature-headline">Just press the Freely button on your remote</div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="categories-section">
        <h2>Explore by Category</h2>
        <div className="categories-grid">
          {categories.map((category, index) => (
            <div key={index} className="category-card" style={{cursor: 'pointer'}}>
              <div className="category-icon">{category.icon}</div>
              <h3>{category.name}</h3>
              <span className="content-count">{category.count}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Infinity Slideshow Section */}
      <section className="infinity-slideshow-section">
        <h2>Endless Entertainment</h2>
        <div className="infinity-slideshow-container">
          <div className="infinity-slideshow" ref={infinitySliderRef}>
            {infinityMovies.map((movie, index) => (
              <div key={index} className="infinity-slide">
                <img src={movie.image} alt={movie.title} />
                <div className="infinity-slide-overlay">
                  <h3>{movie.title}</h3>
                  <button className="play-btn" onClick={() => navigate('/signup')}>
                    <FaPlay />
                  </button>
                </div>
              </div>
            ))}
            </div>
        </div>
      </section>

      {/* Features Grid Section */}
      <section className="features-grid-section">
        <h2>Why Choose Us</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🌟</div>
            <h3>4K Ultra HD</h3>
            <p>Experience crystal clear quality with our 4K streaming technology</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🎮</div>
            <h3>Multi-Device</h3>
            <p>Watch on your TV, laptop, tablet, or phone - anytime, anywhere</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">💾</div>
            <h3>Download & Go</h3>
            <p>Save your favorites and watch them offline</p>
              </div>
          <div className="feature-card">
            <div className="feature-icon">👥</div>
            <h3>Multiple Profiles</h3>
            <p>Create up to 5 profiles for your household</p>
            </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-content">
          <h2>Ready to Start Watching?</h2>
          <p>Join millions of subscribers and get unlimited access to the best content.</p>
          <Link to="/signup" className="cta-button">Start Your Free Trial</Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="footer-content">
          <div className="footer-main">
          <div className="footer-logo" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '0.5rem 1.5rem' }}>
            <Link to="/" className="logo">
              <img src="/assets/posters/logo.jpg" alt="Logo" style={{ width: '250px', height: '100%', borderRadius: '24px', background: '#fff', boxShadow: '0 2px 12px 0 rgba(0,0,0,0.18)', border: '2.5px solid hsl(var(--accent))', display: 'block', margin: '0 auto' }} />
            </Link>
            <p className="footer-description" style={{ textAlign: 'center', marginTop: '1rem' }}>
              Your premier destination for quality entertainment, bringing you the best in movies, TV shows, and documentaries.
            </p>
          </div>
          <div className="footer-links">
              <div className="footer-section">
              <h3>Company</h3>
              <Link to="/about">About Us</Link>
                <Link to="/careers">Careers</Link>
              <Link to="/press">Press</Link>
                <Link to="/blog">Blog</Link>
            </div>
              <div className="footer-section">
              <h3>Watch</h3>
              <Link to="/movies">Movies</Link>
              <Link to="/tv-shows">TV Shows</Link>
                <Link to="/documentaries">Documentaries</Link>
                <Link to="/new-releases">New Releases</Link>
            </div>
              <div className="footer-section">
              <h3>Support</h3>
              <Link to="/contact">Contact Us</Link>
                <Link to="/faq">Search or browse FAQs</Link>
                <Link to="/updates">Updates and alerts</Link>
                <Link to="/legal">Legal and policies</Link>
                <Link to="/software-updates">Software updates</Link>
                <Link to="/feedback">Product feedback</Link>
            </div>
              <div className="footer-section">
              <h3>Connect</h3>
                <div className="footer-social-icons">
                  <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook"><FaFacebook /></a>
                  <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter"><FaTwitter /></a>
                  <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram"><FaInstagram /></a>
                  <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer" aria-label="Tiktok"><FaTiktok /></a>
                  <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" aria-label="Youtube"><FaYoutube /></a>
                </div>
              </div>
            </div>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2024 Prince Fani Production. All rights reserved.</p>
          <div className="footer-legal">
            <Link to="/privacy">Privacy Policy</Link>
            <Link to="/terms">Terms of Service</Link>
            <Link to="/cookies">Cookie Preferences</Link>
          </div>
        </div>
      </footer>
    </div>
  );
} 