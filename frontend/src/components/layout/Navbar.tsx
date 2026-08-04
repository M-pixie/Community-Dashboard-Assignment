'use client';

import { useTheme } from '@wrksz/themes/client';
import { Moon, Sun, Bell, Menu, User, Users, Activity, Settings, HelpCircle, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useEffect, useState } from 'react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Sidebar } from './Sidebar';
import { useAuth } from '@/providers/AuthProvider';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
} from '@/components/ui/dropdown-menu';

export function Navbar() {
  const { theme, setTheme } = useTheme();
  const { user, logout } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="h-16 border-b border-border/40 bg-background/60 backdrop-blur-xl flex items-center justify-between px-6 sticky top-0 z-30 transition-all duration-300">
      <div className="flex items-center gap-4 flex-1">
        <Sheet>
          <SheetTrigger className="lg:hidden hover:bg-muted/50 rounded-full p-2 outline-none focus-visible:ring-2 focus-visible:ring-primary text-muted-foreground transition-colors flex items-center justify-center h-9 w-9">
            <Menu className="h-5 w-5" />
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-72 border-r-0">
            <Sidebar />
          </SheetContent>
        </Sheet>
        
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-muted/40 hover:bg-muted/60 border border-border/50 rounded-full text-muted-foreground w-64 transition-all focus-within:w-72 focus-within:ring-2 focus-within:ring-primary/20">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-50"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
          <input type="text" placeholder="Search..." className="bg-transparent border-none outline-none text-sm w-full placeholder:text-muted-foreground/70" />
          <kbd className="hidden lg:inline-flex h-5 items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100"><span className="text-xs">⌘</span>K</kbd>
        </div>
      </div>
      <div className="flex items-center space-x-4">
        {mounted && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="text-muted-foreground"
          >
            {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
        )}
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="rounded-full outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 hover:ring-2 hover:ring-primary/20 transition-all border-none bg-transparent p-0 cursor-pointer">
              <Avatar className="h-8 w-8 border-2 border-transparent shadow-sm hover:opacity-90 transition-all">
                <AvatarImage src={user?.avatar} alt={user?.name || "User"} />
                <AvatarFallback className="bg-primary text-primary-foreground font-semibold">{user?.name?.substring(0,2) || 'CM'}</AvatarFallback>
              </Avatar>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-64 p-2 rounded-2xl shadow-2xl shadow-black/5 border-border/50 bg-background/95 backdrop-blur-2xl ring-1 ring-white/10 dark:ring-white/5 animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 duration-200">
            <DropdownMenuGroup>
              <div className="flex flex-col px-3 py-2.5 mb-1 bg-muted/30 rounded-xl">
                <span className="text-sm font-semibold text-foreground tracking-tight">{user?.name || "My Account"}</span>
                <span className="text-xs text-muted-foreground truncate">{user?.email || "user@example.com"}</span>
              </div>
              <DropdownMenuSeparator className="my-1.5 opacity-50" />
              
              <DropdownMenuItem onClick={() => window.location.href = '/settings'} className="cursor-pointer rounded-lg transition-all hover:bg-primary/10 focus:bg-primary/10 py-2.5 px-3 flex items-center gap-2.5 group">
                <User className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" /> 
                <span className="font-medium group-hover:text-primary transition-colors">Profile</span>
              </DropdownMenuItem>
              
              <DropdownMenuItem onClick={() => window.location.href = '/settings'} className="cursor-pointer rounded-lg transition-all hover:bg-primary/10 focus:bg-primary/10 py-2.5 px-3 flex items-center gap-2.5 group">
                <Settings className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" /> 
                <span className="font-medium group-hover:text-primary transition-colors">Settings</span>
              </DropdownMenuItem>
              
              <DropdownMenuItem onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className="cursor-pointer rounded-lg transition-all hover:bg-primary/10 focus:bg-primary/10 py-2.5 px-3 flex items-center gap-2.5 group">
                {theme === 'dark' ? <Sun className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" /> : <Moon className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />} 
                <span className="font-medium group-hover:text-primary transition-colors">Toggle Theme</span>
              </DropdownMenuItem>

              <DropdownMenuSeparator className="my-1.5 opacity-50" />
              <DropdownMenuItem onClick={logout} className="text-rose-500 font-medium cursor-pointer rounded-lg transition-all hover:bg-rose-500/10 focus:bg-rose-500/10 focus:text-rose-600 py-2.5 px-3 flex items-center gap-2.5 group">
                <LogOut className="h-4 w-4 text-rose-500 group-hover:text-rose-600 transition-colors" /> 
                <span className="font-medium">Log out</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
