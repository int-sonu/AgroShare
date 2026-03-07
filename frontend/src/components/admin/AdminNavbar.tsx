"use client";

import { Bell, Search, Mail, MessageCircle } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function AdminNavbar() {
  const { user } = useAuth();

  return (
    <header className="h-16 bg-gray-900 text-white border-b border-gray-800 flex items-center justify-between px-6">

      <div className="flex items-center bg-white  px-3 py-2 rounded-md w-96">
        <Search size={18} className="text-gray-400 mr-2" />
        <input
          type="text"
          placeholder="Search users, machines, orders..."
          className="bg-transparent outline-none text-sm w-full text-white placeholder-gray-400"
        />
      </div>

      <div className="flex items-center gap-6">

        <button className="relative hover:text-green-400 transition">
          <MessageCircle size={20} />
          <span className="absolute -top-1 -right-1 bg-green-600 text-xs w-4 h-4 flex items-center justify-center rounded-full">
            2
          </span>
        </button>

        <button className="relative hover:text-green-400 transition">
          <Mail size={20} />
          <span className="absolute -top-1 -right-1 bg-green-600 text-xs w-4 h-4 flex items-center justify-center rounded-full">
            1
          </span>
        </button>

        <button className="relative hover:text-green-400 transition">
          <Bell size={20} />
          <span className="absolute -top-1 -right-1 bg-green-600 text-xs w-4 h-4 flex items-center justify-center rounded-full">
            3
          </span>
        </button>

        <div className="flex items-center gap-2 cursor-pointer">
          <div className="w-8 h-8 bg-green-600 text-white flex items-center justify-center rounded-full font-semibold">
            {user?.name?.charAt(0)}
          </div>

          <span className="text-sm hidden md:block">
            {user?.name}
          </span>
        </div>

      </div>
    </header>
  );
}