"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function RegisterPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    role: "customer",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!form.name || !form.email || !form.phone || !form.password) {
      setError("All fields are required");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        }
      );

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data.message || "Registration failed");
      }

      router.push("/auth/login");
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">

      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-xl overflow-hidden flex">

        <div className="hidden md:flex w-1/2 items-center justify-center bg-gray-50 p-6">
          <Image
            src="/images/register.jpg"
            alt="Register Illustration"
            width={420}
            height={420}
            className="object-contain"
          />
        </div>

        {/* Right Form */}
        <div className="w-full md:w-1/2 px-10 py-8">

          {/* Login link */}
          <div className="flex justify-end text-sm mb-4">
            <span className="text-gray-500 mr-1">
              Already have an account?
            </span>
            <span
              onClick={() => router.push("/auth/login")}
              className="text-blue-600 font-medium cursor-pointer hover:underline"
            >
              Login →
            </span>
          </div>

          {/* Title */}
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-gray-900">
              Create Account
            </h2>
            <p className="text-gray-500 text-sm mt-1">
              Start your journey with AgroShare
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-100 text-red-600 text-sm p-2 rounded-md mb-3">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3">

            <input
              name="name"
              placeholder="Full Name"
              className="w-full border border-gray-300 rounded-md px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-500 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
              onChange={handleChange}
            />

            <input
              name="email"
              type="email"
              placeholder="Email Address"
              className="w-full border border-gray-300 rounded-md px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-500 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
              onChange={handleChange}
            />

            <input
              name="phone"
              placeholder="Phone Number"
              className="w-full border border-gray-300 rounded-md px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-500 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
              onChange={handleChange}
            />

            <input
              name="password"
              type="password"
              placeholder="Password"
              className="w-full border border-gray-300 rounded-md px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-500 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
              onChange={handleChange}
            />

            <select
              name="role"
              className="w-full border border-gray-300 rounded-md px-4 py-2.5 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
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
              {loading ? "Creating Account..." : "Create Account"}
            </button>

          </form>

        </div>
      </div>
    </div>
  );
}