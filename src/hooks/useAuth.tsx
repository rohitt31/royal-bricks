import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { authAPI } from '@/lib/api';

interface User {
  id: string;
  email: string;
  fullName: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAdmin: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Check if user is already logged in
    const checkAuth = async () => {
      const token = localStorage.getItem('adminToken');
      if (token) {
        try {
          const response = await authAPI.getCurrentUser();
          if (response.success && response.data.user) {
            setUser(response.data.user);
            setIsAdmin(response.data.user.role === 'admin');
          }
        } catch (error) {
          console.error('Auth check failed:', error);
          localStorage.removeItem('adminToken');
        }
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const response = await authAPI.login(email, password);
      if (response.success && response.data.user) {
        setUser(response.data.user);
        setIsAdmin(response.data.user.role === 'admin');
        return { error: null };
      }
      return { error: new Error(response.message || 'Login failed') };
    } catch (error: any) {
      return { error: new Error(error.message || 'Login failed') };
    }
  };

  const signOut = async () => {
    authAPI.logout();
    setUser(null);
    setIsAdmin(false);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, isAdmin, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
