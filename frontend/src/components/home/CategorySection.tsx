'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { AppImage } from '@/components/ui/AppImage';

type Category = {
  _id: string;
  name: string;
  slug: string;
  image: string;
};


export function CategorySection() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories/active`, {
          cache: 'no-store',
        });
        const data = await res.json();
        if (Array.isArray(data)) setCategories(data);
        else if (Array.isArray(data.data)) setCategories(data.data);
        setLoading(false);
      } catch (error) {
        console.error('Category fetch error:', error);
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  return (
    <section className="bg-white pt-6 pb-0 px-6">
      <div className="container mx-auto max-w-4xl">
        <div className="flex flex-col items-center mb-12">
          <h2 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight text-center">
            What are you looking for today?
          </h2>
        </div>

        {loading ? (
          <div className="flex flex-col items-center gap-3 py-8">
            <div className="w-8 h-8 border-4 border-green-100 border-t-green-600 rounded-full animate-spin"></div>
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">
              Fetching Categories...
            </p>
          </div>
        ) : categories.length === 0 ? (
          <p className="text-center text-gray-400 font-bold uppercase tracking-widest text-xs">
            No categories found
          </p>
        ) : (
          <div className="flex flex-wrap gap-6 md:gap-10 justify-center pb-8">
            {categories.map((category) => (
              <Link
                href={`/category/${category.slug || category._id}`}
                key={category._id}
                className="flex flex-col items-center cursor-pointer group w-[110px]"
              >
                <div className="relative w-20 h-20 rounded-full bg-[#1a5d3b] flex items-center justify-center shadow-lg group-hover:shadow-2xl group-hover:shadow-green-900/40 group-hover:scale-105 transition-all duration-300 ease-out">
                  <div className="relative w-10 h-10 z-10 transition-transform duration-500">
                    <AppImage
                      src={category.image}
                      alt={category.name}
                      fill
                      unoptimized
                      className="object-contain brightness-0 invert opacity-100 transition-transform duration-500 group-hover:scale-110"
                      style={{ filter: 'brightness(0) invert(1)' }}
                    />
                  </div>
                </div>

                <p className="mt-4 text-[11px] font-black text-gray-600 group-hover:text-green-700 transition duration-300 text-center tracking-tight leading-tight">
                  {category.name}
                </p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
