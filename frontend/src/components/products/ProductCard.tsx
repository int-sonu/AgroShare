'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ShoppingCart, Heart, Eye, Star } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
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
  condition?: string;
  stock?: number;
  quantity?: number;
  location?: {
    district?: string;
    state?: string;
  };
};

interface ProductCardProps {
  product: Product;
  getImageUrl: (image: any) => string;
}

export function ProductCard({ product, getImageUrl }: ProductCardProps) {
  const isNew = product.condition?.toLowerCase() === 'new';
  const price = product.pricing?.rentalPrice || 0;

  return (
    <div className="group bg-[#f8f9fa] rounded-[2.5rem] p-4 transition-all duration-500 hover:bg-white hover:shadow-2xl hover:shadow-slate-200/50 flex flex-col h-full border border-transparent hover:border-slate-100">
      {/* Image Container */}
      <div className="relative aspect-square w-full rounded-[2rem] overflow-hidden bg-white mb-6">
        {/* Badge */}
        {isNew && (
          <div className="absolute top-4 left-4 z-20">
            <Badge className="bg-black text-white text-[10px] font-black px-3 py-1 rounded-lg border-0 tracking-widest uppercase">
              NEW
            </Badge>
          </div>
        )}

        {/* Action Buttons Overlay */}
        <div className="absolute inset-0 z-10 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
          <button className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-slate-900 hover:text-white transition-all duration-300">
            <ShoppingCart size={18} />
          </button>
          <button className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-rose-500 hover:text-white transition-all duration-300">
            <Heart size={18} />
          </button>
          <Link 
            href={`/products/${product.slug}`}
            className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-blue-600 hover:text-white transition-all duration-300"
          >
            <Eye size={18} />
          </Link>
        </div>

        {/* Image */}
        <Link href={`/products/${product.slug}`} className="block w-full h-full relative">
          <Image
            src={getImageUrl(product.images?.[0])}
            alt={product.machineName}
            fill
            className="object-contain p-6 transition-transform duration-700 group-hover:scale-110"
            unoptimized
          />
        </Link>
      </div>

      {/* Info Section */}
      <div className="px-2 flex flex-col flex-1">
        {/* Rating & Condition */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={10} className={cn("fill-current text-amber-400", i === 4 && "text-slate-200 fill-slate-200")} />
            ))}
            <span className="text-[9px] font-bold text-slate-400 ml-1">4.5</span>
          </div>
          <span className={cn(
            "text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-md",
            isNew ? "bg-blue-50 text-blue-600" : "bg-blue-50/50 text-blue-500"
          )}>
            {isNew ? 'NEW' : 'GOOD'}
          </span>
        </div>

        {/* Title */}
        <Link href={`/products/${product.slug}`}>
          <h3 className="font-black text-slate-900 text-base mb-1 tracking-tight line-clamp-1 group-hover:text-green-600 transition-colors uppercase">
            {product.machineName}
          </h3>
        </Link>
        
        <div className="flex items-center gap-2 text-[9px] font-black text-slate-400 uppercase tracking-[0.1em] mb-4">
          <span className="text-slate-500">{product.category?.name || 'Equipment'}</span>
          <span className="w-1 h-1 rounded-full bg-slate-300" />
          <span className="text-slate-400">{product.location?.district || 'KOTTAYAM'}</span>
        </div>

        {/* Pricing & Stock */}
        <div className="mt-auto flex items-end justify-between gap-4">
          <div className="flex flex-col">
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-black text-slate-900 line-clamp-1">₹{price.toLocaleString()}</span>
            </div>
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">
              Per {product.pricing?.priceType === 'Hr' ? 'Hour' : 'Day'}
            </p>
          </div>

          {product.quantity === 0 ? (
            <div className="flex items-center gap-1.5 bg-rose-50 px-2.5 py-1 rounded-full border border-rose-100 mb-1">
               <div className="w-1 h-1 rounded-full bg-rose-500" />
               <span className="text-[9px] font-black text-rose-600 uppercase tracking-widest">OUT OF STOCK</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 bg-green-50 px-2.5 py-1 rounded-full border border-green-100 mb-1">
               <div className="w-1 h-1 rounded-full bg-green-500 animate-pulse" />
               <span className="text-[9px] font-black text-green-600 uppercase tracking-widest">IN STOCK</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
