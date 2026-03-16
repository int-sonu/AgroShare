'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';

type LocationStepProps = {
  machineId: string;
  nextStep: () => void;
  prevStep: () => void;
};

export default function LocationStep({ machineId, nextStep, prevStep }: LocationStepProps) {
  const { accessToken: ctxToken } = useAuth();

  const accessToken =
    ctxToken || (typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null);

  const [address, setAddress] = useState('');
  const [village, setVillage] = useState('');
  const [district, setDistrict] = useState('');
  const [state, setState] = useState('');
  const [pincode, setPincode] = useState('');

  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [isGeocoding, setIsGeocoding] = useState(false);

  // Get coordinates from Village, District, State
  const findOnMap = async () => {
    if (!village && !district) {
      alert('Please enter Village and District first');
      return;
    }

    setIsGeocoding(true);
    try {
      const query = `${village || ''}, ${district}, ${state}, India`;
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`,
      );
      const data = await res.json();

      if (data && data.length > 0) {
        setLatitude(parseFloat(data[0].lat));
        setLongitude(parseFloat(data[0].lon));
      } else {
        alert(
          "Could not find coordinates for this location. Please check Village/District or use 'Current Location'.",
        );
      }
    } catch (error) {
      console.error('Geocoding failed', error);
      alert('Search failed. Please try again.');
    } finally {
      setIsGeocoding(false);
    }
  };

  // Get browser location
  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation not supported');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLatitude(position.coords.latitude);
        setLongitude(position.coords.longitude);
      },
      (error) => {
        console.error(error);
        alert('Location permission denied');
      },
    );
  };

  const handleSubmit = async () => {
    if (!address || !district || !state) {
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
          location: {
            address,
            village,
            district,
            state,
            pincode,

            type: 'Point',
            coordinates: latitude && longitude ? [longitude, latitude] : undefined,
          },
          wizardStep: 3,
        }),
      });

      nextStep();
    } catch (error) {
      console.error('Location update failed', error);
      alert('Failed to save location');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition font-medium flex-1"
          onClick={getCurrentLocation}
        >
          Auto GPS
        </button>

        <button
          className="bg-slate-700 text-white px-4 py-2 rounded-md hover:bg-slate-800 transition disabled:opacity-50 font-medium flex-1"
          onClick={findOnMap}
          disabled={isGeocoding}
        >
          {isGeocoding ? 'Finding...' : 'Search Town'}
        </button>
      </div>

      {latitude && longitude && (
        <div className="p-3 bg-blue-50 border border-blue-100 rounded-md">
          <p className="text-sm text-blue-700 flex items-center gap-1">
            <span>📍</span> Map Location set
          </p>
        </div>
      )}

      <p className="text-xs text-gray-500 italic px-1">
        Provide address or use buttons above for exact mapping
      </p>

      <input
        value={address}
        placeholder="Specific Address / Landmark (Optional)"
        className="w-full p-2 border rounded-md"
        onChange={(e) => setAddress(e.target.value)}
      />

      <input
        value={village}
        placeholder="Town / Village"
        className="w-full p-2 border rounded-md"
        onChange={(e) => setVillage(e.target.value)}
      />

      <input
        value={district}
        placeholder="District"
        className="w-full p-2 border rounded-md"
        onChange={(e) => setDistrict(e.target.value)}
      />

      <input
        value={state}
        placeholder="State"
        className="w-full p-2 border rounded-md"
        onChange={(e) => setState(e.target.value)}
      />

      <input
        value={pincode}
        placeholder="Pincode"
        className="w-full p-2 border rounded-md"
        onChange={(e) => setPincode(e.target.value)}
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
