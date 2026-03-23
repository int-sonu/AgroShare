'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

interface AutoImageSliderProps {
  images: string[];
  getImageUrl: (image: string | { url?: string; secure_url?: string } | null | undefined) => string;
  className?: string;
}

export function AutoImageSlider({ images, getImageUrl, className }: AutoImageSliderProps) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!images || images.length <= 1) return;

    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [images]);

  if (!images || images.length === 0) {
    return (
      <div className={className}>
        <Image
          src="/images/category-placeholder.png"
          alt="Placeholder"
          fill
          className="object-contain opacity-50"
          unoptimized
        />
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      {images.map((img, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === current ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <Image
            src={getImageUrl(img)}
            alt={`Machine Image ${index + 1}`}
            fill
            className="object-contain"
            unoptimized
          />
        </div>
      ))}
    </div>
  );
}
