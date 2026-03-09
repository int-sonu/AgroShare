'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export default function SellerNavbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-green-700 text-white px-6 py-3 flex justify-between items-center">
      <h1 className="font-bold text-lg">Seller Panel</h1>

      <div className="flex gap-6 items-center">
        <Link href="/seller/dashboard">Dashboard</Link>
        <Link href="/seller/products">Products</Link>
        <Link href="/seller/orders">Orders</Link>

        <span className="text-sm">Hi, {user?.name}</span>

        <button onClick={logout} className="bg-white text-green-700 px-3 py-1 rounded">
          Logout
        </button>
      </div>
    </nav>
  );
}
