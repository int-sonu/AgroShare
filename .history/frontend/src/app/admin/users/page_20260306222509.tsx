"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

import {
  Table,
  TableHeader,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
} from "@/components/ui/table";

interface User {
  _id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  status: string;
  createdAt: string;
}

export default function UsersPage() {
  const { accessToken, user, loading } = useAuth();
  const router = useRouter();

  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!loading) {
      if (!user || user.role !== "admin") {
        router.push("/");
      } else {
        fetchUsers();
      }
    }
  }, [loading]);

  const fetchUsers = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/users`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const result = await res.json();

      if (!res.ok) throw new Error(result.message);

      setUsers(result.data);
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="p-8">

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">
          Users Management
        </h1>

        <input
          placeholder="Search users..."
          className="border px-3 py-2 rounded-md text-sm w-64"
        />
      </div>

      {error && (
        <div className="bg-red-100 text-red-600 p-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="bg-white border rounded-lg shadow-sm ">

        <Table>

          <TableHeader className="text-gray-900">
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead className="text-right">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {users.map((u) => (
              <TableRow key={u._id}>

                <TableCell>
                  <div className="flex items-center gap-3">

                    <div className="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center text-sm font-semibold">
                      {u.name.charAt(0)}
                    </div>

                    <div>
                      <p className="font-medium text-gray-900">
                        {u.name}
                      </p>
                    </div>

                  </div>
                </TableCell>

                <TableCell className="text-gray-900">
                  {u.email}
                </TableCell>

                <TableCell className="text-gray-900">
                  {u.phone}
                </TableCell>


  <TableCell className="text-gray-900">
                  {new Date(u.createdAt).toLocaleDateString()}
                </TableCell>



                <TableCell>
                  <span
                    className={`px-2 py-1 text-xs rounded-md font-medium ${
                      u.status === "active"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {u.status}
                  </span>
                </TableCell>

              
                <TableCell className="text-right space-x-2">

                  <button className="text-sm px-3 py-1 border rounded hover:bg-gray-100">
                    View
                  </button>

                  <button className="text-sm px-3 py-1 border rounded hover:bg-red-50 text-red-600">
                    Disable
                  </button>

                </TableCell>

              </TableRow>
            ))}
          </TableBody>

        </Table>

      </div>
    </div>
  );
}