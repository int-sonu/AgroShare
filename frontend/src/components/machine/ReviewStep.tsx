'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

type ReviewStepProps = {
  machineId: string;
  prevStep: () => void;
};

interface Machine {
  machineName: string;
  category: { name: string };
  brandModel: string;
  yearOfManufacture: number;
  pricing: {
    rentalPrice: number;
    priceType: string;
  };
  location: {
    village: string;
    district: string;
    state: string;
  };
}

export default function ReviewStep({ machineId, prevStep }: ReviewStepProps) {
  const router = useRouter();
  const { accessToken: ctxToken } = useAuth();

  const accessToken =
    ctxToken || (typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null);

  const [machine, setMachine] = useState<Machine | null>(null);

  useEffect(() => {
    const fetchMachine = async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/machines/${machineId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const data = await res.json();

      if (data.success) {
        setMachine(data.data);
      }
    };

    if (machineId) fetchMachine();
  }, [machineId, accessToken]);

  const publish = async () => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/machines/${machineId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          isPublished: true,
        }),
      });

      alert('Machine Published Successfully');

      router.push('/seller/products');
    } catch (error) {
      console.error(error);
      alert('Failed to publish machine');
    }
  };

  if (!machine) return <p>Loading...</p>;

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Review & Publish</h2>

      {/* Machine Summary */}

      <div className="border rounded-md p-4 space-y-2">
        <p>
          <b>Machine:</b> {machine.machineName}
        </p>

        <p>
          <b>Category:</b> {machine.category?.name}
        </p>

        <p>
          <b>Brand:</b> {machine.brandModel}
        </p>

        <p>
          <b>Year:</b> {machine.yearOfManufacture}
        </p>

        <p>
          <b>Price:</b> ₹{machine.pricing?.rentalPrice}
        </p>

        <p>
          <b>Price Type:</b> {machine.pricing?.priceType}
        </p>

        {machine.location?.village && (
          <p>
            <b>Place:</b> {machine.location.village}, {machine.location.district}
          </p>
        )}

        <p>
          <b>State:</b> {machine.location?.state || '-'}
        </p>
      </div>

      <div className="flex gap-3">
        <button className="px-4 py-2 border rounded-md" onClick={prevStep}>
          Back
        </button>

        <button
          className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
          onClick={publish}
        >
          Publish Machine
        </button>
      </div>
    </div>
  );
}
