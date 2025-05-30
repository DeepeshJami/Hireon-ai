import React from 'react';
import { Outlet } from 'react-router-dom';
import { useTheme } from 'next-themes';
import { Sun, Moon } from 'lucide-react';
import Footer from '../components/layout/Footer';
import { Button } from '../components/ui/button';
import HireonLogo from '../components/HireonLogo';

const MainLayout = () => {
  const { theme, setTheme } = useTheme();

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <header className="bg-card border-b border-border shadow-sm p-4 sticky top-0 z-50">
        <div className="w-full flex items-center justify-between">
          <div className="flex items-center gap-2">
            <HireonLogo style={{ fontSize: '1rem' }} />
          </div>
          
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
      </header>

      <main className="flex-grow w-full">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
};

export default MainLayout; 