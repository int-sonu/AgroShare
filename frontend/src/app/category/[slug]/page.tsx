'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { CheckCircle2, RotateCcw, ChevronDown, Heart, Plus, Search, SlidersHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AutoImageSlider } from '@/components/ui/AutoImageSlider';
import { ProductCard } from '@/components/products/ProductCard';
import { cn } from '@/lib/utils';

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
  };
  specifications?: Record<string, unknown>;
  condition?: string;
};

export default function CategoryProductsPage() {
  const { slug } = useParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [category, setCategory] = useState<{ name: string; _id: string } | null>(null);
  const [allCategories, setAllCategories] = useState<{ name: string; slug: string; _id: string }[]>([]);
  const [loading, setLoading] = useState(true);

  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000000]);
  const [selectedCondition, setSelectedCondition] = useState<string>('all');
  const [selectedLocation, setSelectedLocation] = useState<string>('all');
  const [selectedPriceType, setSelectedPriceType] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('newest');
  
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

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
    const fetchData = async () => {
      try {
        setLoading(true);
        const catRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories/slug/${slug}`);
        const catData = await catRes.json();

        if (catData.success) {
          setCategory(catData.data);

          const [prodRes, allCatsRes] = await Promise.all([
            fetch(`${process.env.NEXT_PUBLIC_API_URL}/machines/category/${catData.data._id}`),
            fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories/active`)
          ]);

          const [prodData, allCatsData] = await Promise.all([
            prodRes.json(),
            allCatsRes.json()
          ]);

          setProducts(prodData.data || []);
          setAllCategories(allCatsData.data || []);
        }
      } catch (error) {
        console.error('Failed to fetch category data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (slug) fetchData();
  }, [slug]);

  useEffect(() => {
    let result = [...products];

    // Search Query
    if (searchQuery) {
      result = result.filter((p) => 
        p.machineName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Condition
    if (selectedCondition !== 'all') {
      result = result.filter(
        (p) => (p.condition || 'Used').toLowerCase() === selectedCondition.toLowerCase(),
      );
    }

    // Location
    if (selectedLocation !== 'all') {
      result = result.filter((p) => p.location?.district === selectedLocation);
    }

    // Rental Type
    if (selectedPriceType !== 'all') {
      result = result.filter((p) => p.pricing?.priceType === selectedPriceType);
    }

    // Price Range
    result = result.filter(
      (p) => p.pricing?.rentalPrice >= priceRange[0] && p.pricing?.rentalPrice <= priceRange[1],
    );

    // Sorting
    if (sortBy === 'price_low') {
      result.sort((a, b) => a.pricing.rentalPrice - b.pricing.rentalPrice);
    } else if (sortBy === 'price_high') {
      result.sort((a, b) => b.pricing.rentalPrice - a.pricing.rentalPrice);
    } else if (sortBy === 'newest') {
      // Assuming newest is by ID or creation if available, or just alphabetical if not
      result.sort((a, b) => (b._id > a._id ? 1 : -1));
    }

    setFilteredProducts(result);
    setCurrentPage(1); // Reset to first page on filter change
  }, [products, priceRange, selectedCondition, selectedLocation, selectedPriceType, sortBy, searchQuery]);


  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="w-10 h-10 border-4 border-green-100 border-t-green-600 rounded-full animate-spin"></div>
        <p className="text-[11px] font-black uppercase tracking-widest text-gray-400">
          Loading {slug}...
        </p>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-6">
        <h2 className="text-2xl font-black text-gray-900 mb-2">Category Not Found</h2>
        <p className="text-gray-500 mb-6">The category you are looking for doesn&apos;t exist.</p>
        <Link href="/">
          <Button className="bg-green-600 hover:bg-green-700 text-white rounded-full px-8 font-black uppercase text-[11px] tracking-widest h-11">
            Back to Home
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen pb-24 font-sans selection:bg-rose-100">
      <div className="container max-w-7xl mx-auto px-6 pt-12">
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          <aside className="w-full lg:w-[260px] shrink-0 sticky top-8">
            <div className="bg-white p-2">
              <h2 className="text-sm font-black text-slate-900 mb-6 uppercase tracking-tighter">Categories</h2>

              <div className="space-y-4 mb-10 text-xs font-medium text-slate-500">
                {allCategories
                  .sort((a, b) => {
                    const order = ["Transportation", "Land Preparation", "Planting Seeding", "Crop Care", "Harvesting"];
                    const indexA = order.indexOf(a.name);
                    const indexB = order.indexOf(b.name);
                    if (indexA !== -1 && indexB !== -1) return indexA - indexB;
                    if (indexA !== -1) return -1;
                    if (indexB !== -1) return 1;
                    return a.name.localeCompare(b.name);
                  })
                  .map((cat) => (
                    <Link
                      key={cat._id}
                      href={`/category/${cat.slug || cat._id}`}
                      className={cn(
                        "flex justify-between items-center cursor-pointer hover:text-slate-900 transition-colors py-1",
                        (cat.slug === slug || cat._id === slug) ? "text-slate-900 font-bold" : ""
                      )}
                    >
                      <span className="capitalize">{cat.name.toLowerCase()}</span>
                      <ChevronDown className={cn("w-3 h-3 opacity-50", (cat.slug === slug || cat._id === slug) ? "rotate-180 opacity-100 text-slate-900" : "")} />
                    </Link>
                  ))}
                <Link href="/category" className="flex justify-between items-center text-slate-400 text-[10px] uppercase font-bold tracking-widest cursor-pointer mt-6 pt-4 border-t border-slate-50 hover:text-slate-900 transition-colors">
                  Show all
                </Link>
              </div>

              <h2 className="text-sm font-black text-slate-900 mb-6 uppercase tracking-tighter">Filters</h2>

              <div className="mb-8">
                <h3 className="text-xs font-bold text-slate-800 mb-4">Condition</h3>
                <div className="flex flex-wrap gap-2">
                  {['all', 'New', 'Used'].map((cond) => (
                    <button
                      key={cond}
                      onClick={() => setSelectedCondition(cond)}
                      className={`px-4 py-2 rounded-full text-[11px] font-bold transition-all duration-200 border flex items-center gap-1.5 ${
                        selectedCondition === cond
                          ? 'bg-slate-900 text-white border-slate-900'
                          : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      {selectedCondition === cond && (
                        <CheckCircle2 className="w-3 h-3 text-white" />
                      )}
                      {cond === 'all' ? 'Any' : cond}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-8">
                <h3 className="text-xs font-bold text-slate-800 mb-4">Rental Type</h3>
                <div className="flex flex-wrap gap-2">
                  {['all', 'Hr', 'Day'].map((pt) => (
                    <button
                      key={pt}
                      onClick={() => setSelectedPriceType(pt)}
                      className={`px-4 py-2 rounded-full text-[11px] font-bold transition-all duration-200 border flex items-center gap-1.5 ${
                        selectedPriceType === pt
                          ? 'bg-slate-900 text-white border-slate-900'
                          : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      {selectedPriceType === pt && <CheckCircle2 className="w-3 h-3 text-white" />}
                      {pt === 'all' ? 'Any' : pt === 'Hr' ? 'Hourly' : 'Daily'}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-8">
                <h3 className="text-xs font-bold text-slate-800 mb-4">Price Range</h3>
                <div className="flex items-center justify-between gap-3 px-1 mt-4">
                  <div className="flex items-center gap-1">
                    <span className="text-slate-400 text-[10px] font-semibold">₹</span>
                    <input
                      type="number"
                      placeholder="Min"
                      value={priceRange[0] || ''}
                      onChange={(e) => setPriceRange([Number(e.target.value) || 0, priceRange[1]])}
                      className="w-16 bg-transparent text-[10px] font-bold text-slate-900 outline-none placeholder:text-slate-300"
                    />
                  </div>
                  <div className="text-slate-300">-</div>
                  <div className="flex items-center gap-1">
                    <span className="text-slate-400 text-[10px] font-semibold">₹</span>
                    <input
                      type="number"
                      placeholder="Max"
                      value={priceRange[1] === 1000000 ? '' : priceRange[1]}
                      onChange={(e) =>
                        setPriceRange([priceRange[0], Number(e.target.value) || 1000000])
                      }
                      className="w-16 bg-transparent text-[10px] font-bold text-slate-900 outline-none placeholder:text-slate-300 text-right"
                    />
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  setSelectedCondition('all');
                  setSelectedLocation('all');
                  setSelectedPriceType('all');
                  setPriceRange([0, 1000000]);
                  setSearchQuery('');
                  setSortBy('newest');
                }}
                className="w-full bg-slate-100 text-slate-900 rounded-[14px] py-4 text-xs font-bold mt-4 hover:bg-slate-200 transition-all active:scale-[0.98] uppercase tracking-widest"
              >
                Reset All Filters
              </button>
            </div>
          </aside>

          <main className="flex-1 w-full pl-0 lg:pl-10">
            {/* Search & Sort Bar */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-10 pb-6 border-b border-slate-50">
              <div className="relative w-full md:w-96">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search equipment..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-50 border-none rounded-2xl py-3.5 pl-11 pr-4 text-sm font-medium placeholder:text-slate-400 focus:ring-2 focus:ring-green-500/20 outline-none transition-all"
                />
              </div>

              <div className="flex items-center gap-3 w-full md:w-auto">
                <div className="flex items-center gap-2 bg-slate-50 rounded-2xl px-4 py-3 min-w-[160px]">
                  <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="bg-transparent border-none text-[13px] font-bold text-slate-700 outline-none cursor-pointer w-full"
                  >
                    <option value="newest">Newest First</option>
                    <option value="price_low">Price: Low to High</option>
                    <option value="price_high">Price: High to Low</option>
                  </select>
                </div>
              </div>
            </div>

            {filteredProducts.length === 0 ? (
              <div className="py-32 px-10 flex flex-col items-center text-center bg-slate-50/50 rounded-3xl">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-6 shadow-sm">
                  <RotateCcw className="w-6 h-6 text-slate-300" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2 tracking-tight">
                  No equipment found
                </h3>
                <p className="text-slate-500 text-sm max-w-sm mb-8">
                   Try adjusting your filters to find what you&apos;re looking for.
                </p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8 gap-y-12 mb-20">
                  {filteredProducts
                    .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                    .map((product: Product) => (
                      <ProductCard 
                        key={product._id} 
                        product={product} 
                        getImageUrl={getImageUrl} 
                      />
                    ))}
                </div>

                {/* Pagination */}
                {filteredProducts.length > itemsPerPage && (
                  <div className="flex items-center justify-center gap-2 mt-12">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="p-3 rounded-2xl bg-slate-50 text-slate-900 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-100 transition-all font-bold text-xs uppercase tracking-widest px-6"
                    >
                      Prev
                    </button>
                    
                    <div className="flex items-center gap-2">
                      {Array.from({ length: Math.ceil(filteredProducts.length / itemsPerPage) }).map((_, i) => (
                        <button
                          key={i}
                          onClick={() => setCurrentPage(i + 1)}
                          className={cn(
                            "w-11 h-11 rounded-2xl text-xs font-black transition-all",
                            currentPage === i + 1 
                              ? "bg-slate-900 text-white shadow-xl shadow-slate-900/20" 
                              : "bg-slate-50 text-slate-400 hover:bg-slate-100"
                          )}
                        >
                          {i + 1}
                        </button>
                      ))}
                    </div>

                    <button
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(filteredProducts.length / itemsPerPage)))}
                      disabled={currentPage === Math.ceil(filteredProducts.length / itemsPerPage)}
                      className="p-3 rounded-2xl bg-slate-50 text-slate-900 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-100 transition-all font-bold text-xs uppercase tracking-widest px-6"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
