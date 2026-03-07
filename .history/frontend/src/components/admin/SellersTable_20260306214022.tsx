"use client";

import { useState } from "react";

import {Table,TableHeader,TableHead,TableRow,TableBody,TableCell,} from "@/components/ui/table";

interface Seller {
  _id: string;
  userId: {
    name: string;
    email: string;
  };
  city: string;
  district: string;
  verificationStatus: string;
  createdAt: string;
}

interface Props {
  sellers: Seller[];
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}

export default function SellersTable({
  sellers,
  onApprove,
  onReject,
}: Props) {

  const [selectedSeller, setSelectedSeller] = useState<Seller | null>(null);

  return (
    <>
      <div className="bg-white border rounded-lg shadow-sm">

        <Table>

          <TableHeader>
            <TableRow>
              <TableHead>Seller</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Status</TableHead>
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
                    </div>

                  </div>
                </TableCell>

                <TableCell className="text-gray-600">
                  {seller.userId?.email}
                </TableCell>

                <TableCell>
                  {seller.city}, {seller.district}
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
                        onClick={() => onApprove(seller._id)}
                        className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700"
                      >
                        Approve
                      </button>

                      <button
                        onClick={() => onReject(seller._id)}
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

          <div className="bg-white p-6 rounded-lg w-96">

            <h2 className="text-lg font-semibold mb-4">
              Seller Details
            </h2>

            <div className="space-y-2 text-sm">

              <p>
                <strong>Name:</strong>{" "}
                {selectedSeller.userId.name}
              </p>

              <p>
                <strong>Email:</strong>{" "}
                {selectedSeller.userId.email}
              </p>

              <p>
                <strong>Location:</strong>{" "}
                {selectedSeller.city}, {selectedSeller.district}
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
    </>
  );
}