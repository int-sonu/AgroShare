'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, ShoppingCart, ChevronDown, MapPin } from 'lucide-react';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/context/AuthContext';
import LocationModal from './machine/LocationModal';

type Category = {
  _id: string;
  name: string;
  slug: string;
};

export default function Navbar() {
  const pathname = usePathname();
  const { user, logout, loading } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [isCategoriesHovered, setIsCategoriesHovered] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState('Select City');
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);

  const isDashboard = pathname?.startsWith('/admin') || pathname?.startsWith('/seller');

  useEffect(() => {
    const saved = localStorage.getItem('selectedLocation');
    if (saved && saved !== selectedLocation) {
      setTimeout(() => setSelectedLocation(saved), 0);
    }

    const fetchCategories = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories/active`, {
          cache: 'no-store',
        });
        const data = await res.json();

        if (Array.isArray(data)) {
          setCategories(data);
        } else if (Array.isArray(data.data)) {
          setCategories(data.data);
        } else if (Array.isArray(data.categories)) {
          setCategories(data.categories);
        }
      } catch (error) {
        console.error('Failed to fetch categories for navbar:', error);
      }
    };

    fetchCategories();
  }, [selectedLocation]);

  const handleLocationSelect = (location: string) => {
    setSelectedLocation(location);
    localStorage.setItem('selectedLocation', location);
    setIsLocationModalOpen(false);

    window.dispatchEvent(new CustomEvent('locationChanged', { detail: location }));
  };

  if (loading || isDashboard) return null;

  return (
    <>
      <nav className="sticky top-0 z-50 w-full bg-white shadow-sm font-sans">
        <div className="border-b border-gray-100 bg-green-50/50">
          <div className="max-w-7xl mx-auto flex items-center justify-between px-4 md:px-6 py-3">
            <Link href="/" className="flex items-center gap-2 shrink-0">
              <Image
                src="/images/logo.png"
                alt="AgroShare Logo"
                width={38}
                height={38}
                className="object-contain"
                priority
              />
              <span className="text-xl md:text-2xl font-black text-gray-900 tracking-tight">
                AgroShare<span className="text-green-600">.</span>
              </span>
            </Link>

            <div className="hidden md:flex flex-1 max-w-2xl mx-6 lg:mx-10 h-11 bg-white rounded-full border border-gray-200 shadow-sm overflow-hidden focus-within:ring-2 focus-within:ring-green-100 focus-within:border-green-400 transition-all">
              <div
                onClick={() => setIsLocationModalOpen(true)}
                className="flex items-center gap-1.5 px-4 border-r border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors"
              >
                <MapPin className="w-4 h-4 text-green-600" />
                <span className="text-[13px] font-bold text-gray-700 whitespace-nowrap truncate max-w-[120px]">
                  {selectedLocation.split(',')[0]}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
              </div>

              <div className="flex-1 flex items-center px-4 relative">
                <Search className="w-4 h-4 text-gray-400 mr-2.5" />
                <Input
                  placeholder="Search tractors, harvesters, equipment..."
                  className="border-0 bg-transparent p-0 h-full text-[13px] focus-visible:ring-0 placeholder:text-gray-400 placeholder:font-medium"
                />
                <Button className="absolute right-1 text-[11px] font-black uppercase tracking-wider bg-green-600 hover:bg-green-700 text-white h-9 rounded-full px-4 shadow-sm shadow-green-600/20">
                  Search
                </Button>
              </div>
            </div>

            <div className="flex items-center gap-4 md:gap-6">
              {!user ? (
                <div className="flex items-center gap-3">
                  <Link
                    href="/auth/login"
                    className="text-[13px] font-black uppercase tracking-wider text-gray-600 hover:text-green-600 transition"
                  >
                    Login
                  </Link>
                  <Link href="/auth/register">
                    <Button className="bg-green-600 hover:bg-green-700 text-white rounded-full px-4 h-9 text-[11px] font-black uppercase tracking-wider shadow-sm shadow-green-600/10">
                      Join Free
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <span className="text-[13px] font-black text-gray-800 hidden sm:block">
                    Hi, {user?.name?.split(' ')[0] || 'User'}
                  </span>
                  <Button
                    onClick={logout}
                    variant="outline"
                    className="rounded-full px-4 h-9 text-[11px] font-black uppercase tracking-wider border-gray-200 text-rose-500 hover:bg-rose-50 hover:border-rose-100"
                  >
                    Logout
                  </Button>
                </div>
              )}

              <div className="relative flex items-center gap-2 cursor-pointer group">
                <div className="relative p-1">
                  <ShoppingCart className="h-6 w-6 text-gray-700 group-hover:text-green-600 transition" />
                  <Badge className="absolute -top-1 -right-1 bg-green-600 text-white text-[9px] min-w-[16px] h-4 p-0 flex items-center justify-center rounded-full border-2 border-white">
                    2
                  </Badge>
                </div>
                <div className="hidden lg:block text-xs">
                  <p className="text-gray-400 font-bold uppercase text-[9px] tracking-widest leading-none mb-0.5">
                    My Cart
                  </p>
                  <p className="font-black text-green-600">₹89,250</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-b border-gray-100 bg-white">
          <div className="max-w-7xl mx-auto flex justify-center gap-8 md:gap-12 py-3 text-[11px] font-black uppercase tracking-widest">
            <Link href="/" className="text-gray-800 hover:text-green-600 transition">
              HOME
            </Link>

            <div
              className="relative group flex items-center h-full"
              onMouseEnter={() => setIsCategoriesHovered(true)}
              onMouseLeave={() => setIsCategoriesHovered(false)}
            >
              <div className="flex items-center gap-1 cursor-pointer text-gray-800 hover:text-green-600 transition">
                <Link href="/category">CATEGORIES</Link>
                <ChevronDown
                  className={`w-3 h-3 transition-transform duration-200 ${isCategoriesHovered ? 'rotate-180' : ''}`}
                />
              </div>

              <div
                className={`absolute top-full left-1/2 -translate-x-1/2 w-64 bg-white rounded-2xl shadow-xl border border-gray-100 py-3 px-2 transition-all duration-300 origin-top z-50 ${
                  isCategoriesHovered
                    ? 'opacity-100 scale-100 visible translate-y-0'
                    : 'opacity-0 scale-95 invisible -translate-y-2'
                }`}
              >
                {categories.length > 0 ? (
                  <div className="grid grid-cols-1 gap-1">
                    {categories.map((cat) => (
                      <Link
                        key={cat._id}
                        href={`/category/${cat.slug || cat._id}`}
                        className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-[12px] font-bold text-gray-700 hover:bg-green-50 hover:text-green-700 transition-all group/item"
                      >
                        <span>{cat.name}</span>
                        <ChevronDown className="w-3 h-3 -rotate-90 opacity-0 group-hover/item:opacity-100 transition-all -translate-x-2 group-hover/item:translate-x-0" />
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="px-4 py-8 text-[11px] text-gray-400 font-bold text-center uppercase tracking-widest flex flex-col items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-ping"></div>
                    Loading Categories...
                  </div>
                )}
              </div>
            </div>

            <Link href="/contact" className="text-gray-800 hover:text-green-600 transition">
              CONTACT
            </Link>

            <Link href="/about" className="text-gray-800 hover:text-green-600 transition">
              ABOUT
            </Link>
          </div>
        </div>
      </nav>

      <LocationModal
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
        onSelect={handleLocationSelect}
        currentLocation={selectedLocation}
      />
    </>
  );
}
