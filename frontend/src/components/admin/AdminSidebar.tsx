'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  Tractor,
  ShoppingCart,
  Layers,
  CreditCard,
  Star,
  BarChart,
  Settings,
  HelpCircle,
} from 'lucide-react';
import Image from 'next/image';

export default function AdminSidebar() {
  const pathname = usePathname();

  const linkClass = (path: string) =>
    `flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-[10.5px] font-bold uppercase tracking-[0.08em] transition-all duration-300 ${
      pathname === path
        ? 'bg-primary/10 text-primary shadow-sm border border-primary/5'
        : 'text-slate-900 hover:text-primary hover:bg-slate-50'
    }`;

  return (
    <aside className="w-64 bg-white text-slate-900 h-screen sticky top-0 p-6 flex flex-col border-r border-slate-100 overflow-y-auto no-scrollbar shadow-sm">
      <div className="mb-10 px-1 flex items-center gap-3 group cursor-pointer">
        <div className="relative w-10 h-10 bg-primary/10 p-2 rounded-xl shadow-sm group-hover:scale-105 transition-transform duration-500 overflow-hidden">
          <Image src="/images/logo.png" alt="AgroShare Logo" fill className="object-contain p-2" />
        </div>
        <h2 className="text-xl font-black tracking-tighter text-slate-900">
          Agro<span className="text-primary">Share</span>
        </h2>
      </div>

      <nav className="flex-1 space-y-1">
        <Link href="/admin/dashboard" className={linkClass('/admin/dashboard')}>
          <LayoutDashboard size={14} strokeWidth={2.5} />
          <span>Dashboard</span>
        </Link>

        <Link href="/admin/users" className={linkClass('/admin/users')}>
          <Users size={14} strokeWidth={2.5} />
          <span>Users</span>
        </Link>

        <Link href="/admin/sellers" className={linkClass('/admin/sellers')}>
          <Users size={14} strokeWidth={2.5} />
          <span>Sellers</span>
        </Link>

        <Link href="/admin/categories" className={linkClass('/admin/categories')}>
          <Layers size={14} strokeWidth={2.5} />
          <span>Categories</span>
        </Link>

        <Link href="/admin/machines" className={linkClass('/admin/machines')}>
          <Tractor size={14} strokeWidth={2.5} />
          <span>Machines</span>
        </Link>

        <Link href="/admin/orders" className={linkClass('/admin/orders')}>
          <ShoppingCart size={14} strokeWidth={2.5} />
          <span>Orders</span>
        </Link>

        <Link href="/admin/payments" className={linkClass('/admin/payments')}>
          <CreditCard size={14} strokeWidth={2.5} />
          <span>Payments</span>
        </Link>

        <Link href="/admin/reviews" className={linkClass('/admin/reviews')}>
          <Star size={14} strokeWidth={2.5} />
          <span>Reviews</span>
        </Link>

        <Link href="/admin/reports" className={linkClass('/admin/reports')}>
          <BarChart size={14} strokeWidth={2.5} />
          <span>Reports</span>
        </Link>
      </nav>

      <div className="mt-auto pt-6 border-t border-slate-100 space-y-1">
        <Link href="/admin/settings" className={linkClass('/admin/settings')}>
          <Settings size={14} strokeWidth={2.5} />
          <span>Settings</span>
        </Link>
        <Link href="/admin/support" className={linkClass('/admin/support')}>
          <HelpCircle size={14} strokeWidth={2.5} />
          <span>Support</span>
        </Link>
      </div>
    </aside>
  );
}
