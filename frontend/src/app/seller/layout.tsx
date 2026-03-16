'use client';

import { usePathname } from 'next/navigation';
import SellerSidebar from '@/components/seller/SellerSidebar';
import SellerNavbar from '@/components/seller/SellerNavbar';

export default function SellerLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const hideLayoutRoutes = ['/seller/complete-profile', '/seller/pending', '/seller/bank'];

  const shouldHideLayout = hideLayoutRoutes.includes(pathname);

  return (
    <div className="min-h-screen bg-gray-50">
      {!shouldHideLayout && <SellerNavbar />}

      <div className="flex">
        {!shouldHideLayout && <SellerSidebar />}

        <main className={`flex-1 p-8 ${!shouldHideLayout ? 'ml-64 mt-[72px]' : ''}`}>
          <div className="max-w-7xl mx-auto w-full">{children}</div>
        </main>
      </div>
    </div>
  );
}
