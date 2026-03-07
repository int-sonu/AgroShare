'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import API from '@/services/api';

export default function Home() {
  const [current, setCurrent] = useState(0);

  const images = [
    '/images/home1.jpg',
    '/images/home2.jpg',
  ];

  useEffect(() => {
    API.get('/health').catch(() => {});
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div>

      <section className="relative w-full h-[550px] overflow-hidden">

        {images.map((img, index) => (
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
              className="object-cover scale-105"
              priority
            />
          </div>
        ))}

        <div className="absolute inset-0 bg-black/55" />

        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6 text-white">

          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Empowering Farmers with Modern Machinery.
          </h1>

          <p className="text-lg md:text-xl max-w-2xl text-gray-200 mb-8">
            A trusted digital marketplace connecting sellers of advanced
            agricultural equipment with farmers across the region.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <button className="bg-green-600 hover:bg-green-700 px-8 py-3 rounded-full font-semibold transition">
              Explore Equipment
            </button>

            <button className="border border-white px-8 py-3 rounded-full font-semibold hover:bg-white hover:text-black transition">
              Become a Seller
            </button>
          </div>

        </div>
      </section>

<section className="bg-gray-50 py-5">

  <div className="container mx-auto px-6">

    <h2 className="text-3xl md:text-4xl font-bold text-center mb-10">
      What are you looking for today?
    </h2>

    <div className="flex gap-10 justify-center overflow-x-auto scrollbar-hide">

      {[
        { name: 'Tractors', image: '/images/category-tractor.jpg' },
        { name: 'Harvesters', image: '/images/category-harvester.jpg' },
        { name: 'Irrigation', image: '/images/category-irrigation.jpg' },
        { name: 'Sprayers', image: '/images/category-sprayer.jpg' },
      ].map((category, index) => (
        <div
          key={index}
          className="flex flex-col items-center cursor-pointer group min-w-[110px]"
        >
          <div className="relative w-28 h-28 rounded-full overflow-hidden shadow-md group-hover:shadow-xl transition duration-300">
            <Image
              src={category.image}
              alt={category.name}
              fill
              className="object-cover group-hover:scale-110 transition duration-500"
            />
          </div>

          <p className="mt-4 text-sm font-medium text-gray-700 group-hover:text-green-600 transition">
            {category.name}
          </p>
        </div>
      ))}

    </div>
  </div>

</section>

<section className="py-6 bg-white">

  <div className="container mx-auto px-6">

    <div className="flex justify-between items-center mb-12">
      <h2 className="text-3xl md:text-4xl font-bold">
        Featured Equipment
      </h2>

      <button className="text-green-600 font-semibold hover:underline">
        View All
      </button>
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">

      {[
        { name: "John Deere Tractor", price: "₹8,50,000", image: "/images/product1.jpg" },
        { name: "Advanced Harvester", price: "₹12,00,000", image: "/images/product2.jpg" },
        { name: "Smart Irrigation System", price: "₹1,20,000", image: "/images/product3.jpg" },
        { name: "Heavy Duty Sprayer", price: "₹85,000", image: "/images/product4.jpg" },
      ].map((product, index) => (
        <div
          key={index}
          className="border rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition duration-300"
        >
          <div className="relative w-full h-52">
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover"
            />
          </div>

          <div className="p-4">
            <h3 className="font-semibold text-gray-800 mb-2">
              {product.name}
            </h3>

            <p className="text-green-600 font-bold mb-4">
              {product.price}
            </p>

            <button className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-full transition">
              View Details
            </button>
          </div>
        </div>
      ))}

    </div>
  </div>

</section>


    </div>
  );
}