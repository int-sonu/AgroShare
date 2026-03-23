"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { MapPin, CheckCircle2, ArrowRight, RotateCcw, ChevronDown, SlidersHorizontal, Heart, Plus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AutoImageSlider } from "@/components/ui/AutoImageSlider";

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
  const [category, setCategory] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);

  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000000]);
  const [selectedCondition, setSelectedCondition] = useState<string>("all");
  const [selectedLocation, setSelectedLocation] = useState<string>("all");
  const [selectedPriceType, setSelectedPriceType] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("newest");

  const getImageUrl = (image: string | { url?: string; secure_url?: string } | null | undefined) => {
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
          
          const prodRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/machines/category/${catData.data._id}`);
          const prodData = await prodRes.json();
          setProducts(prodData.data || []);
        }
      } catch (error) {
        console.error("Failed to fetch category data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (slug) fetchData();
  }, [slug]);



  useEffect(() => {
    let result = [...products];

    if (selectedCondition !== "all") {
      result = result.filter(p => (p.condition || "Used").toLowerCase() === selectedCondition.toLowerCase());
    }

    if (selectedLocation !== "all") {
      result = result.filter(p => p.location?.district === selectedLocation);
    }

    if (selectedPriceType !== "all") {
      result = result.filter(p => p.pricing?.priceType === selectedPriceType);
    }

    result = result.filter(p => 
      p.pricing?.rentalPrice >= priceRange[0] && 
      p.pricing?.rentalPrice <= priceRange[1]
    );

    if (sortBy === "price-low") {
      result.sort((a, b) => (a.pricing?.rentalPrice || 0) - (b.pricing?.rentalPrice || 0));
    } else if (sortBy === "price-high") {
      result.sort((a, b) => (b.pricing?.rentalPrice || 0) - (a.pricing?.rentalPrice || 0));
    }

    setFilteredProducts(result);
  }, [products, priceRange, selectedCondition, selectedLocation, selectedPriceType, sortBy]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="w-10 h-10 border-4 border-green-100 border-t-green-600 rounded-full animate-spin"></div>
        <p className="text-[11px] font-black uppercase tracking-widest text-gray-400">Loading {slug}...</p>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-6">
        <h2 className="text-2xl font-black text-gray-900 mb-2">Category Not Found</h2>
        <p className="text-gray-500 mb-6">The category you are looking for doesn't exist.</p>
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
          
          {/* Left Sidebar Filter */}
          <aside className="w-full lg:w-[260px] shrink-0 sticky top-8">
            <div className="bg-white p-2">
              <h2 className="text-sm font-black text-slate-900 mb-6">Categories</h2>
              
              <div className="space-y-4 mb-10 text-xs font-medium text-slate-500">
                <div className="flex justify-between items-center cursor-pointer hover:text-slate-900 transition-colors">
                  <span className="text-slate-900 font-bold">{category.name}</span> <ChevronDown className="w-3.5 h-3.5"/>
                </div>
                <div className="flex justify-between items-center cursor-pointer hover:text-slate-900 transition-colors">
                  <span>Other Agricultural</span> <ChevronDown className="w-3.5 h-3.5"/>
                </div>
                <div className="flex justify-between items-center text-slate-400 text-[10px] uppercase font-bold tracking-widest cursor-pointer mt-4 pt-2">
                  Show all
                </div>
              </div>

              <h2 className="text-sm font-black text-slate-900 mb-6">Filters</h2>

              {/* Filter: Condition (styled like color pills) */}
              <div className="mb-8">
                <h3 className="text-xs font-bold text-slate-800 mb-4">Condition</h3>
                <div className="flex flex-wrap gap-2">
                  {["all", "New", "Used"].map((cond) => (
                    <button
                      key={cond}
                      onClick={() => setSelectedCondition(cond)}
                      className={`px-4 py-2 rounded-full text-[11px] font-bold transition-all duration-200 border flex items-center gap-1.5 ${
                        selectedCondition === cond 
                          ? "bg-slate-900 text-white border-slate-900" 
                          : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
                      }`}
                    >
                      {selectedCondition === cond && <CheckCircle2 className="w-3 h-3 text-white" />}
                      {cond === "all" ? "Any" : cond}
                    </button>
                  ))}
                </div>
              </div>

              {/* Filter: Rental Type */}
              <div className="mb-8">
                <h3 className="text-xs font-bold text-slate-800 mb-4">Rental Type</h3>
                <div className="flex flex-wrap gap-2">
                  {["all", "Hr", "Day"].map((pt) => (
                    <button
                      key={pt}
                      onClick={() => setSelectedPriceType(pt)}
                      className={`px-4 py-2 rounded-full text-[11px] font-bold transition-all duration-200 border flex items-center gap-1.5 ${
                        selectedPriceType === pt 
                          ? "bg-slate-900 text-white border-slate-900" 
                          : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
                      }`}
                    >
                      {selectedPriceType === pt && <CheckCircle2 className="w-3 h-3 text-white" />}
                      {pt === "all" ? "Any" : pt === "Hr" ? "Hourly" : "Daily"}
                    </button>
                  ))}
                </div>
              </div>

              {/* Filter: Price Range */}
              <div className="mb-8">
                <h3 className="text-xs font-bold text-slate-800 mb-4">Price</h3>
                {/* Visual slider track */}
                <div className="h-1 bg-slate-200 rounded-full mb-4 relative mx-1">
                  <div className="absolute left-[10%] right-[30%] h-full bg-slate-900 rounded-full"></div>
                  <div className="absolute left-[10%] w-3.5 h-3.5 bg-slate-900 rounded-full top-1/2 -translate-y-1/2 -translate-x-1/2 border-[2.5px] border-white shadow-sm cursor-grab"></div>
                  <div className="absolute right-[30%] w-3.5 h-3.5 bg-slate-900 rounded-full top-1/2 -translate-y-1/2 translate-x-1/2 border-[2.5px] border-white shadow-sm cursor-grab"></div>
                </div>
                
                <div className="flex items-center justify-between gap-3 px-1">
                  <div className="flex items-center gap-1">
                    <span className="text-slate-400 text-[10px] font-semibold">₹</span>
                    <input
                      type="number"
                      placeholder="Min"
                      value={priceRange[0] || ''}
                      onChange={(e) => setPriceRange([Number(e.target.value) || 0, priceRange[1]])}
                      className="w-14 bg-transparent text-[10px] font-bold text-slate-900 outline-none placeholder:text-slate-300"
                    />
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-slate-400 text-[10px] font-semibold">₹</span>
                    <input
                      type="number"
                      placeholder="Max"
                      value={priceRange[1] === 1000000 ? '' : priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value) || 1000000])}
                      className="w-14 bg-transparent text-[10px] font-bold text-slate-900 outline-none placeholder:text-slate-300 text-right"
                    />
                  </div>
                </div>
              </div>

              {/* Apply Button */}
              <button 
                onClick={() => {
                  setSelectedCondition("all");
                  setSelectedLocation("all");
                  setSelectedPriceType("all");
                  setPriceRange([0, 1000000]);
                }}
                className="w-full bg-slate-900 text-white rounded-[14px] py-4 text-xs font-bold mt-2 hover:bg-slate-800 transition-all shadow-[0_8px_20px_-8px_rgba(0,0,0,0.5)] active:scale-[0.98]"
              >
                Reset & Apply
              </button>
            </div>
          </aside>

          {/* Main Content Area */}
          <main className="flex-1 w-full pl-0 lg:pl-10">
            {/* Minimalist Top Header */}
            <div className="flex items-center justify-between mb-8 pt-2">
              
            </div>

            {/* Product Grid */}
            {filteredProducts.length === 0 ? (
              <div className="py-32 px-10 flex flex-col items-center text-center bg-slate-50/50 rounded-3xl">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-6 shadow-sm">
                  <RotateCcw className="w-6 h-6 text-slate-300" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2 tracking-tight">No equipment found</h3>
                <p className="text-slate-500 text-sm max-w-sm mb-8">
                  We couldn&apos;t find any machines matching your current criteria.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8 gap-y-12">
                {filteredProducts.map((product) => (
                  <div key={product._id} className="group flex flex-col items-center relative isolation-auto">
                    
                    <div className="w-full rounded-[32px] p-4 relative mb-4 transition-all duration-300 group-hover:bg-slate-50">
                      {/* Top Badges */}
                      <div className="absolute top-6 left-6 right-6 flex justify-between items-start z-10 pointer-events-none">
                        <span className="bg-[#f07167] text-white text-[9px] font-black px-2.5 py-1.5 rounded-full shadow-sm shadow-[#f07167]/30">
                          {product.condition || 'NEW'}
                        </span>
                        <div className="bg-white/90 backdrop-blur-sm p-1.5 rounded-full shadow-sm text-slate-400">
                          <Heart className="w-4 h-4" />
                        </div>
                      </div>

                      {/* Image Area */}
                      <Link href={`/products/${product.slug}`} className="block relative aspect-square w-full rounded-2xl overflow-hidden bg-[#f4f6f8] mix-blend-multiply">
                        <div className="absolute inset-0 transition-transform duration-700 group-hover:scale-105 ease-out flex pt-6 pb-2 px-4 items-center justify-center">
                          <AutoImageSlider
                            images={product.images || []}
                            getImageUrl={getImageUrl}
                            className="h-full w-full object-contain drop-shadow-sm mix-blend-multiply"
                          />
                        </div>
                      </Link>
                    </div>

                    {/* Meta info centered */}
                    <div className="flex flex-col items-center text-center px-4 -mt-2 mb-6 w-full">
                      <Link href={`/products/${product.slug}`} className="block group/link">
                        <h3 className="font-semibold text-slate-500 text-xs mb-1.5 group-hover/link:text-slate-900 transition-colors capitalize">
                          {product.machineName.toLowerCase()}
                        </h3>
                        <div className="text-slate-900 font-extrabold text-sm tracking-tight">
                          ₹{product.pricing?.rentalPrice?.toLocaleString()} / {product.pricing?.priceType === 'Hr' ? 'Hr' : 'Day'}
                        </div>
                      </Link>
                    </div>

                    {/* Bottom overlapping circular button */}
                    <Link href={`/products/${product.slug}`} className="absolute -bottom-5 w-[38px] h-[38px] bg-[#f07167] rounded-full flex items-center justify-center text-white shadow-lg shadow-[#f07167]/40 group-hover:-translate-y-1 transition-all duration-300 z-20">
                      <Plus className="w-4 h-4 stroke-[3]" />
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
