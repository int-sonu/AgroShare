'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { Search, Mail, Phone, Calendar, ShieldCheck } from 'lucide-react';

import {
  Table,
  TableHeader,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
} from '@/components/ui/table';

interface User {
  _id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  status: string;
  createdAt: string;
}

export default function UsersPage() {
  const { accessToken, user, loading } = useAuth();
  const router = useRouter();

  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter] = useState('all');

  const fetchUsers = useCallback(async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/users`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const result = await res.json();

      if (!res.ok) throw new Error(result.message);

      setUsers(result.data || []);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to fetch users');
    }
  }, [accessToken]);

  useEffect(() => {
    if (!loading) {
      if (!user || user.role !== 'admin') {
        router.push('/');
      } else {
        fetchUsers();
      }
    }
  }, [loading, user, router, fetchUsers]);

  const filteredUsers = useMemo(() => {
    if (!Array.isArray(users)) return [];
    return users.filter((u) => {
      const matchesSearch =
        u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.phone?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = statusFilter === 'all' || u.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [users, searchTerm, statusFilter]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-[1600px] mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-xl font-black text-slate-900 tracking-tighter leading-none uppercase">
            Users <span className="text-primary">Network</span>
          </h1>
          <p className="text-slate-500 text-sm mt-1 font-medium">
            Manage your application users, roles and permissions.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative group">
            <Search
              size={14}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-900 group-focus-within:text-primary transition-colors"
            />
            <input
              type="text"
              placeholder="SEARCH USERS..."
              className="bg-white border border-slate-100 px-10 py-2.5 rounded-xl text-[10px] w-64 outline-none focus:ring-4 focus:ring-primary/10 transition-all placeholder:text-slate-900 font-bold uppercase tracking-tight"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-rose-50 border border-rose-100 text-rose-600 p-6 rounded-2xl flex items-center gap-4 animate-in fade-in slide-in-from-top-4">
          <ShieldCheck size={24} />
          <p className="font-bold uppercase tracking-tight text-sm">{error}</p>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50/50 border-none hover:bg-slate-50/50">
              <TableHead className="p-4 pl-6 text-slate-900 uppercase text-[9px] font-black tracking-[0.2em]">
                User Identity
              </TableHead>
              <TableHead className="p-4 text-slate-900 uppercase text-[9px] font-black tracking-[0.2em]">
                Contact Line
              </TableHead>
              <TableHead className="p-4 text-slate-900 uppercase text-[9px] font-black tracking-[0.2em]">
                Status
              </TableHead>
              <TableHead className="p-4 text-slate-900 uppercase text-[9px] font-black tracking-[0.2em]">
                Joined
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody className="divide-y divide-slate-50/50">
            {filteredUsers.length > 0 ? (
              filteredUsers.map((u) => (
                <TableRow
                  key={u._id}
                  className="group border-none hover:bg-slate-50/30 transition-all font-bold"
                >
                  <TableCell className="p-4 pl-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center text-[13px] font-black shadow-sm group-hover:scale-105 transition-transform">
                        {u.name?.charAt(0).toUpperCase()}
                      </div>

                      <div>
                        <p className="font-black text-slate-900 text-[13px] tracking-tight uppercase leading-tight">
                          {u.name}
                        </p>
                        <div className="flex items-center gap-1.5 mt-0.5 text-slate-400">
                          <ShieldCheck size={9} strokeWidth={3} />
                          <p className="text-[9px] font-black uppercase tracking-tight">
                            {u.role || 'CUSTOMER'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell className="p-4">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2 text-slate-900 font-bold text-[10px]">
                        <Mail size={12} strokeWidth={2.5} />
                        <span>{u.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-900 font-black text-[9px] uppercase tracking-tight">
                        <Phone size={12} strokeWidth={2.5} />
                        <span>{u.phone}</span>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell className="p-4">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-xl text-[9px] font-black uppercase tracking-widest border border-slate-100 ${
                        u.status === 'active'
                          ? 'bg-primary/10 text-primary'
                          : 'bg-rose-50 text-rose-700'
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full mr-2 ${u.status === 'active' ? 'bg-primary' : 'bg-rose-500'}`}
                      ></span>
                      {u.status}
                    </span>
                  </TableCell>

                  <TableCell className="p-4">
                    <div className="flex items-center gap-1.5 text-slate-900 font-black text-[9px] uppercase tracking-tight">
                      <Calendar size={12} strokeWidth={2.5} />
                      {new Date(u.createdAt).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="h-64 text-center">
                  <div className="flex flex-col items-center justify-center text-slate-500">
                    <Search size={40} className="mb-4 opacity-10" />
                    <p className="text-[10px] font-black uppercase tracking-[0.3em]">
                      No Network Results
                    </p>
                    <p className="text-[9px] font-bold mt-1 uppercase tracking-tighter">
                      Try adjusting your internal search queries
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        <div className="bg-slate-50/30 px-6 py-4 flex items-center justify-between border-t border-slate-100"></div>
      </div>
    </div>
  );
}
