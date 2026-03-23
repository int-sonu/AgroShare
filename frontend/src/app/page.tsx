'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Search,
  CalendarCheck,
  Sprout,
  ArrowRight,
  ChevronRight,
  MapPin,
  CheckCircle2,
  RotateCcw,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AutoImageSlider } from '@/components/ui/AutoImageSlider';
import Footer from '@/components/footer';

const BANNER_IMAGES = ['/images/home1.jpg', '/images/home2.jpg'];

type Category = {
  _id: string;
  name: string;
  slug: string;
  image: string;
};

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
  operatorAvailable?: boolean;
  transportAvailable?: boolean;
  condition?: string;
};

export default function Home() {
  const [current, setCurrent] = useState(0);
  const [categories, setCategories] = useState<Category[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [productsLoading, setProductsLoading] = useState(true);
  const [selectedLocation, setSelectedLocation] = useState('Select City');

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
    const saved = localStorage.getItem('selectedLocation');
    if (saved && saved !== selectedLocation) {
      setTimeout(() => setSelectedLocation(saved), 0);
    }

    const handleLocationChange = (e: Event) => {
      const customEvent = e as CustomEvent<string>;
      if (customEvent.detail && customEvent.detail !== selectedLocation) {
        setSelectedLocation(customEvent.detail);
      }
    };

    window.addEventListener('locationChanged', handleLocationChange as EventListener);
    return () =>
      window.removeEventListener('locationChanged', handleLocationChange as EventListener);
  }, [selectedLocation]);

  useEffect(() => {
    const loadCategories = async () => {
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
    loadCategories();
  }, []);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/machines`, {
          cache: 'no-store',
        });
        const data = await res.json();
        const productsList = Array.isArray(data.data) ? data.data : Array.isArray(data) ? data : [];
        setAllProducts(productsList);
        setProductsLoading(false);
      } catch (error) {
        console.error('Product fetch error:', error);
        setProductsLoading(false);
      }
    };
    loadProducts();
  }, []);

  const filteredProducts =
    selectedLocation === 'Select City'
      ? allProducts.slice(0, 8)
      : allProducts.filter((p) => {
          const locString = `${p.location?.district}, ${p.location?.state}`;
          return locString.toLowerCase().includes(selectedLocation.toLowerCase());
        });

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % BANNER_IMAGES.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="font-sans">
      <section className="relative w-full h-[550px] overflow-hidden">
        {BANNER_IMAGES.map((img, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === current ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <Image
              src={img}
              alt="Agro Banner"
              fill
              sizes="100vw"
              className={`object-cover transition-transform duration-[10000ms] ease-linear ${index === current ? 'scale-110' : 'scale-100'}`}
              priority
              unoptimized
            />
          </div>
        ))}

        <div className="absolute inset-0 bg-black/55" />

        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6 text-white max-w-5xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-black mb-6 tracking-tighter leading-[1.1]">
            Empowering Farmers with <br className="hidden md:block" /> Modern Machinery.
          </h1>

          <p className="text-base md:text-[14px] max-w-lg text-gray-200 mb-10 font-bold leading-6">
            A trusted digital marketplace connecting sellers of advanced agricultural equipment{' '}
            <br className="hidden md:block" /> with farmers across the region.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              size="lg"
              className="bg-[#00b34d] hover:bg-[#009e44] rounded-full font-black uppercase text-[11px] tracking-widest h-12 px-10 transition active:scale-95 shadow-xl shadow-green-900/40 flex items-center gap-2"
            >
              Explore Equipment <ChevronRight className="w-5 h-5" />
            </Button>

            <Button
              size="lg"
              variant="outline"
              className="bg-black/30 border-white/20 text-white hover:bg-black/50 rounded-full font-black uppercase text-[11px] tracking-widest h-12 px-10 transition active:scale-95 backdrop-blur-md"
            >
              Become a Seller
            </Button>
          </div>
        </div>
      </section>

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
                      <Image
                        src={getImageUrl(category.image)}
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

      <section className="pt-10 pb-16 bg-gray-50 relative overflow-hidden">
        <div className="container mx-auto px-6 relative z-10 font-sans">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tighter mb-1">
              How AgroShare Works
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto font-black uppercase text-[9px] tracking-widest leading-relaxed opacity-60">
              Three simple steps to access modern agricultural machinery.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 max-w-5xl mx-auto">
            <div className="flex flex-col items-center text-center group">
              <div className="w-14 h-14 bg-green-100/50 rounded-2xl flex items-center justify-center mb-6 text-green-600">
                <Search className="w-7 h-7" />
              </div>
              <h3 className="text-base font-black text-gray-900 mb-2 tracking-tight">
                Browse & Discover
              </h3>
              <p className="text-gray-500 text-[12px] font-medium leading-relaxed px-4">
                Explore a wide range of machines tailored to your farming needs.
              </p>
            </div>

            <div className="flex flex-col items-center text-center group">
              <div className="w-14 h-14 bg-green-600 rounded-2xl flex items-center justify-center mb-6 text-white shadow-lg shadow-green-600/20">
                <CalendarCheck className="w-7 h-7" />
              </div>
              <h3 className="text-base font-black text-gray-900 mb-2 tracking-tight">
                Book with Ease
              </h3>
              <p className="text-gray-500 text-[12px] font-medium leading-relaxed px-4">
                Select your duration and book securely through our platform.
              </p>
            </div>

            <div className="flex flex-col items-center text-center group">
              <div className="w-14 h-14 bg-green-100/50 rounded-2xl flex items-center justify-center mb-6 text-green-600">
                <Sprout className="w-7 h-7" />
              </div>
              <h3 className="text-base font-black text-gray-900 mb-2 tracking-tight">
                Grow Your Yield
              </h3>
              <p className="text-gray-500 text-[12px] font-medium leading-relaxed px-4">
                Get the equipment delivered and focus on farming efficiently.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="pt-4 pb-24 bg-white relative overflow-hidden">
        <div className="absolute top-1/2 left-0 w-1/2 h-1/2 bg-green-50/20 blur-[120px] -z-10 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
        <div className="container max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-8 px-2">
            <div>
              <Badge className="bg-green-600/10 text-green-700 mb-4 px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border-0">
                LATEST INVENTORY
              </Badge>
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

          <div className="bg-slate-50/50 rounded-[3rem] p-6 md:p-8 border border-slate-100 shadow-inner">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {productsLoading ? (
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
                    We couldn&apos;t find any listings nearby. Try expanding your search.
                  </p>
                  <Button
                    onClick={() => {
                      localStorage.removeItem('selectedLocation');
                      setSelectedLocation('Select City');
                      window.dispatchEvent(
                        new CustomEvent('locationChanged', { detail: 'Select City' }),
                      );
                    }}
                    className="bg-slate-900 hover:bg-green-600 text-white rounded-xl h-12 px-10 font-black uppercase text-[9px] tracking-widest shadow-2xl shadow-slate-900/20 transition-all active:scale-95"
                  >
                    <RotateCcw className="w-4 h-4 mr-2" /> Clear Location Filter
                  </Button>
                </div>
              ) : (
                filteredProducts.map((product) => (
                  <Card
                    key={product._id}
                    className="group flex flex-col h-full bg-white border border-slate-200/60 rounded-[2rem] shadow-sm hover:shadow-2xl hover:shadow-slate-200 transition-all duration-700 overflow-hidden"
                  >
                    <Link
                      href={`/products/${product.slug}`}
                      className="relative block aspect-[4/3] bg-slate-100 shrink-0 overflow-hidden"
                    >
                      <div className="absolute inset-0 transition-transform duration-1000 group-hover:scale-110 ease-out">
                        <AutoImageSlider
                          images={product.images || []}
                          getImageUrl={getImageUrl}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-700"></div>
                      <div className="absolute top-4 left-4 z-10">
                        <Badge className="bg-white/95 backdrop-blur-md text-slate-900 shadow-xl border-0 text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg">
                          {product.category?.name || 'Equipment'}
                        </Badge>
                      </div>
                    </Link>

                    <CardContent className="p-5 flex flex-col flex-grow bg-white">
                      <Link href={`/products/${product.slug}`} className="block mb-4">
                        <div className="flex items-center justify-between mb-2 text-[9px] font-black text-green-600 uppercase tracking-[0.2em]">
                          <span className="bg-green-50 px-2 py-0.5 rounded-lg">
                            {product.condition || 'NEW'}
                          </span>
                        </div>
                        <h3 className="font-black text-slate-900 text-[15px] mb-3 line-clamp-2 group-hover:text-green-600 transition-colors tracking-tighter leading-tight">
                          {product.machineName}
                        </h3>

                        <div className="space-y-2">
                          <div className="flex items-center gap-2.5 text-[13px] font-bold text-slate-600">
                            <div className="w-7 h-7 rounded-lg bg-slate-50 flex items-center justify-center text-green-600">
                              <MapPin className="w-3.5 h-3.5" />
                            </div>
                            <span className="truncate tracking-tight">
                              {product.location?.district || 'Location Pending'}
                            </span>
                          </div>
                          <div className="flex items-center gap-2.5 text-[13px] font-bold text-slate-400 font-sans">
                            <div className="w-7 h-7 rounded-lg bg-slate-50 flex items-center justify-center text-slate-300">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                            </div>
                            <span className="truncate uppercase tracking-wider font-black text-[9px]">
                              {product.specifications?.power
                                ? `${product.specifications.power} HP`
                                : '45 HP'}{' '}
                              • {product.specifications?.fuelType || 'Diesel'}
                            </span>
                          </div>
                        </div>
                      </Link>

                      <div className="mt-auto flex items-center justify-between pt-4 border-t border-slate-50">
                        <div>
                          <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest mb-0.5 leading-none">
                            Rental Price
                          </p>
                          <div className="flex items-baseline gap-0.5">
                            <span className="text-slate-900 font-black text-xl tracking-tighter">
                              ₹{product.pricing?.rentalPrice?.toLocaleString()}
                            </span>
                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                              / {product.pricing?.priceType === 'Hr' ? 'Hr' : 'Day'}
                            </span>
                          </div>
                        </div>

                        <Link href={`/products/${product.slug}`}>
                          <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-slate-900 text-white group-hover:bg-green-600 shadow-xl shadow-slate-900/10 group-hover:shadow-green-600/20 transition-all duration-500 active:scale-90">
                            <ArrowRight className="w-4 h-4" />
                          </div>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
