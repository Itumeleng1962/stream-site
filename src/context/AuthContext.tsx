import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  clearError: () => void;
  updateAvatar?: (file: File) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check for saved user data on mount
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, _password: string) => {
    // Simulate login - replace with actual authentication
    try {
      // In a real app, you would validate the password here
      const mockUser = {
        id: '1',
        name: 'Test User',
        email: email,
        avatar: undefined
      };
      setUser(mockUser);
      localStorage.setItem('user', JSON.stringify(mockUser));
      navigate('/profile');
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const signup = async (name: string, email: string, _password: string) => {
    // Simulate signup - replace with actual registration
    try {
      // In a real app, you would hash the password and create a new user
      const mockUser = {
        id: '1',
        name: name,
        email: email,
        avatar: undefined
      };
      setUser(mockUser);
      localStorage.setItem('user', JSON.stringify(mockUser));
      navigate('/profile');
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    navigate('/');
  };

  const clearError = () => {
    setError(null);
  };

  const updateAvatar = async (file: File) => {
    if (!user) return;
    
    try {
      // Create a URL for the uploaded file
      const avatarUrl = URL.createObjectURL(file);
      
      // Update user with new avatar
      const updatedUser = {
        ...user,
        avatar: avatarUrl
      };
      
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    } catch (error) {
      console.error('Error updating avatar:', error);
      throw error;
    }
  };

  const value = {
    user,
    loading,
    error,
    login,
    signup,
    logout,
    clearError,
    updateAvatar
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 