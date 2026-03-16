'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function RegisterPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    role: 'customer',
  });

  const [errors, setErrors] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const validateField = (name: string, value: string) => {
    let message = '';

    if (name === 'name') {
      if (!value.trim()) message = 'Name is required';
      else if (value.length > 30) message = 'Maximum 30 characters allowed';
      else if (value.trim() !== value) message = 'No leading or trailing spaces';
      else if (!/^[A-Za-z]+(?: [A-Za-z]+)*$/.test(value))
        message = 'Only letters allowed and no multiple spaces';
      else if (value[0] !== value[0].toUpperCase()) message = 'First letter must be capital';
    }

    if (name === 'email') {
      if (!value.trim()) message = 'Email is required';
      else if (value.length > 254) message = 'Email cannot exceed 254 characters';
      else if (value.includes(' ')) message = 'Email cannot contain spaces';
      else if (value.trim() !== value) message = 'No leading or trailing spaces';
      else if (value !== value.toLowerCase()) message = 'Email must be lowercase';
      else if (!/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/.test(value))
        message = 'Invalid email format';
    }

    if (name === 'phone') {
      if (!value) message = 'Phone number is required';
      else if (value.includes(' ')) message = 'Phone cannot contain spaces';
      else if (!/^[0-9]+$/.test(value)) message = 'Only numbers allowed';
      else if (!/^[6-9]\d{9}$/.test(value))
        message = 'Phone must be 10 digits starting with 6,7,8,9';
    }

    if (name === 'password') {
      if (!value) message = 'Password is required';
      else if (value.length < 8) message = 'Minimum 8 characters required';
      else if (value.length > 64) message = 'Maximum 64 characters allowed';
      else if (value.includes(' ')) message = 'Password cannot contain spaces';
      else if (!/[A-Z]/.test(value)) message = 'Must contain one uppercase letter';
      else if (!/[a-z]/.test(value)) message = 'Must contain one lowercase letter';
      else if (!/[0-9]/.test(value)) message = 'Must contain one number';
      else if (!/[@$!%*?&]/.test(value))
        message = 'Must contain one special character (@ $ ! % * ? &)';
    }

    setErrors((prev) => ({
      ...prev,
      [name]: message,
    }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
      setError('Please fill the form  before submitting');
      return;
    }

    if (!form.name || !form.email || !form.phone || !form.password) {
      setError('All fields are required');
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      router.push('/auth/login');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-[calc(100vh-115px)] flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-xl overflow-hidden flex">
        <div className="hidden md:flex w-1/2 items-center justify-center bg-white p-6">
          <Image
            src="/images/register.jpg"
            alt="Register Illustration"
            width={420}
            height={420}
            className="object-contain"
          />
        </div>

        <div className="w-full md:w-1/2 px-10 py-8">
          <div className="flex justify-end text-sm mb-4">
            <span className="text-gray-500 mr-1">Already have an account?</span>
            <span
              onClick={() => router.push('/auth/login')}
              className="text-blue-600 font-medium cursor-pointer hover:underline"
            >
              Login →
            </span>
          </div>

          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-gray-900">Create Account</h2>
            <p className="text-gray-500 text-sm mt-1">Start your journey with AgroShare</p>
          </div>

          {error && (
            <div className="bg-red-100 text-red-600 text-sm p-2 rounded-md mb-3">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <input
                name="name"
                placeholder="Full Name"
                className="w-full border border-gray-300 rounded-md px-4 py-2.5 text-sm"
                onChange={handleChange}
              />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
            </div>

            <div>
              <input
                name="email"
                type="email"
                placeholder="Email Address"
                className="w-full border border-gray-300 rounded-md px-4 py-2.5 text-sm"
                onChange={handleChange}
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>

            <div>
              <input
                name="phone"
                placeholder="Phone Number"
                className="w-full border border-gray-300 rounded-md px-4 py-2.5 text-sm"
                onChange={handleChange}
              />
              {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
            </div>

            <div>
              <input
                name="password"
                type="password"
                placeholder="Password"
                className="w-full border border-gray-300 rounded-md px-4 py-2.5 text-sm"
                onChange={handleChange}
              />
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
            </div>

            <select
              name="role"
              className="w-full border border-gray-300 rounded-md px-4 py-2.5 text-sm text-black"
              onChange={handleChange}
            >
              <option value="customer">Customer</option>
              <option value="seller">Seller</option>
            </select>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-2.5 text-sm font-medium rounded-md transition"
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
