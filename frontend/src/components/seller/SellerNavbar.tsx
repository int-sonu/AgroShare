'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Bell, Search, User } from 'lucide-react';

export default function SellerNavbar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();

  const menu = [
    { name: 'Dashboard', path: '/seller/dashboard' },
    { name: 'Products', path: '/seller/products' },
    { name: 'Orders', path: '/seller/orders' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 h-[72px] bg-green-600 flex items-center z-50 shadow-md">
      <div className="w-full flex justify-between items-center px-10">
        <h1 className="font-semibold text-xl text-white">AgroShare Seller</h1>

        <div className="flex items-center gap-6 text-sm">
          {menu.map((item) => {
            const active = pathname === item.path;

            return (
              <Link
                key={item.path}
                href={item.path}
                className={`transition ${
                  active ? 'text-white font-semibold' : 'text-green-100 hover:text-white'
                }`}
              >
                {item.name}
              </Link>
            );
          })}
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center bg-white rounded-md px-3 py-1.5">
            <Search size={16} className="text-gray-500" />
            <input type="text" placeholder="Search..." className="outline-none ml-2 text-sm" />
          </div>

          <button className="text-white hover:text-green-200">
            <Bell size={20} />
          </button>

          <div className="flex items-center gap-2 text-white">
            <User size={20} />
            <span className="text-sm">{user?.name || 'Seller'}</span>
          </div>

          <button
            onClick={logout}
            className="bg-white text-green-700 px-3 py-1.5 rounded-md text-sm hover:bg-gray-100"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}
