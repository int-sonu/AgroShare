'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  MapPin,
  CheckCircle2,
  RotateCcw,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AutoImageSlider } from '@/components/ui/AutoImageSlider';
import { ProductCard } from '@/components/products/ProductCard';

type Product = {
  _id: string;
  slug: string;
  machineName: string;
  category?: {
    name: string;
    _id: string;
  };
  pricing: {
    rentalPrice: number;
    priceType: string;
  };
  images: string[];
  location?: {
    district?: string;
    state?: string;
    address?: string;
  };
  specifications?: {
    power?: string | number;
    fuelType?: string;
    [key: string]: unknown;
  };
  condition?: string;
  stock?: number;
  quantity?: number;
};

export function InventorySection() {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLocation, setSelectedLocation] = useState('Select City');

  useEffect(() => {
    const saved = localStorage.getItem('selectedLocation');
    if (saved && saved !== selectedLocation) {
      setSelectedLocation(saved);
    }

    const handleLocationChange = (e: Event) => {
      const customEvent = e as CustomEvent<string>;
      if (customEvent.detail && customEvent.detail !== selectedLocation) {
        setSelectedLocation(customEvent.detail);
      }
    };

    window.addEventListener('locationChanged', handleLocationChange as EventListener);

    return () =>
      window.removeEventListener(
        'locationChanged',
        handleLocationChange as EventListener
      );
  }, [selectedLocation]);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/machines`,
          {
            cache: 'no-store',
          }
        );

        if (!res.ok) {
          throw new Error('Failed to fetch products');
        }

        const data = await res.json();

        const productsList = Array.isArray(data?.data)
          ? data.data
          : Array.isArray(data)
          ? data
          : [];

        setAllProducts(productsList);
      } catch (error) {
        console.error('Product fetch error:', error);
        setAllProducts([]);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  const filteredProducts =
    selectedLocation === 'Select City'
      ? allProducts.slice(0, 8)
      : allProducts.filter((p) => {
          const locString = `${p.location?.district}, ${p.location?.state}`;
          return locString
            .toLowerCase()
            .includes(selectedLocation.toLowerCase());
        });

  const clearFilter = () => {
    localStorage.removeItem('selectedLocation');
    setSelectedLocation('Select City');
    window.dispatchEvent(
      new CustomEvent('locationChanged', { detail: 'Select City' })
    );
  };

  const getImageUrl = (
    image: string | { url?: string; secure_url?: string } | null | undefined,
  ) => {
    if (!image) return '/images/category-placeholder.png';
    const url = typeof image === 'string' ? image : image?.url || image?.secure_url;
    if (!url) return '/images/category-placeholder.png';
    if (url.startsWith('http') || url.startsWith('//')) {
      return url.startsWith('//') ? `https:${url}` : url;
    }
    return `${process.env.NEXT_PUBLIC_API_URL}/${url.replace(/^\//, '')}`;
  };

  return (
    <section className="pt-4 pb-24 bg-white relative overflow-hidden">
      <div className="absolute top-1/2 left-0 w-1/2 h-1/2 bg-green-50/20 blur-[120px] -z-10 rounded-full -translate-x-1/2 -translate-y-1/2"></div>

      <div className="container max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-8 px-2">
          <div>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight leading-none mb-3">
              {selectedLocation !== 'Select City'
                ? `Machinery in ${selectedLocation.split(',')[0]}`
                : 'Featured Equipment'}
            </h2>

            <p className="text-slate-400 font-bold text-sm tracking-tight max-w-md">
              Explore high-performance agricultural machinery available for immediate rent in your
              region.
            </p>
          </div>

          <Link href="/category">
            <Button
              variant="outline"
              className="border-2 border-slate-900 text-slate-900 text-[10px] font-black uppercase tracking-widest h-12 px-10 rounded-2xl hover:bg-slate-900 hover:text-white transition-all shadow-xl shadow-slate-200/50 flex items-center gap-3"
            >
              Discover All <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>

        <div className="p-2 md:p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {loading ? (
              [...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="bg-white rounded-[2rem] h-[380px] animate-pulse border border-slate-100"
                />
              ))
            ) : filteredProducts.length === 0 ? (
              <div className="col-span-full py-20 px-8 bg-white rounded-[2.5rem] border border-slate-200/60 shadow-xl shadow-slate-200/50 flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-6 shadow-inner">
                  <MapPin className="w-7 h-7 text-slate-200" />
                </div>

                <h3 className="text-xl font-black text-slate-900 mb-2 tracking-tighter">
                  No Equipment Nearby
                </h3>

                <p className="text-slate-400 font-bold max-w-sm mb-8 uppercase text-[9px] tracking-widest leading-relaxed">
                  We couldn't find any listings nearby. Try expanding your search.
                </p>

                <Button
                  onClick={clearFilter}
                  className="bg-slate-900 hover:bg-green-600 text-white rounded-xl h-12 px-10 font-black uppercase text-[9px] tracking-widest shadow-2xl shadow-slate-900/20 transition-all active:scale-95"
                >
                  <RotateCcw className="w-4 h-4 mr-2" /> Clear Location Filter
                </Button>
              </div>
            ) : (
              filteredProducts.map((product) => (
                <ProductCard 
                  key={product._id} 
                  product={product as any} 
                  getImageUrl={getImageUrl} 
                />
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
}