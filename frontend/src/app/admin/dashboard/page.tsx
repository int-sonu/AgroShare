'use client';

import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import DashboardCards from '@/components/admin/DashboardCards';

interface DashboardStats {
  totalUsers: number;
  totalSellers: number;
  totalCategories: number;
  pendingSellers: number;
}

export default function AdminDashboard() {
  const { accessToken, user, loading } = useAuth();
  const router = useRouter();

  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [error, setError] = useState('');

  const fetchDashboard = useCallback(async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/dashboard`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || 'Failed to fetch dashboard');
      }

      setStats(result.data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    }
  }, [accessToken]);

  useEffect(() => {
    if (!loading) {
      if (!user || user.role !== 'admin') {
        router.push('/');
      } else {
        fetchDashboard();
      }
    }
  }, [loading, user, router, fetchDashboard]);

  if (loading) return <div className="p-10">Loading...</div>;

  return (
    <div className="p-8 max-w-[1600px] mx-auto space-y-8">
      <div>
        <h1 className="text-xl font-black text-slate-900 tracking-tighter leading-none uppercase">
          Admin <span className="text-primary">Dashboard</span>
        </h1>
        <p className=" text-slate-900 mt-1.5 text-[11px] font-bold uppercase tracking-widest max-w-lg leading-relaxed">
          Monitor your platform&apos;s core growth metrics
        </p>
      </div>

      {error && (
        <div className="bg-rose-50 border border-rose-100 text-rose-600 p-4 rounded-xl flex items-center gap-3 animate-in fade-in">
          <p className="font-bold uppercase tracking-tight text-[10px]">{error}</p>
        </div>
      )}

      {stats && <DashboardCards stats={stats} />}
    </div>
  );
}
