'use client';

import { useEffect, useState } from 'react';
import { AppImage } from './AppImage';

interface AutoImageSliderProps {
  images: (string | { url?: string; secure_url?: string } | null | undefined)[];
  className?: string;
  imageClassName?: string;
}

/**
 * Auto-switching image slider using the centralized AppImage logic.
 */
export function AutoImageSlider({ 
  images, 
  className = "relative w-full h-full",
  imageClassName = "object-cover"
}: AutoImageSliderProps) {
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
        <AppImage
          src={null}
          alt="Placeholder"
          fill
          className={imageClassName}
          unoptimized
        />
      </div>
    );
  }

  return (
    <div className={className}>
      {images.map((img, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === current ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <AppImage
            src={img}
            alt={`Machine Image ${index + 1}`}
            fill
            className={imageClassName}
            unoptimized
          />
        </div>
      ))}
    </div>
  );
}
