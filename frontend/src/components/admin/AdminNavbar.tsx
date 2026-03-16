'use client';

import { Bell, Search, Mail, MessageCircle, User, LogOut } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useRouter } from 'next/navigation';
export default function AdminNavbar() {
  const { user, logout } = useAuth();
  const router = useRouter();
  return (
    <header className="h-16 bg-white/80 backdrop-blur-xl border-b border-slate-100 flex items-center justify-between px-8 sticky top-0 z-10 transition-all shadow-sm/5">
      <div className="flex items-center bg-slate-50/50 px-4 py-2 rounded-xl w-96 border border-slate-100 transition-all focus-within:ring-2 focus-within:ring-primary/10 focus-within:border-primary/30">
        <Search size={18} className="text-slate-400 mr-2" />
        <input
          type="text"
          placeholder="Quick search..."
          className="bg-transparent outline-none text-sm w-full text-slate-900 dark:text-slate-100 placeholder:text-slate-500"
        />
      </div>

      <div className="flex items-center gap-6">
        <button className="relative p-2 text-slate-400 hover:text-primary hover:bg-primary/5 rounded-lg transition-all">
          <MessageCircle size={18} />
          <span className="absolute top-1 right-1 bg-primary text-white text-[8px] w-3.5 h-3.5 flex items-center justify-center rounded-full border border-white font-black">
            2
          </span>
        </button>

        <button className="relative p-2 text-slate-400 hover:text-primary hover:bg-primary/5 rounded-lg transition-all">
          <Mail size={18} />
          <span className="absolute top-1 right-1 bg-primary text-white text-[8px] w-3.5 h-3.5 flex items-center justify-center rounded-full border border-white font-black">
            1
          </span>
        </button>

        <button className="relative p-2 text-slate-400 hover:text-primary hover:bg-primary/5 rounded-lg transition-all">
          <Bell size={18} />
          <span className="absolute top-1 right-1 bg-primary text-white text-[8px] w-3.5 h-3.5 flex items-center justify-center rounded-full border border-white font-black">
            3
          </span>
        </button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="flex items-center gap-2.5 p-1 rounded-full transition-all cursor-pointer border border-transparent hover:border-slate-50 group">
              <div className="w-9 h-9 bg-primary/10 text-primary flex items-center justify-center rounded-xl font-black transition-transform group-hover:scale-105">
                {user?.name ? user.name.charAt(0).toUpperCase() : <User size={18} />}
              </div>

              <div className="hidden md:block">
                <p className="text-[11px] font-black text-slate-900 leading-none">
                  {user?.name || 'Admin'}
                </p>
                <p className="text-[9px] font-bold text-slate-400 tracking-tight mt-0.5 uppercase">
                  Administrator
                </p>
              </div>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-56 mt-2 p-2 rounded-2xl border-slate-100 shadow-xl shadow-slate-200/50"
          >
            <DropdownMenuLabel className="px-3 py-2">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">
                Admin Account
              </p>
              <p className="text-xs font-bold text-slate-900 mt-1">{user?.email}</p>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-slate-50" />
            <DropdownMenuItem
              onClick={() => router.push('/admin/profile')}
              className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-slate-600 focus:bg-primary/5 focus:text-primary cursor-pointer transition-colors"
            >
              <User size={14} strokeWidth={2.5} />
              <span className="text-[11px] font-black uppercase tracking-tight">Profile View</span>
            </DropdownMenuItem>

            <DropdownMenuSeparator className="bg-slate-50" />
            <DropdownMenuItem
              onClick={() => logout()}
              className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-rose-500 focus:bg-rose-50 focus:text-rose-600 cursor-pointer transition-colors"
            >
              <LogOut size={14} strokeWidth={2.5} />
              <span className="text-[11px] font-black uppercase tracking-tight">Logout</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
