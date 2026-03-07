"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import DashboardCards from "@/components/admin/DashboardCards";

export default function AdminDashboard() {
  const { accessToken, user, loading } = useAuth();
  const router = useRouter();

  const [stats, setStats] = useState<any>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!loading) {
      if (!user || user.role !== "admin") {
        router.push("/");
      } else {
        fetchDashboard();
      }
    }
  }, [loading]);

  const fetchDashboard = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/dashboard`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || "Failed to fetch dashboard");
      }

      setStats(result.data);

    } catch (err: any) {
      setError(err.message);
    }
  };

  if (loading) return <div className="p-10">Loading...</div>;

  return (
    <div className="bg-gray-100 min-h-screen p-8">

      <h1 className="text-2xl font-bold mb-6">
        Admin Dashboard
      </h1>

      {error && (
        <div className="bg-red-100 text-red-600 p-3 rounded mb-4">
          {error}
        </div>
      )}

      {stats && <DashboardCards stats={stats} />}

    </div>
  );
}