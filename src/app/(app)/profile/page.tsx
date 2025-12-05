
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to a different page since profile is no longer available
    router.replace('/dashboard');
  }, [router]);

  return null;
}
