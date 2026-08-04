'use client';

import Link from 'next/link';
import { ArrowRight, Sparkles, Users, Activity, Lock, ChevronRight, BarChart3, Globe, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white selection:bg-primary/30 overflow-hidden font-sans">
      
      {/* Navbar (Public) */}
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="absolute top-0 w-full z-50 border-b border-white/5 bg-black/50 backdrop-blur-xl"
      >
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="size-8 rounded-lg bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center shadow-lg shadow-primary/20">
              <Users className="text-white size-4" />
            </div>
            <span className="font-bold text-lg tracking-tight">CommuniDash</span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/login" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">
              Sign in
            </Link>
            <Link href="/login">
              <Button className="rounded-full bg-white text-black hover:bg-zinc-200 shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(255,255,255,0.2)] transition-all">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </motion.header>

      {/* Hero Section */}
      <main className="relative pt-32 pb-20 lg:pt-48 lg:pb-32">
        {/* Abstract Background Blobs - Animated */}
        <motion.div 
          animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/30 rounded-full blur-[120px] pointer-events-none" 
        />
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-purple-500/20 rounded-full blur-[100px] pointer-events-none" 
        />
        <motion.div 
          animate={{ scale: [1, 1.15, 1], opacity: [0.2, 0.3, 0.2] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-blue-500/20 rounded-full blur-[100px] pointer-events-none" 
        />

        <div className="container mx-auto px-6 relative z-10 flex flex-col items-center text-center">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 text-sm text-zinc-300 mb-8 backdrop-blur-md shadow-lg"
          >
            <Sparkles className="size-4 text-primary" />
            <span className="font-medium">Introducing the next-gen dashboard</span>
            <ChevronRight className="size-4 opacity-50" />
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-5xl lg:text-7xl font-bold tracking-tighter max-w-5xl bg-gradient-to-br from-white via-white to-white/40 bg-clip-text text-transparent mb-6 leading-tight"
          >
            Scale your community <br className="hidden md:block"/> with <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-400">absolute clarity.</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-lg lg:text-xl text-zinc-400 max-w-2xl mb-10 leading-relaxed"
          >
            CommuniDash is the ultimate platform to analyze engagement, track active members, and grow your community faster than ever before.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center gap-4"
          >
            <Link href="/login">
              <Button size="lg" className="rounded-full h-14 px-8 text-base font-semibold bg-white text-black hover:bg-zinc-200 gap-2 shadow-[0_0_40px_rgba(255,255,255,0.15)] hover:shadow-[0_0_60px_rgba(255,255,255,0.25)] transition-all">
                Start for free <ArrowRight className="size-4" />
              </Button>
            </Link>
          </motion.div>
        </div>

        {/* Dashboard Preview Mockup */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="container mx-auto px-6 mt-24 relative z-10 perspective-1000"
        >
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-2 backdrop-blur-2xl shadow-2xl shadow-primary/20 max-w-5xl mx-auto overflow-hidden transform-gpu hover:scale-[1.01] transition-transform duration-700">
            <div className="rounded-xl overflow-hidden border border-white/5 bg-zinc-950 relative aspect-[16/9]">
              
              <div className="absolute top-0 w-full h-12 border-b border-white/5 bg-zinc-950/80 flex items-center px-4 gap-2">
                 <div className="size-3 rounded-full bg-rose-500/80" />
                 <div className="size-3 rounded-full bg-amber-500/80" />
                 <div className="size-3 rounded-full bg-emerald-500/80" />
              </div>

              {/* Fake Dashboard UI */}
              <div className="absolute top-12 bottom-0 left-0 right-0 flex">
                {/* Fake Sidebar */}
                <div className="w-48 border-r border-white/5 bg-zinc-950/50 p-4 hidden md:block">
                  <div className="space-y-4">
                    <div className="h-8 w-full bg-primary/20 border border-primary/20 rounded-lg" />
                    <div className="h-8 w-full bg-white/5 rounded-lg" />
                    <div className="h-8 w-full bg-white/5 rounded-lg" />
                    <div className="h-8 w-full bg-white/5 rounded-lg" />
                  </div>
                </div>
                {/* Fake Main Content */}
                <div className="flex-1 p-6 lg:p-10 space-y-6">
                  <div className="flex justify-between items-center mb-4">
                    <div className="h-8 w-40 bg-white/10 rounded-lg" />
                    <div className="h-10 w-10 bg-white/10 rounded-full" />
                  </div>
                  <div className="grid grid-cols-3 gap-6">
                    <div className="h-28 bg-white/[0.03] border border-white/5 rounded-2xl relative overflow-hidden">
                       <div className="absolute top-0 right-0 p-4 opacity-20"><Activity className="size-8" /></div>
                    </div>
                    <div className="h-28 bg-white/[0.03] border border-white/5 rounded-2xl relative overflow-hidden">
                       <div className="absolute top-0 right-0 p-4 opacity-20"><Users className="size-8" /></div>
                    </div>
                    <div className="h-28 bg-white/[0.03] border border-white/5 rounded-2xl relative overflow-hidden">
                       <div className="absolute top-0 right-0 p-4 opacity-20"><Globe className="size-8" /></div>
                    </div>
                  </div>
                  <div className="h-[250px] bg-white/[0.03] border border-white/5 rounded-2xl flex items-end p-6 gap-4">
                     {/* Fake Chart bars */}
                     {[40, 70, 45, 90, 65, 100, 80].map((h, i) => (
                       <div key={i} className="flex-1 bg-gradient-to-t from-primary/50 to-primary rounded-t-sm" style={{ height: `${h}%` }} />
                     ))}
                  </div>
                </div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent pointer-events-none" />
            </div>
          </div>
        </motion.div>
      </main>

      {/* Features Grid */}
      <section className="py-32 relative z-10">
        <div className="absolute top-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        
        <div className="container mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-3xl lg:text-5xl font-bold tracking-tight mb-6">Everything you need to scale</h2>
            <p className="text-zinc-400 text-lg max-w-2xl mx-auto">Powerful tools designed specifically for modern community managers looking for deep insights.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Feature 1 */}
            <motion.div 
              whileHover={{ y: -5, scale: 1.02 }}
              className="group p-8 rounded-3xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-all duration-300 shadow-xl hover:shadow-2xl hover:shadow-blue-500/10"
            >
              <div className="size-12 rounded-xl bg-blue-500/10 flex items-center justify-center mb-6 border border-blue-500/20 group-hover:bg-blue-500/20 transition-colors">
                <Activity className="size-6 text-blue-400" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">Real-time Analytics</h3>
              <p className="text-zinc-400 leading-relaxed">Track your community's pulse with live data, engagement scores, and beautiful interactive charts.</p>
            </motion.div>
            
            {/* Feature 2 */}
            <motion.div 
              whileHover={{ y: -5, scale: 1.02 }}
              className="group p-8 rounded-3xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-all duration-300 shadow-xl hover:shadow-2xl hover:shadow-emerald-500/10"
            >
              <div className="size-12 rounded-xl bg-emerald-500/10 flex items-center justify-center mb-6 border border-emerald-500/20 group-hover:bg-emerald-500/20 transition-colors">
                <Users className="size-6 text-emerald-400" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">Member Management</h3>
              <p className="text-zinc-400 leading-relaxed">Easily view, search, and manage all your members in a blazingly fast, searchable data table.</p>
            </motion.div>
            
            {/* Feature 3 */}
            <motion.div 
              whileHover={{ y: -5, scale: 1.02 }}
              className="group p-8 rounded-3xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-all duration-300 shadow-xl hover:shadow-2xl hover:shadow-purple-500/10"
            >
              <div className="size-12 rounded-xl bg-purple-500/10 flex items-center justify-center mb-6 border border-purple-500/20 group-hover:bg-purple-500/20 transition-colors">
                <Zap className="size-6 text-purple-400" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">Lighting Fast</h3>
              <p className="text-zinc-400 leading-relaxed">Built on a modern architecture offering sub-millisecond page transitions and instant updates.</p>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="py-12 border-t border-white/5 text-center text-sm text-zinc-500 relative z-10 bg-black">
        <div className="flex items-center justify-center gap-2 mb-4">
          <div className="size-6 rounded-md bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center">
            <Users className="text-white size-3" />
          </div>
          <span className="font-bold text-white tracking-tight">CommuniDash</span>
        </div>
        <p>© {new Date().getFullYear()} CommuniDash Inc. All rights reserved.</p>
      </footer>
    </div>
  );
}
