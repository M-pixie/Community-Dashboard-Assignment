'use client';

import { useState } from 'react';
import { useMembers, Member } from '@/hooks/useMembers';
import { useDebounce } from '@/hooks/useDebounce';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Download, Search, ChevronLeft, ChevronRight, ArrowUpDown } from 'lucide-react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export default function MembersPage() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('All');
  const [sortBy, setSortBy] = useState('joinedDate');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const debouncedSearch = useDebounce(search, 500);

  const { data, isLoading, isError } = useMembers({
    page,
    limit: 10,
    search: debouncedSearch,
    status,
    sortBy,
    sortOrder,
  });

  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('desc');
    }
    setPage(1); // Reset to first page on sort
  };

  const handleExportCSV = () => {
    if (!data?.data) return;
    
    const headers = ['Name', 'Email', 'Joined Date', 'Last Active', 'Engagement Score', 'Status'];
    const csvContent = [
      headers.join(','),
      ...data.data.map((m: Member) => [
        `"${m.name}"`,
        `"${m.email}"`,
        `"${format(new Date(m.joinedDate), 'yyyy-MM-dd')}"`,
        `"${format(new Date(m.lastActive), 'yyyy-MM-dd')}"`,
        m.engagementScore,
        m.status
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `members_export_${format(new Date(), 'yyyyMMdd')}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success('CSV exported successfully');
  };

  if (isError) {
    return <div className="text-red-500">Error loading members.</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Members</h1>
          <p className="text-muted-foreground mt-1">
            Manage your community members and view their engagement.
          </p>
        </div>
        <Button onClick={handleExportCSV} variant="outline" className="shrink-0">
          <Download className="mr-2 h-4 w-4" />
          Export CSV
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-card p-4 rounded-lg border shadow-sm">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search by name or email..."
            className="pl-8"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-sm font-medium text-muted-foreground">Status:</span>
          <Select
            value={status}
            onValueChange={(val) => {
              setStatus(val);
              setPage(1);
            }}
          >
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Statuses</SelectItem>
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="Inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="rounded-xl border border-border/40 bg-card shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-zinc-50/50 dark:bg-zinc-900/50 hover:bg-zinc-50/50 dark:hover:bg-zinc-900/50 border-b-border/40">
              <TableHead className="font-medium text-muted-foreground h-12">Member</TableHead>
              <TableHead className="cursor-pointer font-medium text-muted-foreground h-12" onClick={() => handleSort('joinedDate')}>
                <div className="flex items-center">
                  Joined
                  <ArrowUpDown className="ml-2 h-3.5 w-3.5 opacity-50" />
                </div>
              </TableHead>
              <TableHead className="cursor-pointer font-medium text-muted-foreground h-12" onClick={() => handleSort('lastActive')}>
                <div className="flex items-center">
                  Last Active
                  <ArrowUpDown className="ml-2 h-3.5 w-3.5 opacity-50" />
                </div>
              </TableHead>
              <TableHead className="cursor-pointer text-right font-medium text-muted-foreground h-12" onClick={() => handleSort('engagementScore')}>
                <div className="flex items-center justify-end">
                  Score
                  <ArrowUpDown className="ml-2 h-3.5 w-3.5 opacity-50" />
                </div>
              </TableHead>
              <TableHead className="text-right font-medium text-muted-foreground h-12 pr-6">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i} className="border-b-border/40">
                  <TableCell className="py-4"><Skeleton className="h-10 w-[200px]" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
                  <TableCell className="text-right"><Skeleton className="h-4 w-[40px] ml-auto" /></TableCell>
                  <TableCell className="text-right pr-6"><Skeleton className="h-6 w-[60px] ml-auto" /></TableCell>
                </TableRow>
              ))
            ) : data?.data?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">
                  No members found.
                </TableCell>
              </TableRow>
            ) : (
              data?.data.map((member: Member) => (
                <TableRow 
                  key={member._id} 
                  className="cursor-pointer border-b-border/40 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors group"
                  onClick={() => router.push(`/members/${member._id}`)}
                >
                  <TableCell className="py-3">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9 border border-border/50 shadow-sm transition-transform group-hover:scale-105">
                        <AvatarImage src={member.avatar} alt={member.name} />
                        <AvatarFallback className="bg-primary/5 text-primary font-medium">{member.name.substring(0,2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="font-semibold text-sm text-zinc-900 dark:text-zinc-100">{member.name}</span>
                        <span className="text-xs text-muted-foreground mt-0.5">{member.email}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {member.joinedDate ? format(new Date(member.joinedDate), 'MMM d, yyyy') : 'N/A'}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {member.lastActive ? format(new Date(member.lastActive), 'MMM d, yyyy') : 'N/A'}
                  </TableCell>
                  <TableCell className="text-right">
                    <span className={`font-semibold text-sm ${
                      member.engagementScore > 75 ? 'text-emerald-600 dark:text-emerald-500' :
                      member.engagementScore < 40 ? 'text-rose-600 dark:text-rose-500' :
                      'text-blue-600 dark:text-blue-500'
                    }`}>
                      {member.engagementScore}
                    </span>
                  </TableCell>
                  <TableCell className="text-right pr-6">
                    <div className="flex justify-end">
                      <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium border ${
                        member.status === 'Active' 
                          ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20 dark:text-emerald-400 dark:border-emerald-500/30' 
                          : 'bg-rose-500/10 text-rose-600 border-rose-500/20 dark:text-rose-400 dark:border-rose-500/30'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                          member.status === 'Active' ? 'bg-emerald-500' : 'bg-rose-500'
                        }`}></span>
                        {member.status}
                      </span>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {data?.pagination && data.pagination.totalPages > 1 && (
        <div className="flex items-center justify-between px-2">
          <div className="text-sm text-muted-foreground">
            Showing <span className="font-medium">{((page - 1) * data.pagination.limit) + 1}</span> to <span className="font-medium">{Math.min(page * data.pagination.limit, data.pagination.total)}</span> of <span className="font-medium">{data.pagination.total}</span> members
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1 || isLoading}
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.min(data.pagination.totalPages, p + 1))}
              disabled={page === data.pagination.totalPages || isLoading}
            >
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      )}
    </motion.div>
  );
}
