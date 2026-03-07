'use client';

import { useState } from 'react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    setMessage('');

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();

    if (res.ok) {
      setMessage('If this email exists, a reset link has been sent.');
    } else {
      setMessage(data.message);
    }

    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md w-96 space-y-4">
        <h2 className="text-xl font-bold text-center text-gray-900">Forgot Password</h2>

        <input
          type="email"
          placeholder="Enter your email"
          className="w-full border p-2 rounded text-gray-900"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <button type="submit" disabled={loading} className="w-full bg-black text-white p-2 rounded">
          {loading ? 'Sending...' : 'Send Reset Link'}
        </button>

        {message && <p className="text-sm text-center text-gray-600">{message}</p>}
      </form>
    </div>
  );
}
