'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';

type Props = {
  setMachineId: (id: string) => void;
  nextStep: () => void;
  initialData?: Record<string, any>; // eslint-disable-line @typescript-eslint/no-explicit-any
};

export default function MachineDetailsStep({ setMachineId, nextStep, initialData }: Props) {
  const { accessToken: token } = useAuth();

  const accessToken =
    token || (typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null);

  const [machineName, setMachineName] = useState(initialData?.machineName || '');
  const [category, setCategory] = useState(initialData?.category?._id || initialData?.category || '');
  const [brandModel, setBrandModel] = useState(initialData?.brandModel || '');
  const [yearOfManufacture, setYearOfManufacture] = useState(initialData?.yearOfManufacture || '');
  const [condition, setCondition] = useState(initialData?.condition || '');
  const [machineCapacityHP, setMachineCapacityHP] = useState(initialData?.machineCapacityHP || '');
  const [fuelType, setFuelType] = useState(initialData?.fuelType || '');
  const [description, setDescription] = useState(initialData?.description || '');

  const [categories, setCategories] = useState<{ _id: string; name: string }[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories`);

        if (!res.ok) {
          throw new Error(`Failed to fetch categories: ${res.statusText}`);
        }

        const data = await res.json();

        if (data.success) {
          setCategories(data.data || []);
        } else {
          console.error('API error fetching categories:', data.message);
        }
      } catch (error) {
        console.error('Network or catch error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  const handleSubmit = async () => {
    if (!machineName || !category) {
      alert('Please fill required fields');
      return;
    }

    try {
      if (!accessToken) {
        alert('Login required');
        return;
      }

      const method = initialData ? 'PUT' : 'POST';
      const url = initialData 
        ? `${process.env.NEXT_PUBLIC_API_URL}/machines/${initialData._id}`
        : `${process.env.NEXT_PUBLIC_API_URL}/machines`;

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          machineName,
          category,
          brandModel,
          yearOfManufacture: yearOfManufacture ? Number(yearOfManufacture) : undefined,
          condition,
          machineCapacityHP: machineCapacityHP ? Number(machineCapacityHP) : undefined,
          fuelType,
          description,
          wizardStep: initialData ? Math.max(initialData.wizardStep || 1, 1) : 1,
        }),
      });

      const data = await res.json();

      if (data.success && data.data) {
        setMachineId(data.data._id);
        nextStep();
      } else {
        alert(data.message || 'Failed to save machine details');
      }
    } catch (error) {
      console.error('Submission error:', error);
      alert(`Network error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  return (
    <div className="space-y-3">
      <input value={machineName} placeholder="Machine Name" className="w-full px-3 py-1.5 text-base border rounded-md focus:outline-none focus:ring-2 focus:ring-green-300" onChange={(e) => setMachineName(e.target.value)} />

      <select value={category} className="w-full px-3 py-1.5 text-base border rounded-md focus:outline-none focus:ring-2 focus:ring-green-300" onChange={(e) => setCategory(e.target.value)}>
        <option value="">Select Category</option>
        {categories.map((cat) => (
          <option key={cat._id} value={cat._id}>{cat.name}</option>
        ))}
      </select>

      <input value={brandModel} placeholder="Brand / Model" className="w-full px-3 py-1.5 text-base border rounded-md focus:outline-none focus:ring-2 focus:ring-green-300" onChange={(e) => setBrandModel(e.target.value)} />

      <input type="number" value={yearOfManufacture} placeholder="Year (e.g. 2024)" className="w-full px-3 py-1.5 text-base border rounded-md focus:outline-none focus:ring-2 focus:ring-green-300" onChange={(e) => setYearOfManufacture(e.target.value)} />

      <select value={condition} className="w-full px-3 py-1.5 text-base border rounded-md focus:outline-none focus:ring-2 focus:ring-green-300" onChange={(e) => setCondition(e.target.value)}>
        <option value="">Condition</option>
        <option value="New">New</option>
        <option value="Good">Good</option>
        <option value="Used">Used</option>
      </select>

      <input type="number" value={machineCapacityHP} placeholder="Capacity (HP)" className="w-full px-3 py-1.5 text-base border rounded-md focus:outline-none focus:ring-2 focus:ring-green-300" onChange={(e) => setMachineCapacityHP(e.target.value)} />

      <select value={fuelType} className="w-full px-3 py-1.5 text-base border rounded-md focus:outline-none focus:ring-2 focus:ring-green-300" onChange={(e) => setFuelType(e.target.value)}>
        <option value="">Fuel Type</option>
        <option value="Diesel">Diesel</option>
        <option value="Petrol">Petrol</option>
      </select>

      <textarea value={description} placeholder="Description" rows={3} className="w-full px-3 py-1.5 text-base border rounded-md focus:outline-none focus:ring-2 focus:ring-green-300" onChange={(e) => setDescription(e.target.value)} />

      <button className="bg-green-600 text-white px-4 py-1.5 text-base rounded-md hover:bg-green-700" onClick={handleSubmit}>
        Next
      </button>
    </div>
  );
}
