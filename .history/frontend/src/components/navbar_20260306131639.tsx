"use client";

import Link from "next/link";
import { Search, ShoppingCart } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  return (
    <div className="w-full">

      {/* Top Navbar */}
      <div className="bg-[#c7d6cf] py-3 px-6 flex items-center justify-between">

        {/* Logo */}
        <div className="flex items-center gap-2 text-xl font-bold">
          🚜 AgroShare<span className="text-green-600">.</span>
        </div>

        {/* Search */}
        <div className="w-[450px] relative">
          <Input placeholder="Search farming equipment..." />
          <Search className="absolute right-3 top-2.5 text-gray-500" size={18} />
        </div>

        {/* Right Menu */}
        <div className="flex items-center gap-5">

          <Button className="bg-green-600 rounded-full">
            Signup
          </Button>

          <Link href="/login">Login</Link>

          <div className="flex items-center gap-2">
            <ShoppingCart size={20} />
            <span>Cart ₹89,250</span>
          </div>

        </div>

      </div>

      {/* Bottom Menu */}
      <div className="bg-gray-200 py-3 flex justify-center gap-10 font-medium">

        <Link href="/">HOME</Link>
        <Link href="/categories">CATEGORIES</Link>
        <Link href="/about">ABOUT</Link>
        <Link href="/contact">CONTACT</Link>

      </div>

    </div>
  );
}