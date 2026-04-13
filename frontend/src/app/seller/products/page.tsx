'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
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
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

import { Edit, Trash2, Eye, MapPin, Phone, Mail, ShieldCheck, Gauge, Fuel, Calendar, Lock, Info } from 'lucide-react';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';

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
  stock: number;
  quantity: number;
}

export default function ProductsPage() {
  const { accessToken } = useAuth();
  const router = useRouter();
  const [machines, setMachines] = useState<Machine[]>([]);
  const [selectedMachine, setSelectedMachine] = useState<Machine | null>(null);
  const [search, setSearch] = useState('');
  const [updatingStock, setUpdatingStock] = useState(false);
  const [editStockValue, setEditStockValue] = useState<number>(1);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingMachine, setEditingMachine] = useState<Machine | null>(null);
  const [editForm, setEditForm] = useState({
    machineName: '',
    rentalPrice: 0,
    stock: 0
  });

  useEffect(() => {
    if (editingMachine) {
      setEditForm({
        machineName: editingMachine.machineName,
        rentalPrice: editingMachine.pricing?.rentalPrice || 0,
        stock: editingMachine.stock || 1
      });
    }
  }, [editingMachine]);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this machine?')) return;

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/machines/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (res.ok) {
        setMachines(prev => prev.filter(m => m._id !== id));
      } else {
        const error = await res.json();
        alert(error.message || 'Failed to delete machine');
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert('An error occurred while deleting');
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/machines/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ isPublished: !currentStatus }),
      });

      if (res.ok) {
        setMachines(prev => prev.map(m => m._id === id ? { ...m, isPublished: !currentStatus } : m));
      }
    } catch (error) {
      console.error('Status toggle error:', error);
    }
  };

  const handleQuickEdit = async () => {
    if (!editingMachine) return;

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/machines/${editingMachine._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          machineName: editForm.machineName,
          pricing: {
            ...(editingMachine.pricing || {}),
            rentalPrice: editForm.rentalPrice
          },
          stock: editForm.stock,
          quantity: editForm.stock // Reset quantity to stock on quick edit
        }),
      });

      if (res.ok) {
        const updated = await res.json();
        setMachines(prev => prev.map(m => m._id === editingMachine._id ? updated.data : m));
        setIsEditDialogOpen(false);
      }
    } catch (error) {
      console.error('Quick edit error:', error);
    }
  };

  useEffect(() => {
    const fetchMachines = async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/machines/seller`, {
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
                  <Badge
                    className={`cursor-pointer ${machine.isPublished
                      ? 'bg-green-100 text-green-700 hover:bg-green-200 border-green-200 shadow-sm'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200 border-gray-200'
                      } text-[10px] font-bold uppercase py-1 px-3 transition-all rounded-full`}
                    onClick={() => handleToggleStatus(machine._id, machine.isPublished)}
                  >
                    {machine.isPublished ? 'Active' : 'Draft'}
                  </Badge>
                </TableCell>

                <TableCell className="text-right pr-6">
                  <div className="flex justify-end gap-2.5">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-9 w-9 p-0 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg border border-transparent hover:border-blue-100 transition-all"
                      onClick={() => router.push(`/seller/machines/edit/${machine._id}`)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-9 w-9 p-0 text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-lg border border-transparent hover:border-rose-100 transition-all"
                      onClick={() => handleDelete(machine._id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-9 w-9 p-0 text-gray-500 hover:text-gray-900 border border-gray-100 hover:border-gray-300 rounded-lg transition-all"
                      onClick={() => setSelectedMachine(machine)}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                  </div>
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

              <hr className="my-2" />

              <div className="space-y-4 pt-2">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-bold text-gray-900 text-sm">Stock Management</p>
                    <p className="text-[9px] text-gray-500 uppercase tracking-widest">Total units owned by you</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={editStockValue}
                      onChange={(e) => setEditStockValue(parseInt(e.target.value) || 0)}
                      className="w-16 border rounded-lg px-2 py-1 text-center font-bold text-sm"
                      min="1"
                    />
                    <Button
                      size="sm"
                      disabled={updatingStock}
                      className="bg-slate-900 hover:bg-green-600 text-white rounded-lg px-3 h-8 font-bold text-[9px] uppercase tracking-widest transition-all disabled:opacity-50"
                      onClick={async () => {
                        if (editStockValue < 1) return;
                        setUpdatingStock(true);

                        try {
                          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/machines/${selectedMachine._id}`, {
                            method: 'PUT',
                            headers: {
                              'Content-Type': 'application/json',
                              Authorization: `Bearer ${accessToken}`,
                            },
                            body: JSON.stringify({
                              stock: editStockValue,
                              quantity: editStockValue // Refill/Sync quantity on stock change
                            }),
                          });

                          if (res.ok) {
                            window.location.reload();
                          }
                        } catch (error) {
                          console.error('Update stock error:', error);
                        } finally {
                          setUpdatingStock(false);
                        }
                      }}
                    >
                      {updatingStock ? '...' : 'Update'}
                    </Button>
                  </div>
                </div>

                <div className="flex items-center justify-between bg-gray-50 p-2.5 rounded-xl border border-gray-100">
                  <div className="flex items-center gap-2.5">
                    <div className={`w-2 h-2 rounded-full ${selectedMachine.quantity > 0 ? 'bg-green-500 animate-pulse' : 'bg-rose-500'}`}></div>
                    <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest">
                      Currently Available: <span className={selectedMachine.quantity > 0 ? 'text-green-600' : 'text-rose-600'}>
                        {selectedMachine.quantity ?? 1} Units
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Quick Edit Machine</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-1">Machine Name</label>
              <Input
                value={editForm.machineName}
                onChange={(e) => setEditForm(prev => ({ ...prev, machineName: e.target.value }))}
                className="font-medium"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-1">Rental Price (₹)</label>
                <Input
                  type="number"
                  value={editForm.rentalPrice}
                  onChange={(e) => setEditForm(prev => ({ ...prev, rentalPrice: parseInt(e.target.value) || 0 }))}
                  className="font-medium"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-1">Total Stock</label>
                <Input
                  type="number"
                  value={editForm.stock}
                  onChange={(e) => setEditForm(prev => ({ ...prev, stock: parseInt(e.target.value) || 0 }))}
                  className="font-medium"
                  min="1"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
            <Button className="bg-green-600 hover:bg-green-700" onClick={handleQuickEdit}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
