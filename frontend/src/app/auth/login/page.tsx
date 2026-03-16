'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Image from 'next/image';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [form, setForm] = useState({
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState({
    email: '',
    password: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const validateField = (name: string, value: string) => {
    let message = '';

    if (name === 'email') {
      if (!value) message = 'Email is required';
      else if (value.length > 254) message = 'Email cannot exceed 254 characters';
      else if (value.includes(' ')) message = 'Email cannot contain spaces';
      else if (value !== value.toLowerCase()) message = 'Email must be lowercase';
      else if (!/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/.test(value))
        message = 'Invalid email format';
    }

    if (name === 'password') {
      if (!value) message = 'Password is required';
      else if (value.includes(' ')) message = 'Password cannot contain spaces';
      else if (value.length < 8) message = 'Password must be at least 8 characters';
    }

    setErrors((prev) => ({
      ...prev,
      [name]: message,
    }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    validateField(name, value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (Object.values(errors).some((err) => err !== '')) {
      setError('Please fix the errors before submitting');
      return;
    }

    if (!form.email || !form.password) {
      setError('All fields are required');
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Login failed');
      }

      login(data.user, data.accessToken);

      router.replace(data.redirect || '/');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-[calc(100vh-115px)] flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-xl overflow-hidden flex">
        <div className="w-2/5 hidden md:flex items-center justify-center bg-white p-6">
          <div className="relative w-full h-96">
            <Image src="/images/register.jpg" alt="Login" fill className="object-contain" />
          </div>
        </div>

        <div className="w-full md:w-3/5 p-12 relative">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Login</h2>

          {error && <div className="bg-red-100 text-red-600 text-sm p-2 rounded mb-4">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                className="w-full border border-gray-300 rounded-md px-4 py-3 text-sm text-gray-900 placeholder:text-gray-500 focus:ring-2 focus:ring-blue-500 outline-none"
                onChange={handleChange}
              />

              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>

            <div>
              <input
                type="password"
                name="password"
                placeholder="Enter your password"
                className="w-full border border-gray-300 rounded-md px-4 py-3 text-sm text-gray-900 placeholder:text-gray-500 focus:ring-2 focus:ring-blue-500 outline-none"
                onChange={handleChange}
              />

              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
            </div>

            <div className="text-right">
              <span
                onClick={() => router.push('/auth/forgot-password')}
                className="text-sm text-blue-600 cursor-pointer hover:underline"
              >
                Forgot Password?
              </span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-2.5 text-sm font-medium rounded-md transition"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>

            <div className="text-center text-sm text-gray-900">
              Don&apos;t have an account?{' '}
              <span
                onClick={() => router.push('/auth/register')}
                className="text-blue-600 cursor-pointer hover:underline"
              >
                Register
              </span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
