import React from 'react';

// Common props interface for components
export interface ComponentProps {
  className?: string;
  id?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

// Add other common types here
export interface ApiResponse<T = any> {
  data?: T;
  error?: {
    message: string;
    code: string;
  };
}

export interface User {
  id: string;
  email: string;
  name?: string;
  role: 'user' | 'admin';
  createdAt: string;
  updatedAt: string;
} 