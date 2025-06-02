import React, { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { useTheme } from 'next-themes';
import { Sun, Moon, LogOut, User } from 'lucide-react';
import Footer from '../components/layout/Footer';
import { Button } from '../components/ui/button';
import HireonLogo from '../components/HireonLogo';
import { GoogleSignIn } from '../components/GoogleSignInUploadPage';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '../components/ui/dropdown-menu';

function decodeJwt(token) {
  if (!token) return null;
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(function (c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
}

const MainLayout = () => {
  const { theme, setTheme } = useTheme();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('g_id_token');
    setIsAuthenticated(!!token);
    setUser(token ? decodeJwt(token) : null);
    // Listen for changes to localStorage (e.g., sign in/out in another tab)
    const handleStorage = () => {
      const t = localStorage.getItem('g_id_token');
      setIsAuthenticated(!!t);
      setUser(t ? decodeJwt(t) : null);
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem('g_id_token');
    setIsAuthenticated(false);
    setUser(null);
  };

  const userInitial = user?.name ? user.name[0].toUpperCase() : 'U';
  const userPic = user?.picture;
  const userName = user?.name || 'User';

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
            {!isAuthenticated ? (
              <GoogleSignIn />
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative group focus:outline-none">
                    <span className="inline-flex items-center justify-center rounded-full transition-all duration-200 shadow-lg group-hover:shadow-xl group-focus:ring-2 group-focus:ring-primary-500 group-hover:ring-2 group-hover:ring-primary-400" style={{boxShadow: '0 2px 12px 0 rgba(0,0,0,0.10)'}}>
                      <Avatar className="h-11 w-11">
                        {userPic && <AvatarImage src={userPic} alt={userName} />}
                        <AvatarFallback className="text-lg font-semibold bg-gradient-to-br from-gray-200 to-gray-400 dark:from-gray-700 dark:to-gray-900">{userInitial}</AvatarFallback>
                      </Avatar>
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 max-w-[90vw] rounded-2xl border-0 shadow-2xl backdrop-blur-md bg-white/80 dark:bg-gray-900/80 ring-1 ring-black/10 dark:ring-white/10 p-0 overflow-hidden animate-fade-in">
                  <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-800">
                    <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Signed in as</div>
                    <div className="font-semibold text-gray-900 dark:text-white text-base leading-tight truncate">{userName}</div>
                  </div>
                  <DropdownMenuSeparator className="my-0" />
                  <DropdownMenuItem disabled className="px-5 py-3 text-gray-400 cursor-not-allowed text-sm">
                    <User className="mr-2 h-4 w-4 opacity-60" /> Profile
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="my-0" />
                  <DropdownMenuItem onClick={handleSignOut} className="px-5 py-3 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 focus:bg-red-100 dark:focus:bg-red-900/40 text-sm font-medium transition-colors">
                    <LogOut className="mr-2 h-4 w-4" /> Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
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