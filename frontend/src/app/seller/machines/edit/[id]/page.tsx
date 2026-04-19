'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import MachineDetailsStep from '@/components/machine/MachineDetailsStep';
import PricingStep from '@/components/machine/PricingStep';
import LocationStep from '@/components/machine/LocationStep';
import ImagesStep from '@/components/machine/ImagesStep';
import OperatorStep from '@/components/machine/OperatorStep';
import TransportStep from '@/components/machine/TransportStep';
import ReviewStep from '@/components/machine/ReviewStep';

const STEPS = ['Details', 'Pricing', 'Location', 'Images', 'Operator', 'Transport', 'Review'];

export default function EditMachinePage() {
  const { id } = useParams<{ id: string }>();
  const { accessToken: ctxToken } = useAuth();
  const accessToken =
    ctxToken || (typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null);

  const [step, setStep] = useState(1);
  const [machineId, setMachineId] = useState<string>(id);
  const [initialData, setInitialData] = useState<Record<string, any> | undefined>(undefined); // eslint-disable-line @typescript-eslint/no-explicit-any
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMachine = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/machines/${id}`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        const data = await res.json();
        if (data.success) {
          setInitialData(data.data);
          setMachineId(data.data._id);
        }
      } catch (err) {
        console.error('Failed to load machine for editing', err);
      } finally {
        setLoading(false);
      }
    };

    if (id && accessToken) fetchMachine();
  }, [id, accessToken]);

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto flex items-center justify-center h-64">
        <p className="text-gray-500">Loading machine data...</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-5">Edit Machine</h1>

        <div className="flex items-center gap-1">
          {STEPS.map((label, i) => {
            const num = i + 1;
            const done = step > num;
            const active = step === num;

            return (
              <div key={label} className="flex items-center flex-1 last:flex-none">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                      done
                        ? 'bg-green-600 text-white'
                        : active
                          ? 'bg-green-600 text-white ring-4 ring-green-100'
                          : 'bg-gray-100 text-gray-400'
                    }`}
                  >
                    {done ? '✓' : num}
                  </div>

                  <span
                    className={`text-[10px] mt-1 font-medium ${
                      active ? 'text-green-700' : 'text-gray-400'
                    }`}
                  >
                    {label}
                  </span>
                </div>

                {i < STEPS.length - 1 && (
                  <div
                    className={`flex-1 h-0.5 mx-1 mb-4 ${
                      step > num ? 'bg-green-500' : 'bg-gray-200'
                    }`}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        {step === 1 && (
          <MachineDetailsStep
            setMachineId={setMachineId}
            nextStep={nextStep}
            initialData={initialData}
          />
        )}

        {step === 2 && machineId && (
          <PricingStep
            machineId={machineId}
            nextStep={nextStep}
            prevStep={prevStep}
            initialData={initialData}
          />
        )}

        {step === 3 && machineId && (
          <LocationStep
            machineId={machineId}
            nextStep={nextStep}
            prevStep={prevStep}
            initialData={initialData}
          />
        )}

        {step === 4 && machineId && (
          <ImagesStep
            machineId={machineId}
            nextStep={nextStep}
            prevStep={prevStep}
            initialData={initialData}
          />
        )}

        {step === 5 && machineId && (
          <OperatorStep
            machineId={machineId}
            nextStep={nextStep}
            prevStep={prevStep}
            initialData={initialData}
          />
        )}

        {step === 6 && machineId && (
          <TransportStep
            machineId={machineId}
            nextStep={nextStep}
            prevStep={prevStep}
            initialData={initialData}
          />
        )}

        {step === 7 && machineId && <ReviewStep machineId={machineId} prevStep={prevStep} />}
      </div>
    </div>
  );
}
