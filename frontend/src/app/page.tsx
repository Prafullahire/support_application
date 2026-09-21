'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/auth-store';
import { LoadingState } from '@/components/ui/loading-state';

export default function HomePage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    const { user } = useAuthStore.getState();
    if (token || isAuthenticated) {
      if (user?.role === 'OFFICE_BOY') {
        router.replace('/office-boy/dashboard');
      } else {
        router.replace('/dashboard');
      }
    } else {
      router.replace('/login');
    }
  }, [isAuthenticated, router]);

  return <LoadingState height="h-screen" message="Redirecting..." />;
}
