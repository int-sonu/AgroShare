"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth(); 

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setError("");

    try {
      setLoading(true);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include", 
          body: JSON.stringify(form),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Login failed");
      }

      login(data.user, data.accessToken);

      router.replace(data.redirect || "/");

    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-xl overflow-hidden flex">

        <div className="w-2/5 hidden md:flex items-center justify-center bg-gray-50 p-6">
          <div className="relative w-full h-96">
            <img
              src="/images/register.jpg"
              alt="Login"
              className="w-full h-full object-contain"
            />
          </div>
        </div>

        <div className="w-full md:w-3/5 p-12 relative">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">
            Login
          </h2>

          {error && (
            <div className="bg-red-100 text-red-600 text-sm p-2 rounded mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">

            <input
              type="email"
              name="email"
              placeholder="Email"
              className="w-full border border-gray-300 rounded-md px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              onChange={handleChange}
              required
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              className="w-full border border-gray-300 rounded-md px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              onChange={handleChange}
              required
            />

            <div className="text-right">
              <span
                onClick={() => router.push("/auth/forgot-password")}
                className="text-sm text-blue-600 cursor-pointer hover:underline"
              >
                Forgot Password?
              </span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black hover:bg-gray-800 text-white py-3 text-sm font-semibold rounded-md transition"
            >
              {loading ? "Logging in..." : "Login"}
            </button>

            <div className="text-center text-sm">
              Don't have an account?{" "}
              <span
                onClick={() => router.push("/auth/register")}
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