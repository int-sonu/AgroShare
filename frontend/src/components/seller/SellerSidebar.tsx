'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Tractor,
  DollarSign,
  Star,
  Users,
  Settings,
} from 'lucide-react';

export default function SellerSidebar() {
  const pathname = usePathname();

  const menu = [
    { name: 'Dashboard', path: '/seller/dashboard', icon: LayoutDashboard },
    { name: 'Products', path: '/seller/products', icon: Package },
    { name: 'Bookings', path: '/seller/bookings', icon: ShoppingCart },
    { name: 'Rentals', path: '/seller/rentals', icon: Tractor },
    { name: 'Earnings', path: '/seller/earnings', icon: DollarSign },
    { name: 'Reviews', path: '/seller/reviews', icon: Star },
    { name: 'Customers', path: '/seller/customers', icon: Users },
    { name: 'Settings', path: '/seller/settings', icon: Settings },
  ];

  return (
    <aside className="fixed top-[72px] left-0 w-64 h-[calc(100vh-72px)] bg-white border-r border-gray-200 flex flex-col">
      <div className="px-6 py-6 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-800">Seller Dashboard</h2>
        <p className="text-xs text-gray-500">Manage your machines</p>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-1">
        {menu.map((item) => {
          const active = pathname === item.path;
          const Icon = item.icon;

          return (
            <Link
              key={item.path}
              href={item.path}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition ${
                active
                  ? 'bg-green-50 text-green-700 font-medium'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Icon size={18} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-200 text-xs text-gray-500">
        AgroShare Seller v1.0
      </div>
    </aside>
  );
}
