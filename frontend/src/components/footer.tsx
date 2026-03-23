'use client';

import Link from "next/link";
import { Sprout, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#0a1f14] text-gray-300 pt-12 pb-6 border-t border-[#133825]">
      <div className="container max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
        
        <div className="lg:pr-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-4">
            <Sprout className="w-6 h-6 text-green-500" strokeWidth={2.5} />
            <span className="text-xl font-bold text-white tracking-tight">
              AgroShare<span className="text-green-500">.</span>
            </span>
          </Link>
          <p className="text-[14px] leading-relaxed text-gray-400 mb-4">
            A trusted digital marketplace connecting sellers of modern
            agricultural machinery with farmers across the region. Cultivating success, together.
          </p>
        </div>

        <div>
          <h3 className="text-white text-[15px] font-semibold mb-4">Quick Links</h3>
          <ul className="space-y-2 text-[14px] text-gray-400">
            <li><Link href="/" className="hover:text-green-400 transition-colors">Home</Link></li>
            <li><Link href="/categories" className="hover:text-green-400 transition-colors">Categories</Link></li>
            <li><Link href="/about" className="hover:text-green-400 transition-colors">About Us</Link></li>
            <li><Link href="/contact" className="hover:text-green-400 transition-colors">Contact</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-white text-[15px] font-semibold mb-4">For Sellers</h3>
          <ul className="space-y-2 text-[14px] text-gray-400">
            <li><Link href="/auth/register" className="hover:text-green-400 transition-colors">Become a Seller</Link></li>
            <li><Link href="/pricing" className="hover:text-green-400 transition-colors">Pricing Options</Link></li>
            <li><Link href="/support" className="hover:text-green-400 transition-colors">Seller Support</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-white text-[15px] font-semibold mb-4">Contact Us</h3>
          <ul className="space-y-2 text-[14px] text-gray-400">
            <li className="flex items-start gap-3">
              <Mail className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
              <span className="hover:text-white transition-colors cursor-pointer">info.agroshare@gmail.com</span>
            </li>
            <li className="flex items-start gap-3">
              <Phone className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
              <span className="hover:text-white transition-colors cursor-pointer">+91 98765 43210</span>
            </li>
            <li className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
              <span>Kochi, Kerala, India</span>
            </li>
          </ul>
        </div>

      </div>

      <div className="container max-w-7xl mx-auto px-6 mt-10">
        <div className="border-t border-[#1a452d] pt-6 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
          <p>© {new Date().getFullYear()} AgroShare. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}