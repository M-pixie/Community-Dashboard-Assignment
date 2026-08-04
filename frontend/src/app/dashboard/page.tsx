'use client';

import { useDashboardStats } from '@/hooks/useDashboardStats';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Users, UserCheck, UserMinus, Activity, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { 
  Area, 
  AreaChart, 
  ResponsiveContainer, 
  Tooltip, 
  XAxis, 
  YAxis, 
  PieChart, 
  Pie, 
  Cell,
  Legend
} from 'recharts';
import { motion } from 'framer-motion';

const COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444'];

export default function Dashboard() {
  const { data: stats, isLoading, isError } = useDashboardStats();

  if (isError) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <div className="text-center space-y-4">
          <div className="mx-auto w-12 h-12 bg-rose-500/10 rounded-full flex items-center justify-center">
            <Activity className="h-6 w-6 text-rose-500" />
          </div>
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">Failed to load data</h2>
          <p className="text-muted-foreground text-sm max-w-sm">
            We couldn't connect to the dashboard server. Please check your connection and try again.
          </p>
        </div>
      </div>
    );
  }

  const cards = [
    {
      title: 'Total Members',
      value: stats?.totalMembers,
      icon: Users,
      trend: '+12%',
      isPositive: true,
      color: 'text-blue-500',
      bg: 'bg-blue-500/10',
    },
    {
      title: 'Active Members',
      value: stats?.activeMembers,
      icon: UserCheck,
      trend: '+4.2%',
      isPositive: true,
      color: 'text-emerald-500',
      bg: 'bg-emerald-500/10',
    },
    {
      title: 'Inactive Members',
      value: stats?.inactiveMembers,
      icon: UserMinus,
      trend: '-1.5%',
      isPositive: true, // less inactive is positive
      color: 'text-rose-500',
      bg: 'bg-rose-500/10',
    },
    {
      title: 'Avg. Engagement',
      value: stats?.averageEngagementScore,
      icon: Activity,
      trend: '+8.1%',
      isPositive: true,
      color: 'text-violet-500',
      bg: 'bg-violet-500/10',
    },
  ];

  return (
    <div className="space-y-8 pb-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">Overview</h1>
        <p className="text-muted-foreground mt-1.5 text-sm">
          Here's what's happening with your community today.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {cards.map((card, index) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1, ease: "easeOut" }}
          >
            <Card className="overflow-hidden border-border/40 bg-gradient-to-br from-background via-background to-zinc-50/30 dark:to-zinc-900/20 shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-border/80 group">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                  {card.title}
                </CardTitle>
                <div className={`p-2 rounded-xl transition-transform duration-300 group-hover:scale-110 ${card.bg}`}>
                  <card.icon className={`h-4 w-4 ${card.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <Skeleton className="h-10 w-24 mt-1 rounded-lg" />
                ) : (
                  <div className="flex flex-col gap-1">
                    <span className="text-3xl font-bold tracking-tight text-foreground">
                      {card.value}
                    </span>
                    <div className="flex items-center text-xs mt-1">
                      <span className={`flex items-center font-semibold px-1.5 py-0.5 rounded-full bg-background border shadow-sm ${card.isPositive ? 'text-emerald-600 dark:text-emerald-500 border-emerald-500/20 bg-emerald-500/5' : 'text-rose-600 dark:text-rose-500 border-rose-500/20 bg-rose-500/5'}`}>
                        {card.isPositive ? <ArrowUpRight className="h-3 w-3 mr-0.5" /> : <ArrowDownRight className="h-3 w-3 mr-0.5" />}
                        {card.trend}
                      </span>
                      <span className="text-muted-foreground ml-2">from last month</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <motion.div
          className="col-span-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" }}
        >
          <Card className="h-full border-border/50 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold">Activity Over Time</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-[300px] w-full rounded-xl" />
              ) : (
                <div className="h-[320px] w-full mt-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={stats?.activityOverTime} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <XAxis 
                        dataKey="date" 
                        stroke="#888888" 
                        fontSize={12} 
                        tickLine={false} 
                        axisLine={false}
                        dy={10}
                      />
                      <YAxis 
                        stroke="#888888" 
                        fontSize={12} 
                        tickLine={false} 
                        axisLine={false} 
                        tickFormatter={(value) => `${value}`} 
                      />
                      <Tooltip 
                        contentStyle={{ backgroundColor: 'hsl(var(--background))', borderRadius: '8px', border: '1px solid hsl(var(--border))', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        itemStyle={{ color: 'hsl(var(--foreground))', fontSize: '14px', fontWeight: 500 }}
                        cursor={{ stroke: '#3b82f6', strokeWidth: 1, strokeDasharray: '4 4' }}
                      />
                      <Area type="monotone" dataKey="count" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorCount)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div
          className="col-span-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4, ease: "easeOut" }}
        >
          <Card className="h-full border-border/50 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold">Engagement Distribution</CardTitle>
            </CardHeader>
            <CardContent className="flex justify-center items-center h-full pb-10">
              {isLoading ? (
                <Skeleton className="h-[300px] w-full rounded-xl" />
              ) : (
                <div className="h-[300px] w-full relative">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={stats?.engagementDistribution}
                        cx="50%"
                        cy="50%"
                        innerRadius={70}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                        stroke="none"
                      >
                        {stats?.engagementDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ backgroundColor: 'hsl(var(--background))', borderRadius: '8px', border: '1px solid hsl(var(--border))' }}
                        itemStyle={{ color: 'hsl(var(--foreground))', fontSize: '14px', fontWeight: 500 }}
                      />
                      <Legend verticalAlign="bottom" height={36} iconType="circle" />
                    </PieChart>
                  </ResponsiveContainer>
                  {/* Center Text */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none -mt-8">
                    <span className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">{stats?.totalMembers || 0}</span>
                    <span className="text-xs text-muted-foreground">Members</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
