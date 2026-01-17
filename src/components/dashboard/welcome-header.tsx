'use client';

import { useState, useEffect } from 'react';
import { Hand } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { signOut } from 'firebase/auth';
import { auth } from '@/firebase/auth';

type WelcomeHeaderProps = {
  name: string;
};

export default function WelcomeHeader({ name }: WelcomeHeaderProps) {
  const [greeting, setGreeting] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const currentHour = new Date().getHours();
    if (currentHour < 12) {
      setGreeting('Good morning');
    } else if (currentHour < 18) {
      setGreeting('Good afternoon');
    } else {
      setGreeting('Good evening');
    }
  }, []);

  const handleLogout = async () => {
    setLoading(true);
    try {
      await signOut(auth);
      router.push('/');
    } catch (e) {
      console.error('Logout failed', e);
    } finally {
      setLoading(false);
    }
  };

  if (!greeting) {
    return (
      <div className="flex items-center gap-2">
        <h1 className="font-headline text-3xl font-bold tracking-tighter">
          Welcome, {name.split(' ')[0]}!
        </h1>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4 justify-between w-full">
      <div className="flex items-center gap-2">
        <h1 className="font-headline text-3xl font-bold tracking-tighter">
          {greeting}, {name.split(' ')[0]}!
        </h1>
        <Hand className="h-8 w-8 text-yellow-400" />
      </div>
      <div>
        <button
          onClick={handleLogout}
          disabled={loading}
          className="px-3 py-2 rounded-md border border-white/10 text-sm hover:border-white/20 disabled:opacity-60"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
