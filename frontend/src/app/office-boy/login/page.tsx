'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

/** Office Boy uses the same unified login at /login */
export default function OfficeBoyLoginRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/login');
  }, [router]);

  return null;
}
