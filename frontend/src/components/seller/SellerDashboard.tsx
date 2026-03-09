'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function Dashboard() {
  const router = useRouter();
  const { accessToken } = useAuth();

  useEffect(() => {
    const check = async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/seller/profile`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const data = await res.json();
      const seller = data.data;

      if (!seller) {
        router.replace('/seller/create-profile');
        return;
      }

      if (seller.verificationStatus === 'pending') {
        router.replace('/seller/pending');
        return;
      }

      if (seller.verificationStatus === 'approved' && !seller.bankAdded) {
        router.replace('/seller/bank');
        return;
      }
    };

    check();
  }, [accessToken, router]);

  return <div>Seller Dashboard</div>;
}
