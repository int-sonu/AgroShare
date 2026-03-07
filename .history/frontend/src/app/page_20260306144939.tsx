'use client';

import { useEffect, useState } from 'react';
import API from '@/services/api';

export default function Home() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    API.get('/health')
      .then((res) => {
        setMessage(res.data.status);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold">AgroShare Frontend</h1>
      <p className="mt-4 text-green-600">{message}</p>
    </div>
  );
}
