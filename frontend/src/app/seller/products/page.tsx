'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface Machine {
  _id: string;
  machineName: string;
  category: { name: string };
  brandModel: string;
  yearOfManufacture: number;
  condition: string;
  machineCapacityHP: number;
  fuelType: string;
  description: string;
  pricing: {
    priceType: string;
    rentalPrice: number;
    minimumRentalDuration: number;
    securityDeposit: number;
  };
  location: {
    village: string;
    district: string;
    state: string;
    pincode: string;
  };
  operator: {
    operatorIncluded: boolean;
    operatorName: string;
    operatorPhone: string;
  };
  transport: {
    transportAvailable: boolean;
    transportCost: number;
  };
  isPublished: boolean;
  images: string[];
}

export default function ProductsPage() {
  const { accessToken } = useAuth();
  const [machines, setMachines] = useState<Machine[]>([]);
  const [selectedMachine, setSelectedMachine] = useState<Machine | null>(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchMachines = async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/machines/seller/my`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        cache: 'no-store',
      });

      const data = await res.json();

      if (data.success) {
        setMachines(data.data);
      }
    };

    if (accessToken) fetchMachines();
  }, [accessToken]);

  const filteredMachines = machines.filter((m) =>
    m.machineName.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold">My Machines</h1>

          <p className="text-sm text-gray-500">Manage your listed machines</p>
        </div>

        <Link href="/seller/machines/add">
          <Button className="bg-green-600 hover:bg-green-700">+ Add Machine</Button>
        </Link>
      </div>

      <div className="flex justify-between items-center">
        <div className="relative w-72">
          <input
            type="text"
            placeholder="Search machines..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border rounded-lg px-4 py-2 text-sm"
          />
        </div>

        <div className="flex gap-3">
          <select className="border rounded-lg px-3 py-2 text-sm">
            <option>Status</option>
            <option>Published</option>
            <option>Draft</option>
          </select>

          <select className="border rounded-lg px-3 py-2 text-sm">
            <option>Category</option>
          </select>
        </div>
      </div>

      <Card className="rounded-xl border border-gray-100 shadow-sm overflow-hidden bg-white">
        <Table>
          <TableHeader className="bg-white">
            <TableRow>
              <TableHead className="pl-6">Machine</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Brand</TableHead>
              <TableHead>Year</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right pr-6">Action</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {filteredMachines.map((machine) => (
              <TableRow key={machine._id} className="hover:bg-gray-50 transition">
                <TableCell className="pl-6">
                  <div className="flex items-center gap-3">
                    <span className="font-medium">{machine.machineName}</span>
                  </div>
                </TableCell>

                <TableCell>{machine.category?.name || '-'}</TableCell>

                <TableCell>{machine.brandModel || '-'}</TableCell>

                <TableCell>{machine.yearOfManufacture || '-'}</TableCell>

                <TableCell className="font-medium">
                  ₹{machine.pricing?.rentalPrice || '-'}
                </TableCell>

                <TableCell>
                  <span
                    className={`px-3 py-1 text-xs rounded-full font-medium ${
                      machine.isPublished
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {machine.isPublished ? 'Published' : 'Draft'}
                  </span>
                </TableCell>

                <TableCell className="text-right pr-6">
                  <button
                    onClick={() => setSelectedMachine(machine)}
                    className="text-gray-500 hover:text-black"
                  >
                    ⋯
                  </button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      <div className="flex justify-between items-center text-sm">
        <p className="text-gray-500">Showing {filteredMachines.length} machines</p>

        <div className="flex gap-2">
          <button className="px-3 py-1 border rounded">Previous</button>

          <button className="px-3 py-1 border rounded bg-gray-100">1</button>

          <button className="px-3 py-1 border rounded">Next</button>
        </div>
      </div>

      <Dialog open={!!selectedMachine} onOpenChange={() => setSelectedMachine(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{selectedMachine?.machineName}</DialogTitle>
          </DialogHeader>

          {selectedMachine && (
            <div className="space-y-2 text-sm overflow-y-auto max-h-[70vh] pr-2">
              <p>
                <b>Category:</b> {selectedMachine.category?.name || '-'}
              </p>

              <p>
                <b>Brand:</b> {selectedMachine.brandModel || '-'}
              </p>

              <p>
                <b>Year:</b> {selectedMachine.yearOfManufacture || '-'}
              </p>

              <p>
                <b>Condition:</b> {selectedMachine.condition || '-'}
              </p>

              <p>
                <b>Capacity (HP):</b> {selectedMachine.machineCapacityHP || '-'}
              </p>

              <p>
                <b>Fuel:</b> {selectedMachine.fuelType || '-'}
              </p>

              <p>
                <b>Description:</b> {selectedMachine.description || '-'}
              </p>

              <hr className="my-2" />

              <p>
                <b>Price Type:</b> {selectedMachine.pricing?.priceType || '-'}
              </p>

              <p>
                <b>Rental Price:</b> ₹{selectedMachine.pricing?.rentalPrice || '-'}
              </p>

              <p>
                <b>Minimum Duration:</b> {selectedMachine.pricing?.minimumRentalDuration || '-'}
              </p>

              <p>
                <b>Security Deposit:</b> ₹{selectedMachine.pricing?.securityDeposit || '-'}
              </p>

              <hr className="my-2" />

              <p>
                <b>Village:</b> {selectedMachine.location?.village || '-'}
              </p>

              <p>
                <b>District:</b> {selectedMachine.location?.district || '-'}
              </p>

              <p>
                <b>State:</b> {selectedMachine.location?.state || '-'}
              </p>

              <p>
                <b>Pincode:</b> {selectedMachine.location?.pincode || '-'}
              </p>

              <hr className="my-2" />

              <p>
                <b>Operator Included:</b>{' '}
                {selectedMachine.operator?.operatorIncluded ? 'Yes' : 'No'}
              </p>

              <p>
                <b>Operator Name:</b> {selectedMachine.operator?.operatorName || '-'}
              </p>

              <p>
                <b>Operator Phone:</b> {selectedMachine.operator?.operatorPhone || '-'}
              </p>

              <hr className="my-2" />

              <p>
                <b>Transport Available:</b>{' '}
                {selectedMachine.transport?.transportAvailable ? 'Yes' : 'No'}
              </p>

              <p>
                <b>Transport Cost:</b> ₹{selectedMachine.transport?.transportCost || '-'}
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
