"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {LayoutDashboard,Users,Tractor,ShoppingCart,Layers,CreditCard,Star,BarChart,Settings,HelpCircle,} from "lucide-react";

export default function AdminSidebar() {
  const pathname = usePathname();

  const linkClass = (path: string) =>
    `flex items-center gap-3 px-4 py-2 rounded-md text-sm ${
      pathname === path
        ? "bg-green-600 text-white"
        : "text-gray-300 hover:bg-gray-700"
    }`;

  return (
    <aside className="w-64 bg-gray-900 text-white min-h-screen p-4">

      <div className="mb-8">
        <h2 className="text-xl font-bold text-green-500">
          AgroShare Admin
        </h2>
      </div>

      <nav className="space-y-2">

        <Link href="/admin/dashboard" className={linkClass("/admin/dashboard")}>
          <LayoutDashboard size={18} />
          Dashboard
        </Link>

        <Link href="/admin/users" className={linkClass("/admin/users")}>
          <Users size={18} />
          Users
        </Link>

        <Link href="/admin/sellers" className={linkClass("/admin/sellers")}>
          <Users size={18} />
          Sellers
        </Link>

        <Link href="/admin/machines" className={linkClass("/admin/machines")}>
          <Tractor size={18} />
          Machines
        </Link>

        <Link href="/admin/orders" className={linkClass("/admin/orders")}>
          <ShoppingCart size={18} />
          Orders
        </Link>

        <Link href="/admin/categories" className={linkClass("/admin/categories")}>
          <Layers size={18} />
          Categories
        </Link>

        <Link href="/admin/payments" className={linkClass("/admin/payments")}>
          <CreditCard size={18} />
          Payments
        </Link>

        <Link href="/admin/reviews" className={linkClass("/admin/reviews")}>
          <Star size={18} />
          Reviews
        </Link>

        <Link href="/admin/reports" className={linkClass("/admin/reports")}>
          <BarChart size={18} />
          Reports
        </Link>

        <Link href="/admin/settings" className={linkClass("/admin/settings")}>
          <Settings size={18} />
          Settings
        </Link>

        <Link href="/admin/support" className={linkClass("/admin/support")}>
          <HelpCircle size={18} />
          Support
        </Link>

      </nav>
    </aside>
  );
}