'use client';

import { usePathname } from 'next/navigation';
import SellerSidebar from '@/components/seller/SellerSidebar';
import SellerNavbar from '@/components/seller/SellerNavbar';

export default function SellerLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const hideLayoutRoutes = ['/seller/complete-profile', '/seller/pending', '/seller/bank'];

  const shouldHideLayout = hideLayoutRoutes.includes(pathname);

  return (
    <div className="min-h-screen flex flex-col">
      {!shouldHideLayout && <SellerNavbar />}

      <div className="flex flex-1">
        {!shouldHideLayout && <SellerSidebar />}

        <main className="flex-1 p-6 bg-gray-50">{children}</main>
      </div>
    </div>
  );
}
