'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

type Category = {
  _id: string;
  name: string;
  image: string;
  status: 'active' | 'inactive';
};

interface Machine {
  _id: string;
  machineName: string;
  category: { name: string };
  brandModel: string;
  condition: string;
  pricing: {
    rentalPrice: number;
    priceType: string;
  };
  location: {
    village: string;
    district: string;
  };
  images: string[];
}

export default function Home() {
  const [current] = useState(0);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const images = ['/images/h1.jpg', '/images/h2.jpg'];

  const getImageUrl = (image: string | undefined | null) => {
    if (!image) return '/images/category_placeholder.png';
    if (image.startsWith('http')) return image;
    return `${process.env.NEXT_PUBLIC_API_URL}/${image}`;
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [images.length]);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/health`)
      .then((res) => res.json())
      .then((data) => console.log('API Connected:', data))
      .catch(() => {});
  }, []);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories`, {
          cache: 'no-store',
        });

        const data = await res.json();

        console.log('Categories API Response:', data);

        let categoriesData: Category[] = [];

        if (Array.isArray(data)) {
          categoriesData = data;
        } else if (Array.isArray(data.data)) {
          categoriesData = data.data;
        } else if (Array.isArray(data.categories)) {
          categoriesData = data.categories;
        }

        const activeCategories = categoriesData.filter((cat) => cat.status === 'active');

        setCategories(activeCategories);

        setLoading(false);
      } catch (error) {
        console.error('Category fetch error:', error);
        setLoading(false);
      }
    };

    loadCategories();
  }, []);

  const [machines, setMachines] = useState<Machine[]>([]);
  const [machinesLoading, setMachinesLoading] = useState(true);

  useEffect(() => {
    const fetchMachines = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/machines`);
        const data = await res.json();
        if (data.success) {
          setMachines(data.data.slice(0, 8)); // Show top 8
        }
      } catch (error) {
        console.error('Machine fetch error:', error);
      } finally {
        setMachinesLoading(false);
      }
    };
    fetchMachines();
  }, []);

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
            A trusted digital marketplace connecting sellers of advanced agricultural equipment with
            farmers across the region.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <button
              className="bg-green-600 hover:bg-green-700 px-8 py-3 rounded-full font-semibold transition"
              onClick={() => window.scrollTo({ top: 1200, behavior: 'smooth' })}
            >
              Explore Equipment
            </button>

            <button className="border border-white px-8 py-3 rounded-full font-semibold hover:bg-white hover:text-black transition">
              Become a Seller
            </button>
          </div>
        </div>
      </section>

      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-10">
            What are you looking for today?
          </h2>

          {loading ? (
            <p className="text-center">Loading categories...</p>
          ) : categories.length === 0 ? (
            <p className="text-center">No categories found</p>
          ) : (
            <div className="flex gap-10 justify-center overflow-x-auto scrollbar-hide py-4">
              {categories.map((category) => (
                <div
                  key={category._id}
                  className="flex flex-col items-center cursor-pointer group min-w-[110px]"
                >
                  <div className="relative w-28 h-28 rounded-full overflow-hidden shadow-md group-hover:shadow-xl transition duration-300">
                    <Image
                      src={getImageUrl(category.image)}
                      alt={category.name}
                      fill
                      unoptimized
                      className="object-cover group-hover:scale-110 transition duration-500"
                    />
                  </div>

                  <p className="mt-4 text-sm font-medium text-gray-700 group-hover:text-green-600 transition">
                    {category.name}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold">Featured Equipment</h2>

            <button className="text-green-600 font-semibold hover:underline">View All</button>
          </div>

          {machinesLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-80 bg-gray-100 animate-pulse rounded-2xl"></div>
              ))}
            </div>
          ) : machines.length === 0 ? (
            <div className="text-center py-10 text-gray-500">
              No equipment listed yet. Be the first to add one!
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {machines.map((machine) => (
                <div
                  key={machine._id}
                  className="border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition duration-300 group"
                >
                  <div className="relative w-full h-52 bg-gray-50">
                    <Image
                      src={getImageUrl(machine.images?.[0])}
                      alt={machine.machineName}
                      fill
                      unoptimized
                      className="object-cover group-hover:scale-105 transition duration-500"
                    />
                    <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-green-700 shadow-sm border border-green-100">
                      {machine.condition || 'Available'}
                    </div>
                  </div>

                  <div className="p-5">
                    <div className="text-xs font-medium text-green-600 mb-1 uppercase tracking-wider">
                      {machine.category?.name}
                    </div>
                    <h3 className="font-bold text-gray-800 mb-2 line-clamp-1">
                      {machine.machineName}
                    </h3>

                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-green-600 font-extrabold text-lg">
                        ₹{machine.pricing?.rentalPrice}
                      </span>
                      <span className="text-gray-400 text-sm font-medium">
                        / {machine.pricing?.priceType?.split(' ')[1] || 'hr'}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 text-gray-500 text-xs mb-5">
                      <span></span>
                      <span className="line-clamp-1">
                        {machine.location?.village || machine.location?.district || 'Location N/A'}
                      </span>
                    </div>

                    <button className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-semibold transition shadow-md shadow-green-100 hover:shadow-green-200">
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
