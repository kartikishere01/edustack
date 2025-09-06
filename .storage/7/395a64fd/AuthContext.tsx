import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthState, User } from '@/types';
import { getUsers, saveUser, getCurrentUser, setCurrentUser, initializeData } from '@/lib/storage';

const AuthContext = createContext<AuthState | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Initialize mock data on first load
    initializeData();
    
    // Check for existing user session
    const currentUser = getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
      setIsAuthenticated(true);
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    const users = getUsers();
    const foundUser = users.find(u => u.email === email && u.password === password);
    
    if (foundUser) {
      setUser(foundUser);
      setIsAuthenticated(true);
      setCurrentUser(foundUser);
      return true;
    }
    
    return false;
  };

  const signup = async (userData: Omit<User, 'id' | 'createdAt'>): Promise<boolean> => {
    const users = getUsers();
    const existingUser = users.find(u => u.email === userData.email);
    
    if (existingUser) {
      return false; // User already exists
    }
    
    const newUser: User = {
      ...userData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      enrolledCourses: userData.role === 'student' ? [] : undefined,
      completedChunks: userData.role === 'student' ? [] : undefined,
      badges: userData.role === 'student' ? [] : undefined,
      streak: userData.role === 'student' ? 0 : undefined,
      subjects: userData.role === 'tutor' ? [] : undefined,
      isApproved: userData.role === 'tutor' ? false : undefined,
      accessScore: userData.role === 'tutor' ? 0 : undefined,
    };
    
    saveUser(newUser);
    setUser(newUser);
    setIsAuthenticated(true);
    setCurrentUser(newUser);
    return true;
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    setCurrentUser(null);
  };

  const value: AuthState = {
    user,
    isAuthenticated,
    login,
    signup,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};