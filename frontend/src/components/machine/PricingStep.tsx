'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';

type PricingStepProps = {
  machineId: string;
  nextStep: () => void;
  prevStep: () => void;
};

export default function PricingStep({ machineId, nextStep, prevStep }: PricingStepProps) {
  const { accessToken: ctxToken } = useAuth();

  const accessToken =
    ctxToken || (typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null);

  const [priceType, setPriceType] = useState('');
  const [rentalPrice, setRentalPrice] = useState('');
  const [minimumRentalDuration, setMinimumRentalDuration] = useState('');
  const [securityDeposit, setSecurityDeposit] = useState('');

  const handleSubmit = async () => {
    if (!priceType || !rentalPrice) {
      alert('Please fill required fields');
      return;
    }

    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/machines/${machineId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          pricing: {
            priceType,
            rentalPrice: Number(rentalPrice),
            minimumRentalDuration: minimumRentalDuration
              ? Number(minimumRentalDuration)
              : undefined,
            securityDeposit: securityDeposit ? Number(securityDeposit) : undefined,
          },
          wizardStep: 2,
        }),
      });

      nextStep();
    } catch (error) {
      console.error('Pricing update failed', error);
      alert('Failed to save pricing');
    }
  };

  return (
    <div className="space-y-4">
      <select
        value={priceType}
        className="w-full p-2 border rounded-md"
        onChange={(e) => setPriceType(e.target.value)}
      >
        <option value="">Select Price Type</option>
        <option value="Per Hour">Per Hour</option>
        <option value="Per Day">Per Day</option>
        <option value="Per Acre">Per Acre</option>
      </select>

      <input
        type="number"
        placeholder="Rental Price"
        value={rentalPrice}
        className="w-full p-2 border rounded-md"
        onChange={(e) => setRentalPrice(e.target.value)}
      />

      <input
        type="number"
        placeholder="Min Duration (Days/Hours)"
        value={minimumRentalDuration}
        className="w-full p-2 border rounded-md"
        onChange={(e) => setMinimumRentalDuration(e.target.value)}
      />

      <input
        type="number"
        placeholder="Security Deposit (Optional)"
        value={securityDeposit}
        className="w-full p-2 border rounded-md"
        onChange={(e) => setSecurityDeposit(e.target.value)}
      />

      <div className="flex gap-3">
        <button className="px-4 py-2 border rounded-md" onClick={prevStep}>
          Back
        </button>

        <button
          className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
          onClick={handleSubmit}
        >
          Next
        </button>
      </div>
    </div>
  );
}
