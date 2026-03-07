"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

import { Table, TableHeader, TableHead, TableRow, TableBody, TableCell,} from "@/components/ui/table";

interface Seller {
  _id: string;
  sellerType: string;
  businessName?: string;
  verificationStatus: string;
  state: string;
  district: string;
  city: string;
  createdAt: string;
  userId: {
    name: string;
    email: string;
    phone: string;
  };
}

export default function SellersPage() {
  const { accessToken, user, loading } = useAuth();
  const router = useRouter();

  const [sellers, setSellers] = useState<Seller[]>([]);
  const [error, setError] = useState("");
  const [selectedSeller, setSelectedSeller] = useState<Seller | null>(null);

  useEffect(() => {
    if (!loading) {
      if (!user || user.role !== "admin") {
        router.push("/");
      } else {
        fetchSellers();
      }
    }
  }, [loading]);

  const fetchSellers = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/sellers`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const result = await res.json();

      if (!res.ok) throw new Error(result.message);

      setSellers(result.data);
    } catch (err: any) {
      setError(err.message);
    }
  };
const verifySeller = async (id: string, status: "approved" | "rejected") => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/admin/sellers/${id}/verify`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ status }),
      }
    );

    const result = await res.json();

    if (!res.ok) {
      throw new Error(result.message || "Verification failed");
    }

    fetchSellers(); 

  } catch (err: any) {
    alert(err.message);
  }
};

  if (loading) return <div className="p-10">Loading...</div>;

  return (
    <div className="p-8">

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">
          Seller Management
        </h1>

        <input
          placeholder="Search sellers..."
          className="border px-3 py-2 rounded-md text-sm w-64"
        />
      </div>

      {error && (
        <div className="bg-red-100 text-red-600 p-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="bg-white border rounded-lg shadow-sm">

        <Table>

          <TableHeader>
            <TableRow>
              <TableHead className=" text-gray-900">Seller</TableHead>
              <TableHead className=" text-gray-900">Email</TableHead>
              <TableHead className=" text-gray-900">Location</TableHead>
              <TableHead className=" text-gray-900">Type</TableHead>
              <TableHead className="">Status</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead className="text-right">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {sellers.map((seller) => (

              <TableRow key={seller._id}>

                <TableCell>
                  <div className="flex items-center gap-3">

                    <div className="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center text-sm font-semibold">
                      {seller.userId?.name?.charAt(0)}
                    </div>

                    <div>
                      <p className="font-medium">
                        {seller.userId?.name}
                      </p>

                      <p className="text-xs text-gray-500">
                        {seller.userId?.phone}
                      </p>
                    </div>

                  </div>
                </TableCell>

                <TableCell className="text-gray-600">
                  {seller.userId?.email}
                </TableCell>

                <TableCell>
                  {seller.city}, {seller.district}
                </TableCell>

                <TableCell className="capitalize">
                  {seller.sellerType}
                </TableCell>

                <TableCell>
                  <span
                    className={`px-2 py-1 text-xs rounded-md font-medium ${
                      seller.verificationStatus === "approved"
                        ? "bg-green-100 text-green-700"
                        : seller.verificationStatus === "rejected"
                        ? "bg-red-100 text-red-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {seller.verificationStatus}
                  </span>
                </TableCell>

                <TableCell className="text-gray-500">
                  {new Date(seller.createdAt).toLocaleDateString()}
                </TableCell>

                <TableCell className="text-right space-x-2">

                  <button
                    onClick={() => setSelectedSeller(seller)}
                    className="px-3 py-1 text-sm border rounded hover:bg-gray-100"
                  >
                    View
                  </button>

                  {seller.verificationStatus === "pending" && (
                    <>
                      <button
                        onClick={() =>
                          verifySeller(seller._id, "approved")
                        }
                        className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700"
                      >
                        Approve
                      </button>

                      <button
                        onClick={() =>
                          verifySeller(seller._id, "rejected")
                        }
                        className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
                      >
                        Reject
                      </button>
                    </>
                  )}

                </TableCell>

              </TableRow>
            ))}
          </TableBody>

        </Table>

      </div>

      {selectedSeller && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">

          <div className="bg-white rounded-lg p-6 w-96">

            <h2 className="text-lg font-semibold mb-4">
              Seller Details
            </h2>

            <div className="space-y-2 text-sm">

              <p>
                <strong>Name:</strong> {selectedSeller.userId.name}
              </p>

              <p>
                <strong>Email:</strong> {selectedSeller.userId.email}
              </p>

              <p>
                <strong>Phone:</strong> {selectedSeller.userId.phone}
              </p>

              <p>
                <strong>Seller Type:</strong> {selectedSeller.sellerType}
              </p>

              {selectedSeller.businessName && (
                <p>
                  <strong>Business:</strong>{" "}
                  {selectedSeller.businessName}
                </p>
              )}

              <p>
                <strong>Location:</strong>{" "}
                {selectedSeller.city},{" "}
                {selectedSeller.district},{" "}
                {selectedSeller.state}
              </p>

              <p>
                <strong>Status:</strong>{" "}
                {selectedSeller.verificationStatus}
              </p>

              <p>
                <strong>Joined:</strong>{" "}
                {new Date(
                  selectedSeller.createdAt
                ).toLocaleDateString()}
              </p>

            </div>

            <div className="mt-6 text-right">
              <button
                onClick={() => setSelectedSeller(null)}
                className="px-4 py-2 bg-gray-800 text-white rounded"
              >
                Close
              </button>
            </div>

          </div>

        </div>
      )}

    </div>
  );
}