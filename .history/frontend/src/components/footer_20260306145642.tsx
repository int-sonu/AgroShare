'use client';

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 pt-16 pb-8">

      <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-10">

        <div>
          <h2 className="text-2xl font-bold text-white mb-4">
            AgroShare<span className="text-green-500">.</span>
          </h2>
          <p className="text-sm leading-relaxed">
            A trusted digital marketplace connecting sellers of modern
            agricultural machinery with farmers across the region.
          </p>
        </div>

        <div>
          <h3 className="text-white font-semibold mb-4">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li><Link href="/" className="hover:text-green-500">Home</Link></li>
            <li><Link href="/categories" className="hover:text-green-500">Categories</Link></li>
            <li><Link href="/about" className="hover:text-green-500">About Us</Link></li>
            <li><Link href="/contact" className="hover:text-green-500">Contact</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-white font-semibold mb-4">For Sellers</h3>
          <ul className="space-y-2 text-sm">
            <li><Link href="/auth/register" className="hover:text-green-500">Become a Seller</Link></li>
            <li><Link href="/dashboard" className="hover:text-green-500">Seller Dashboard</Link></li>
            <li><Link href="/pricing" className="hover:text-green-500">Pricing</Link></li>
            <li><Link href="/support" className="hover:text-green-500">Support</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-white font-semibold mb-4">Contact</h3>
          <ul className="space-y-2 text-sm">
            <li>Email: support@agroshare.com</li>
            <li>Phone: +91 98765 43210</li>
            <li>Kochi, Kerala, India</li>
          </ul>
        </div>

      </div>

      <div className="border-t border-gray-700 mt-12 pt-6 text-center text-sm text-gray-400">
        © {new Date().getFullYear()} AgroShare. All rights reserved.
      </div>

    </footer>
  );
}