'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const BANNER_IMAGES = ['/images/home1.jpg', '/images/home2.jpg'];

export function HeroSection() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % BANNER_IMAGES.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
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
            className={`object-cover transition-transform duration-[10000ms] ease-linear ${
              index === current ? 'scale-110' : 'scale-100'
            }`}
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
  );
}
