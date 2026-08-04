'use client';

import { useState } from 'react';
import { Loader2, Users, Calendar, Activity } from 'lucide-react';
import { motion } from 'framer-motion';

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleLogin = () => {
    setIsLoading(true);
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
    window.location.href = `${baseUrl}/auth/google`;
  };

  const GoogleIcon = () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
  );

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] text-zinc-900 font-sans relative overflow-hidden">
      
      {/* Subtle modern background grids/gradients */}
      <div className="absolute top-0 inset-x-0 h-64 bg-gradient-to-b from-blue-50 to-transparent pointer-events-none" />

      <div className="w-full max-w-6xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center z-10 min-h-screen">
        
        {/* Left Side: Features & Value Proposition */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="order-2 lg:order-1 flex flex-col justify-center"
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6 leading-[1.15] text-zinc-900">
            Manage your <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
              Community
            </span> smarter.
          </h1>
          
          <p className="text-zinc-500 text-lg mb-10 max-w-md leading-relaxed">
            CommuniDash is the all-in-one CMS that gives you full control over your technical community, events, and analytics.
          </p>

          <ul className="space-y-8">
            <li className="flex items-start gap-4">
              <div className="size-12 rounded-2xl bg-white flex items-center justify-center border border-zinc-200 shrink-0 shadow-sm">
                <Users className="size-5 text-blue-600" />
              </div>
              <div className="pt-1">
                <h3 className="font-semibold text-zinc-900 text-base">Centralized Member Database</h3>
                <p className="text-sm text-zinc-500 mt-1.5 leading-relaxed">Track profiles, engagement scores, and activity across your entire community.</p>
              </div>
            </li>
            <li className="flex items-start gap-4">
              <div className="size-12 rounded-2xl bg-white flex items-center justify-center border border-zinc-200 shrink-0 shadow-sm">
                <Calendar className="size-5 text-indigo-600" />
              </div>
              <div className="pt-1">
                <h3 className="font-semibold text-zinc-900 text-base">Event Scheduling & RSVPs</h3>
                <p className="text-sm text-zinc-500 mt-1.5 leading-relaxed">Create events, track attendance, and monitor capacities in real-time.</p>
              </div>
            </li>
            <li className="flex items-start gap-4">
              <div className="size-12 rounded-2xl bg-white flex items-center justify-center border border-zinc-200 shrink-0 shadow-sm">
                <Activity className="size-5 text-rose-500" />
              </div>
              <div className="pt-1">
                <h3 className="font-semibold text-zinc-900 text-base">Advanced Analytics Dashboard</h3>
                <p className="text-sm text-zinc-500 mt-1.5 leading-relaxed">Gain insights into community growth, retention, and daily active interactions.</p>
              </div>
            </li>
          </ul>
        </motion.div>

        {/* Right Side: Clean White Login Modal */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
          className="order-1 lg:order-2 w-full max-w-[400px] mx-auto lg:ml-auto"
        >
          <div className="bg-white border border-zinc-200 p-8 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative">
            
            <div className="text-center mb-8">
              <div className="mx-auto size-12 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center mb-5 shadow-sm">
                <Users className="text-white size-6" />
              </div>
              <h2 className="text-2xl font-bold text-zinc-900 tracking-tight mb-2">Create Account</h2>
              <p className="text-sm text-zinc-500 leading-relaxed px-1">
                Join CommuniDash to manage your community, track events, and analyze engagement.
              </p>
            </div>

            <button 
              onClick={handleGoogleLogin}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-3 p-3.5 bg-white hover:bg-zinc-50 transition-all border border-zinc-200 rounded-xl group shadow-sm hover:shadow-md"
            >
              {isLoading ? <Loader2 className="size-5 text-zinc-400 animate-spin" /> : <GoogleIcon />}
              <span className="text-[15px] font-semibold text-zinc-700">
                {isLoading ? "Authenticating..." : "Sign in with Google"}
              </span>
            </button>
            
            <p className="text-center text-[12px] font-medium text-zinc-400 mt-6">
              Protected by Enterprise-grade security.
            </p>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
