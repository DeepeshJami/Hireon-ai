import React from 'react';
import { Outlet } from 'react-router-dom';
import { useTheme } from 'next-themes';
import { Sun, Moon } from 'lucide-react';
import Footer from '../components/layout/Footer';
import { Button } from '../components/ui/button';
import HireonLogo from '../components/HireonLogo';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '../components/ui/dropdown-menu';

const MainLayout = () => {
  const { theme, setTheme } = useTheme();

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground font-inter">
      <header className="bg-card border-b border-border shadow-sm px-3 sm:px-4 py-3 sticky top-0 z-50">
        <div className="w-full flex flex-row items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <HireonLogo style={{ fontSize: '1.25rem' }} className="text-lg sm:text-xl" />
          </div>
          {/* Controls */}
          <div className="flex items-center gap-2 sm:gap-4">
            <Button 
              variant="outline" 
              size="icon"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <Sun className="h-[1.2rem] w-[1.2rem]" />
              ) : (
                <Moon className="h-[1.2rem] w-[1.2rem]" />
              )}
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-grow w-full">
        <Outlet />
      </main>

      <Footer />
      <style>{`
        .animate-fade-in { animation: fadeInDropdown 0.22s cubic-bezier(.4,0,.2,1) both; }
        @keyframes fadeInDropdown { from { opacity: 0; transform: translateY(-8px) scale(0.98); } to { opacity: 1; transform: none; } }
      `}</style>
    </div>
  );
};

export default MainLayout; 