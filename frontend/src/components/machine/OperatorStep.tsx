'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';

type OperatorStepProps = {
  machineId: string;
  nextStep: () => void;
  prevStep: () => void;
  initialData?: any;
};

export default function OperatorStep({ machineId, nextStep, prevStep, initialData }: OperatorStepProps) {
  const { accessToken: token } = useAuth();

  const accessToken =
    token || (typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null);

  const [operatorIncluded, setOperatorIncluded] = useState(initialData?.operator?.operatorIncluded ?? false);
  const [operatorName, setOperatorName] = useState(initialData?.operator?.operatorName || '');
  const [operatorPhone, setOperatorPhone] = useState(initialData?.operator?.operatorPhone || '');

  const handleSubmit = async () => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/machines/${machineId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          operator: {
            operatorIncluded,
            operatorName: operatorIncluded ? operatorName : undefined,
            operatorPhone: operatorIncluded ? operatorPhone : undefined,
          },
          wizardStep: 5,
        }),
      });

      nextStep();
    } catch (error) {
      console.error('Operator update failed', error);
      alert('Failed to save operator details');
    }
  };

  return (
    <div className="space-y-4">
      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={operatorIncluded}
          onChange={(e) => setOperatorIncluded(e.target.checked)}
        />
        Operator Included
      </label>

      {operatorIncluded && (
        <>
          <input
            value={operatorName}
            placeholder="Operator Name"
            className="w-full p-2 border rounded-md"
            onChange={(e) => setOperatorName(e.target.value)}
          />

          <input
            value={operatorPhone}
            placeholder="Operator Phone"
            className="w-full p-2 border rounded-md"
            onChange={(e) => setOperatorPhone(e.target.value)}
          />
        </>
      )}

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
