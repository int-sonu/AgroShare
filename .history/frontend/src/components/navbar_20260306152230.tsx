'use client'

import Link from 'next/link'
import { Search, ShoppingCart } from 'lucide-react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full bg-white shadow-sm">

      {/* Top Bar */}
      <div className="border-b bg-green-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/images/logo.png"
              alt="AgroShare Logo"
              width={42}
              height={42}
              className="object-contain"
              priority
            />
            <span className="text-2xl font-bold text-gray-900">
              AgroShare<span className="text-green-600">.</span>
            </span>
          </Link>

          {/* Search */}
          <div className="hidden md:flex flex-1 max-w-xl mx-8 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search farming equipment..."
              className="pl-10 rounded-full bg-white shadow-sm focus-visible:ring-green-200"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center gap-5">

            <Link href="/auth/register">
              <Button className="bg-green-600 hover:bg-green-700 text-white rounded-full px-5">
                Signup
              </Button>
            </Link>

            <Link
              href="/auth/login"
              className="text-gray-700 font-medium hover:text-green-600 transition"
            >
              Login
            </Link>

            {/* Cart */}
            <div className="relative flex items-center gap-3 cursor-pointer group">
              <div className="relative">
                <ShoppingCart className="h-6 w-6 text-gray-700 group-hover:text-green-600 transition" />
                <Badge className="absolute -top-2 -right-2 bg-green-600 text-white text-xs">
                  2
                </Badge>
              </div>

              <div className="hidden sm:block text-sm">
                <p className="text-gray-500">Cart</p>
                <p className="font-semibold text-green-600">₹89,250</p>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="border-b bg-white">
        <div className="max-w-7xl mx-auto flex justify-center gap-10 py-3 text-sm font-semibold">

          <Link href="/" className="hover:text-green-600 transition relative group">
            HOME
            <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-green-600 transition-all group-hover:w-full"></span>
          </Link>

          <Link href="/categories" className="hover:text-green-600 transition relative group">
            CATEGORIES
            <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-green-600 transition-all group-hover:w-full"></span>
          </Link>

          <Link href="/about" className="hover:text-green-600 transition relative group">
            ABOUT
            <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-green-600 transition-all group-hover:w-full"></span>
          </Link>

          <Link href="/contact" className="hover:text-green-600 transition relative group">
            CONTACT
            <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-green-600 transition-all group-hover:w-full"></span>
          </Link>

        </div>
      </div>

    </nav>
  )
}