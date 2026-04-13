'use client';

import Image, { ImageProps } from 'next/image';
import { useState, useEffect } from 'react';

interface AppImageProps extends Omit<ImageProps, 'src'> {
  src: string | { url?: string; secure_url?: string } | null | undefined;
  fallback?: string;
}

export const AppImage = ({
  src,
  fallback = '/images/category-placeholder.png',
  alt = 'Image',
  ...props
}: AppImageProps) => {

  const resolveImage = (): string => {
    if (!src) return fallback;

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

    if (typeof src === 'string') {
      if (src.startsWith('http') || src.startsWith('//') || src.startsWith('data:')) {
        return src;
      }
      // If it's a backend path like "uploads/...", prefix it
      const cleanApiUrl = apiUrl.replace(/\/$/, '');
      const cleanSrc = src.replace(/^\//, '');
      return `${cleanApiUrl}/${cleanSrc}`;
    }

    if (typeof src === 'object') {
      const url = src.secure_url || src.url;
      if (!url) return fallback;
      if (url.startsWith('http') || url.startsWith('//') || url.startsWith('data:')) {
        return url;
      }
      const cleanApiUrl = apiUrl.replace(/\/$/, '');
      const cleanUrl = url.replace(/^\//, '');
      return `${cleanApiUrl}/${cleanUrl}`;
    }

    return fallback;
  };

  const [imgSrc, setImgSrc] = useState<string>(resolveImage());

  useEffect(() => {
    setImgSrc(resolveImage());
  }, [src]);

  const handleError = () => {
    if (imgSrc !== fallback) {
      setImgSrc(fallback);
    }
  };

  return (
    <Image
      src={imgSrc}
      alt={alt}
      onError={handleError}
      {...props}
    />
  );
};