'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';

type Props = {
  setMachineId: (id: string) => void;
  nextStep: () => void;
};

export default function MachineDetailsStep({ setMachineId, nextStep }: Props) {
  const { accessToken: ctxToken } = useAuth();

  const accessToken =
    ctxToken || (typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null);

  const [machineName, setMachineName] = useState('');
  const [category, setCategory] = useState('');
  const [brandModel, setBrandModel] = useState('');
  const [yearOfManufacture, setYearOfManufacture] = useState('');
  const [condition, setCondition] = useState('');
  const [machineCapacityHP, setMachineCapacityHP] = useState('');
  const [fuelType, setFuelType] = useState('');
  const [description, setDescription] = useState('');

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

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/machines`, {
        method: 'POST',
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
          wizardStep: 1,
        }),
      });

      const data = await res.json();

      if (data.success && data.data) {
        setMachineId(data.data._id);
        nextStep();
      } else {
        alert(data.message || 'Failed to create machine');
      }
    } catch (error) {
      console.error('Submission error:', error);
      alert(`Network error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  return (
    <div className="space-y-4">
      <input
        value={machineName}
        placeholder="Machine Name"
        className="w-full p-2 border rounded-md"
        onChange={(e) => setMachineName(e.target.value)}
      />

      <select
        value={category}
        className="w-full p-2 border rounded-md"
        onChange={(e) => setCategory(e.target.value)}
      >
        <option value="">Select Category</option>

        {categories.map((cat) => (
          <option key={cat._id} value={cat._id}>
            {cat.name}
          </option>
        ))}
      </select>

      <input
        value={brandModel}
        placeholder="Brand / Model"
        className="w-full p-2 border rounded-md"
        onChange={(e) => setBrandModel(e.target.value)}
      />

      <input
        type="number"
        value={yearOfManufacture}
        placeholder="Year (e.g. 2024)"
        className="w-full p-2 border rounded-md"
        onChange={(e) => setYearOfManufacture(e.target.value)}
      />

      <select
        value={condition}
        className="w-full p-2 border rounded-md"
        onChange={(e) => setCondition(e.target.value)}
      >
        <option value="">Condition</option>
        <option value="New">New</option>
        <option value="Good">Good</option>
        <option value="Used">Used</option>
      </select>

      <input
        type="number"
        value={machineCapacityHP}
        placeholder="Capacity (HP)"
        className="w-full p-2 border rounded-md"
        onChange={(e) => setMachineCapacityHP(e.target.value)}
      />

      <select
        value={fuelType}
        className="w-full p-2 border rounded-md"
        onChange={(e) => setFuelType(e.target.value)}
      >
        <option value="">Fuel Type</option>
        <option value="Diesel">Diesel</option>
        <option value="Petrol">Petrol</option>
      </select>

      <textarea
        value={description}
        placeholder="Description"
        className="w-full p-2 border rounded-md"
        onChange={(e) => setDescription(e.target.value)}
      />

      <button
        className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
        onClick={handleSubmit}
      >
        Next
      </button>
    </div>
  );
}
