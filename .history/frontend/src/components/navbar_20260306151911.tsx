"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const { user, logout } = useAuth();
  const router = useRouter();

  return (
    <nav className="flex justify-between p-4 bg-white shadow">

      <div
        className="font-bold cursor-pointer"
        onClick={() => router.push("/")}
      >
        AgroShare
      </div>

      <div>
        {user ? (
          <button
            onClick={logout}
            className="bg-red-500 text-white px-4 py-2 rounded"
          >
            Logout
          </button>
        ) : (
          <div className="space-x-4">
            <span
              onClick={() => router.push("/auth/login")}
              className="cursor-pointer text-blue-600"
            >
              Login
            </span>
            <span
              onClick={() => router.push("/auth/register")}
              className="cursor-pointer text-blue-600"
            >
              Register
            </span>
          </div>
        )}
      </div>

    </nav>
  );
}