'use client';

import { MoonStar, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useThemeMode } from '@/context/ThemeContext';

export function ThemeToggle({ variant = 'icon' }: { variant?: 'icon' | 'pill' }) {
  const { mode, toggleMode } = useThemeMode();
  const isMono = mode === 'mono';

  if (variant === 'pill') {
    return (
      <button
        type="button"
        onClick={toggleMode}
        className={
          isMono
            ? 'px-4 py-2 rounded-full border-2 border-slate-900 bg-white text-sm font-semibold hover:bg-slate-900 hover:text-white transition'
            : 'px-4 py-2 rounded-lg border border-white/70 hover:border-white transition bg-white/40 text-sm'
        }
        aria-label={isMono ? 'Switch to default theme' : 'Switch to monochrome theme'}
      >
        {isMono ? 'Monochrome' : 'Default'}
      </button>
    );
  }

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      onClick={toggleMode}
      aria-label={isMono ? 'Switch to default theme' : 'Switch to monochrome theme'}
      title={isMono ? 'Monochrome' : 'Default'}
    >
      {isMono ? <Sun className="h-5 w-5" /> : <MoonStar className="h-5 w-5" />}
    </Button>
  );
}
