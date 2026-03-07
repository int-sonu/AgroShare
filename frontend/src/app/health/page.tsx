'use client';

import { useEffect, useState } from 'react';

export default function HealthPage() {
  const [status, setStatus] = useState('Checking...');
  const [color, setColor] = useState('text-gray-600');

  useEffect(() => {
    const checkHealth = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/health`);

        const data = await res.json();

        if (res.ok) {
          setStatus(data.status);
          setColor('text-green-600');
        } else {
          setStatus('Backend error');
          setColor('text-red-600');
        }
      } catch {
        setStatus('Backend not reachable');
        setColor('text-red-600');
      }
    };

    checkHealth();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md text-center">
        <h1 className="text-2xl font-bold mb-4">AgroShare System Health</h1>

        <p className={`text-lg font-semibold ${color}`}>{status}</p>
      </div>
    </div>
  );
}
