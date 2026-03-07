"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function CreateProfile() {
  const router = useRouter();
  const { accessToken, loading: authLoading } = useAuth();

  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    sellerType: "individual",
    businessName: "",
    state: "",
    district: "",
    city: "",
    address: "",
    pincode: "",
  });

  // ✅ Check profile
  useEffect(() => {
    const checkProfile = async () => {
      if (!accessToken) {
        router.push("/auth/login");
        return;
      }

      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/seller/profile`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        if (res.ok) {
          router.replace("/seller/dashboard");
        }
      } catch (err) {
        console.log("No profile yet");
      } finally {
        setChecking(false);
      }
    };

    if (!authLoading) {
      checkProfile();
    }
  }, [accessToken, authLoading, router]);

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ✅ Submit
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!accessToken) {
      router.push("/auth/login");
      return;
    }

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/seller/profile`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(form),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to create profile");
      }

      router.replace("/seller/dashboard");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (checking || authLoading) {
    return <div className="text-center mt-20">Loading...</div>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-xl bg-white p-8 rounded-xl shadow-lg">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800">
          Complete Seller Profile
        </h2>

        {error && (
          <div className="bg-red-100 text-red-600 p-2 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <select
            name="sellerType"
            value={form.sellerType}
            onChange={handleChange}
            className="w-full border rounded-md p-2"
          >
            <option value="individual">Individual</option>
            <option value="shop">Shop</option>
          </select>

          {form.sellerType === "shop" && (
            <input
              name="businessName"
              placeholder="Business Name"
              onChange={handleChange}
              required
              className="w-full border rounded-md p-2"
            />
          )}

          <input name="state" placeholder="State" required onChange={handleChange} className="w-full border rounded-md p-2" />
          <input name="district" placeholder="District" required onChange={handleChange} className="w-full border rounded-md p-2" />
          <input name="city" placeholder="City" required onChange={handleChange} className="w-full border rounded-md p-2" />
          <textarea name="address" placeholder="Full Address" required onChange={handleChange} className="w-full border rounded-md p-2" />
          <input name="pincode" placeholder="Pincode" required onChange={handleChange} className="w-full border rounded-md p-2" />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-2 rounded-md"
          >
            {loading ? "Saving..." : "Save Profile"}
          </button>
        </form>
      </div>
    </div>
  );
}