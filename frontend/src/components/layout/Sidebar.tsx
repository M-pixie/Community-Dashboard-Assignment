'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { LayoutDashboard, Users, Settings, Activity, Calendar, Home, LogOut } from 'lucide-react';
import { useAuth } from '@/providers/AuthProvider';
import { motion } from 'framer-motion';

const routes = [
  {
    label: 'Home',
    icon: Home,
    href: '/',
    color: 'text-zinc-500 group-hover:text-blue-500 dark:text-zinc-400 dark:group-hover:text-blue-400',
    activeColor: 'text-blue-500 dark:text-blue-400',
  },
  {
    label: 'Dashboard',
    icon: LayoutDashboard,
    href: '/dashboard',
    color: 'text-zinc-500 group-hover:text-primary dark:text-zinc-400 dark:group-hover:text-primary',
    activeColor: 'text-primary',
  },
  {
    label: 'Members',
    icon: Users,
    href: '/members',
    color: 'text-zinc-500 group-hover:text-violet-500 dark:text-zinc-400 dark:group-hover:text-violet-400',
    activeColor: 'text-violet-500 dark:text-violet-400',
  },
  {
    label: 'Activity',
    icon: Activity,
    href: '/activity',
    color: 'text-zinc-500 group-hover:text-pink-600 dark:text-zinc-400 dark:group-hover:text-pink-500',
    activeColor: 'text-pink-600 dark:text-pink-500',
  },
  {
    label: 'Events',
    icon: Calendar,
    href: '/events',
    color: 'text-zinc-500 group-hover:text-emerald-500 dark:text-zinc-400 dark:group-hover:text-emerald-400',
    activeColor: 'text-emerald-500 dark:text-emerald-400',
  },
  {
    label: 'Settings',
    icon: Settings,
    href: '/settings',
    color: 'text-zinc-500 group-hover:text-zinc-900 dark:text-zinc-400 dark:group-hover:text-zinc-100',
    activeColor: 'text-zinc-900 dark:text-zinc-100',
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  return (
    <div className="py-4 flex flex-col h-full bg-zinc-50/50 dark:bg-zinc-950/50 border-r border-border/40 w-64 hidden lg:flex shrink-0">
      <div className="px-4 py-2 flex-1 flex flex-col">
        <Link href="/" className="flex items-center pl-2 mb-10 mt-2 transition-opacity hover:opacity-80">
          <h1 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-white truncate pr-2">
            {user ? user.name : 'Community Dash'}
          </h1>
        </Link>
        <div className="space-y-1.5 flex-1">
          {routes.map((route) => {
            const isActive = pathname === route.href;
            return (
              <Link
                key={route.href}
                href={route.href}
                className={cn(
                  'text-sm group flex p-2.5 w-full justify-start font-medium cursor-pointer rounded-lg transition-all relative overflow-hidden',
                  isActive 
                    ? 'text-zinc-900 dark:text-zinc-100' 
                    : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200/40 dark:hover:bg-zinc-800/40 hover:text-zinc-900 dark:hover:text-zinc-100'
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="sidebar-active-pill"
                    className="absolute inset-0 bg-white dark:bg-zinc-800/60 shadow-sm border border-zinc-200 dark:border-zinc-800 rounded-lg -z-10"
                    initial={false}
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
                <div className="flex items-center flex-1 z-10 px-1">
                  <route.icon className={cn('h-[18px] w-[18px] mr-3 transition-colors', isActive ? route.activeColor : route.color)} />
                  {route.label}
                </div>
              </Link>
            );
          })}
        </div>
        
        <div className="mt-auto pt-4 pb-2">
          <button
            onClick={logout}
            className="text-sm group flex p-2.5 w-full justify-start font-medium cursor-pointer rounded-lg transition-all text-rose-600 dark:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10"
          >
            <div className="flex items-center flex-1 px-1">
              <LogOut className="h-[18px] w-[18px] mr-3 group-hover:scale-110 transition-transform" />
              Log out
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
