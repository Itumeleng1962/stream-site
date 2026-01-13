import { createContext, useState, useContext, ReactNode } from 'react';

// Define the content type
interface Content {
  id: number;
  title: string;
  image?: string;
  year?: string;
  type: string;
}

// Define the context type
interface WatchlistContextType {
  watchlist: Content[];
  addToWatchlist: (content: Content) => void;
  removeFromWatchlist: (contentId: number) => void;
  isInWatchlist: (contentId: number) => boolean;
}

// Create the context with a default value
export const WatchlistContext = createContext<WatchlistContextType>({
  watchlist: [],
  addToWatchlist: () => {},
  removeFromWatchlist: () => {},
  isInWatchlist: () => false,
});

// Create the provider component
interface WatchlistProviderProps {
  children: ReactNode;
}

export const WatchlistProvider = ({ children }: WatchlistProviderProps) => {
  const [watchlist, setWatchlist] = useState<Content[]>([]);

  const addToWatchlist = (content: Content) => {
    if (!isInWatchlist(content.id)) {
      setWatchlist(prev => [...prev, content]);
    }
  };

  const removeFromWatchlist = (contentId: number) => {
    setWatchlist(prev => prev.filter(item => item.id !== contentId));
  };

  const isInWatchlist = (contentId: number) => {
    return watchlist.some(item => item.id === contentId);
  };

  return (
    <WatchlistContext.Provider 
      value={{ 
        watchlist, 
        addToWatchlist, 
        removeFromWatchlist, 
        isInWatchlist 
      }}
    >
      {children}
    </WatchlistContext.Provider>
  );
};

// Custom hook for using the watchlist context
export const useWatchlist = () => {
  const context = useContext(WatchlistContext);
  if (!context) {
    throw new Error('useWatchlist must be used within a WatchlistProvider');
  }
  return context;
}; 