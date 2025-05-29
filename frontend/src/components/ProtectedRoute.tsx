'use client';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'admin' | 'user';
}

export default function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { user, loading, isAuthenticated, isAdmin } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated) {
        router.push('/auth/login');
      } else if (requiredRole === 'admin' && !isAdmin) {
        router.push('/dashboard');
      } else if (requiredRole === 'user' && isAdmin) {
        router.push('/admin');
      }
    }
  }, [loading, isAuthenticated, isAdmin, requiredRole, router]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return null;
  }

  if (requiredRole === 'admin' && !isAdmin) {
    return null;
  }

  if (requiredRole === 'user' && isAdmin) {
    return null;
  }

  return <>{children}</>;
} 