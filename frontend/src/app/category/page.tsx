'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

type Category = {
  _id: string;
  name: string;
  slug: string;
  image: string;
  description?: string;
};

export default function AllCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories/active`);
        const data = await res.json();
        if (data.success) {
          setCategories(data.data);
        }
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="w-10 h-10 border-4 border-green-100 border-t-green-600 rounded-full animate-spin"></div>
        <p className="text-[11px] font-black uppercase tracking-widest text-gray-400">
          Loading Categories...
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen pb-24 font-sans">
      <div className="bg-green-50/50 border-b border-gray-100 py-12 md:py-20 mb-12">
        <div className="container max-w-7xl mx-auto px-6">
          <Badge className="bg-green-600 text-white mb-4 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border-0">
            Marketplace
          </Badge>
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tighter mb-4">
            Browse Categories
          </h1>
          <p className="text-gray-500 max-w-2xl font-bold text-base leading-relaxed">
            Select a category to discover specialized equipment for your agricultural projects.
          </p>
        </div>
      </div>

      <div className="container max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {categories.map((category) => (
            <Link
              key={category._id}
              href={`/category/${category.slug || category._id}`}
              className="group"
            >
              <div className="bg-gray-50 rounded-[2.5rem] p-8 h-full border-2 border-transparent hover:border-green-100 hover:bg-white hover:shadow-2xl hover:shadow-green-900/10 transition-all duration-500 flex flex-col items-center text-center">
                <div className="relative w-24 h-24 bg-[#1a5d3b] rounded-full flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-500">
                  <div className="relative w-12 h-12 z-10">
                    <Image
                      src={getImageUrl(category.image)}
                      alt={category.name}
                      fill
                      unoptimized
                      className="object-contain brightness-0 invert"
                    />
                  </div>
                </div>

                <h3 className="text-xl font-black text-gray-900 mb-3 tracking-tight group-hover:text-green-600 transition-colors">
                  {category.name}
                </h3>

                <p className="text-gray-400 font-bold text-[12px] leading-relaxed mb-6 line-clamp-2 uppercase tracking-tight">
                  {category.description ||
                    `High-performance ${category.name} equipment available for rent.`}
                </p>

                <div className="mt-auto flex items-center gap-2 text-green-600 font-black text-[10px] uppercase tracking-widest group-hover:gap-4 transition-all">
                  Explore Now <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
