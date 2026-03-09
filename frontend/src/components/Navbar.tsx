'use client';

import Link from 'next/link';
import { Search, ShoppingCart } from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/context/AuthContext';

export default function Navbar() {
  const { user, logout, loading } = useAuth();

  if (loading) return null;

  return (
    <nav className="sticky top-0 z-50 w-full bg-white shadow-sm">
      <div className="border-b border-gray-100 bg-green-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/images/logo.png"
              alt="AgroShare Logo"
              width={42}
              height={42}
              className="object-contain"
              priority
            />
            <span className="text-2xl font-bold text-gray-900">
              AgroShare<span className="text-green-600">.</span>
            </span>
          </Link>

          <div className="hidden md:flex flex-1 max-w-xl mx-8 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />

            <Input
              placeholder="Search farming equipment..."
              className="pl-10 rounded-full bg-white border border-gray-100 shadow-sm focus-visible:ring-green-200"
            />
          </div>

          <div className="flex items-center gap-5">
            {!user && (
              <>
                <Link href="/auth/register">
                  <Button className="bg-green-600 hover:bg-green-700 text-white rounded-full px-5">
                    Signup
                  </Button>
                </Link>

                <Link
                  href="/auth/login"
                  className="text-gray-700 font-medium hover:text-green-600 transition"
                >
                  Login
                </Link>
              </>
            )}

            {user && (
              <>
                <span className="text-sm font-medium text-gray-700">Hi, {user.name}</span>

                <Button
                  onClick={logout}
                  className="bg-red-500 hover:bg-red-600 text-white rounded-full px-5"
                >
                  Logout
                </Button>
              </>
            )}

            <div className="relative flex items-center gap-3 cursor-pointer group">
              <div className="relative">
                <ShoppingCart className="h-6 w-6 text-gray-700 group-hover:text-green-600 transition" />

                <Badge className="absolute -top-2 -right-2 bg-green-600 text-white text-xs">
                  2
                </Badge>
              </div>

              <div className="hidden sm:block text-sm">
                <p className="text-gray-500">Cart</p>
                <p className="font-semibold text-green-600">₹89,250</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="border-b border-gray-100 bg-white">
        <div className="max-w-7xl mx-auto flex justify-center gap-10 py-3 text-sm font-semibold">
          <Link href="/" className="text-gray-800 hover:text-green-600 transition">
            HOME
          </Link>

          <Link href="/categories" className="text-gray-800 hover:text-green-600 transition">
            CATEGORIES
          </Link>

          <Link href="/about" className="text-gray-800 hover:text-green-600 transition">
            ABOUT
          </Link>

          <Link href="/contact" className="text-gray-800 hover:text-green-600 transition">
            CONTACT
          </Link>
        </div>
      </div>
    </nav>
  );
}
