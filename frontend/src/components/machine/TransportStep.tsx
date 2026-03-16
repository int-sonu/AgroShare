'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';

type TransportStepProps = {
  machineId: string;
  nextStep: () => void;
  prevStep: () => void;
};

export default function TransportStep({ machineId, nextStep, prevStep }: TransportStepProps) {
  const { accessToken: ctxToken } = useAuth();

  const accessToken =
    ctxToken || (typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null);

  const [transportAvailable, setTransportAvailable] = useState(false);
  const [transportCost, setTransportCost] = useState('');

  const handleSubmit = async () => {
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/machines/${machineId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        transport: {
          transportAvailable,
          transportCost: transportAvailable ? Number(transportCost) : undefined,
        },
        wizardStep: 6,
      }),
    });

    nextStep();
  };

  return (
    <div className="space-y-4">
      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={transportAvailable}
          onChange={(e) => setTransportAvailable(e.target.checked)}
        />
        Transport Available
      </label>

      {transportAvailable && (
        <input
          placeholder="Transport Cost"
          value={transportCost}
          className="w-full p-2 border rounded-md"
          onChange={(e) => setTransportCost(e.target.value)}
        />
      )}

      <div className="flex gap-3">
        <button className="px-4 py-2 border rounded-md" onClick={prevStep}>
          Back
        </button>

        <button className="bg-green-600 text-white px-4 py-2 rounded-md" onClick={handleSubmit}>
          Next
        </button>
      </div>
    </div>
  );
}
