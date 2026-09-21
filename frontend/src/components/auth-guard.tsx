'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/auth-store';
import { isPrivilegedAdmin } from '@/lib/roles';

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { isAuthenticated, user, loadProfile } = useAuthStore();

  useEffect(() => {
    const token = localStorage.getItem('accessToken');

    if (!token) {
      if (!isAuthenticated) router.push('/login');
      return;
    }

    if (!user) {
      loadProfile();
    }
  }, [isAuthenticated, loadProfile, router, user]);

  useEffect(() => {
    if (user?.role === 'OFFICE_BOY') {
      router.replace('/office-boy/dashboard');
    }
  }, [user, router]);

  if (!isAuthenticated && typeof window !== 'undefined' && !localStorage.getItem('accessToken')) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-600 border-t-transparent" />
      </div>
    );
  }

  if (user?.role === 'OFFICE_BOY') return null;

  return <>{children}</>;
}

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const { user } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (user && !isPrivilegedAdmin(user.role)) {
      router.push('/dashboard');
    }
  }, [user, router]);

  if (!isPrivilegedAdmin(user?.role)) return null;
  return <>{children}</>;
}

export function OfficeBoyGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { isAuthenticated, user, loadProfile } = useAuthStore();

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      router.replace('/login');
      return;
    }
    if (!user) {
      loadProfile();
    }
  }, [isAuthenticated, loadProfile, router, user]);

  useEffect(() => {
    if (user && user.role !== 'OFFICE_BOY') {
      router.replace('/dashboard');
    }
  }, [user, router]);

  if (!user || user.role !== 'OFFICE_BOY') {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-600 border-t-transparent" />
      </div>
    );
  }

  return <>{children}</>;
}
