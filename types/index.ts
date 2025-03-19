// Base component props interface
export interface ComponentProps {
  className?: string;
  children?: React.ReactNode;
}

// User types
export interface User {
  id: string;
  email: string;
  fullName?: string;
  role: 'user' | 'admin';
  createdAt: Date;
  updatedAt: Date;
}

// API response types
export interface ApiResponse<T = unknown> {
  data?: T;
  error?: string;
  message?: string;
}

// Session types
export interface Session {
  user: User;
  expires: string;
}

// Auth types
export interface AuthState {
  isLoading: boolean;
  isAuthenticated: boolean;
  user: User | null;
  error: string | null;
} 