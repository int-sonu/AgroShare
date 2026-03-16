'use client';

import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

import {
  Table,
  TableHeader,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
} from '@/components/ui/table';
import {
  Search,
  ShieldCheck,
  Mail,
  Phone,
  MapPin,
  Calendar,
  ExternalLink,
  Check,
  X,
} from 'lucide-react';

interface Seller {
  _id: string;
  sellerType: string;
  businessName?: string;
  verificationStatus: string;
  state: string;
  district: string;
  city: string;
  createdAt: string;
  isBlocked: boolean;

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
  const [error, setError] = useState('');
  const [selectedSeller, setSelectedSeller] = useState<Seller | null>(null);

  const fetchSellers = useCallback(async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/sellers`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const result = await res.json();

      if (!res.ok) throw new Error(result.message);

      setSellers(result.data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to fetch sellers');
    }
  }, [accessToken]);

  useEffect(() => {
    if (!loading) {
      if (!user || user.role !== 'admin') {
        router.push('/');
      } else {
        fetchSellers();
      }
    }
  }, [loading, user, router, fetchSellers]);

  const verifySeller = async (id: string, status: 'approved' | 'rejected') => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/sellers/${id}/verify`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ status }),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || 'Verification failed');
      }

      fetchSellers();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'An unknown error occurred');
    }
  };
  const blockSeller = async (id: string) => {
    try {
      const reason = prompt('Enter reason for blocking this seller:');

      if (!reason) return;

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/seller/admin/block/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ reason }),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || 'Block failed');
      }

      fetchSellers();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Block failed');
    }
  };

  const unblockSeller = async (id: string) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/seller/admin/unblock/${id}`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || 'Unblock failed');
      }

      fetchSellers();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Unblock failed');
    }
  };

  if (loading) return <div className="p-10">Loading...</div>;

  return (
    <div className="p-8 max-w-[1600px] mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-7 ">
        <div>
          <h1 className="text-xl font-black text-slate-900 tracking-tighter leading-none uppercase">
            Sellers <span className="text-primary">Network</span>
          </h1>
          <p className=" text-slate-900 mt-1.5 text-[11px] font-black uppercase tracking-widest max-w-lg leading-relaxed">
            Verify Merchant network status
          </p>
        </div>

        <div className="relative group">
          <Search
            size={14}
            className="absolute left-4 top-1/2 -translate-y-1/2  text-slate-900 group-focus-within:text-primary transition-colors"
          />
          <input
            placeholder="Search merchants..."
            className="bg-white border border-slate-100 px-10 py-2.5 rounded-xl text-[10px] w-64 outline-none focus:ring-4 focus:ring-primary/10 transition-all placeholder: text-slate-900 font-bold uppercase tracking-tight"
          />
        </div>
      </div>

      {error && (
        <div className="bg-rose-50 border border-rose-100 text-rose-600 p-6 rounded-[2rem] flex items-center gap-4 animate-in fade-in slide-in-from-top-4">
          <ShieldCheck size={24} />
          <p className="font-bold uppercase tracking-tight text-sm">{error}</p>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50/50 border-none hover:bg-slate-50/50">
              <TableHead className="p-4 pl-6  text-slate-900 uppercase text-[9px] font-black tracking-[0.2em]">
                Merchant
              </TableHead>
              <TableHead className="p-4  text-slate-900 uppercase text-[9px] font-black tracking-[0.2em]">
                Contact
              </TableHead>
              <TableHead className="p-4  text-slate-900 uppercase text-[9px] font-black tracking-[0.2em]">
                Class
              </TableHead>
              <TableHead className="p-4  text-slate-900 uppercase text-[9px] font-black tracking-[0.2em]">
                Verification
              </TableHead>
              <TableHead className="p-4  text-slate-900 uppercase text-[9px] font-black tracking-[0.2em]">
                Joined
              </TableHead>
              <TableHead className="p-4 pr-6 text-right  text-slate-900 uppercase text-[9px] font-black tracking-[0.2em]">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody className="divide-y divide-slate-50/50">
            {sellers.map((seller) => (
              <TableRow
                key={seller._id}
                className="group border-none hover:bg-slate-50/30 transition-all"
              >
                <TableCell className="p-4 pl-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center text-[13px] font-black shadow-sm group-hover:scale-105 transition-transform">
                      {seller.userId?.name?.charAt(0)}
                    </div>

                    <div>
                      <p className="font-black text-slate-900 text-[13px] tracking-tight uppercase leading-tight">
                        {seller.userId?.name}
                      </p>
                      <div className="flex items-center gap-1.5 mt-0.5  text-slate-400">
                        <MapPin size={9} strokeWidth={3} />
                        <p className="text-[9px] font-black uppercase tracking-tight">
                          {seller.city}, {seller.district}
                        </p>
                      </div>
                    </div>
                  </div>
                </TableCell>

                <TableCell className="p-4">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2  text-slate-900 font-bold text-[10px]">
                      <Mail size={12} />
                      <span>{seller.userId?.email}</span>
                    </div>
                    <div className="flex items-center gap-2  text-slate-900 font-black text-[9px] uppercase">
                      <Phone size={12} />
                      <span>{seller.userId?.phone}</span>
                    </div>
                  </div>
                </TableCell>

                <TableCell className="p-4 capitalize">
                  <div className="font-black text-slate-950 uppercase tracking-widest text-[9px] py-1 px-2.5 bg-slate-50 border border-slate-100 rounded-md inline-block">
                    {seller.sellerType}
                  </div>
                </TableCell>

                <TableCell className="p-4">
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-xl text-[9px] font-black uppercase tracking-widest border border-slate-100 ${
                      seller.verificationStatus === 'approved'
                        ? 'bg-primary/10 text-primary'
                        : seller.verificationStatus === 'rejected'
                          ? 'bg-rose-50 text-rose-700'
                          : 'bg-amber-50 text-amber-700'
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full mr-2 ${
                        seller.verificationStatus === 'approved'
                          ? 'bg-primary'
                          : seller.verificationStatus === 'rejected'
                            ? 'bg-rose-500'
                            : 'bg-amber-500 animate-pulse'
                      }`}
                    ></span>
                    {seller.verificationStatus}
                  </span>
                </TableCell>

                <TableCell className="p-4">
                  <div className="flex items-center gap-1.5 text-slate-900 font-black text-[9px] uppercase tracking-tight">
                    <Calendar size={12} />
                    {new Date(seller.createdAt).toLocaleDateString()}
                  </div>
                </TableCell>

                <TableCell className="p-4 pr-6 text-right">
                  <div className="flex justify-end gap-1.5">
                    <button
                      onClick={() => setSelectedSeller(seller)}
                      className="w-7 h-7 flex items-center justify-center  text-slate-900 hover:text-slate-900 hover:bg-slate-50 rounded-md transition-all"
                      title="View Profile"
                    >
                      <ExternalLink size={14} />
                    </button>

                    {seller.verificationStatus === 'pending' && (
                      <div className="flex gap-1.5">
                        <button
                          onClick={() => verifySeller(seller._id, 'approved')}
                          className="w-8 h-8 flex items-center justify-center bg-primary text-white rounded-lg hover:bg-primary-dark shadow-sm transition-all"
                          title="Approve Seller"
                        >
                          <Check size={14} strokeWidth={3} />
                        </button>

                        <button
                          onClick={() => verifySeller(seller._id, 'rejected')}
                          className="w-7 h-7 flex items-center justify-center bg-rose-500 text-white rounded-md hover:bg-rose-400 shadow-sm transition-all"
                          title="Reject Seller"
                        >
                          <X size={14} strokeWidth={3} />
                        </button>
                      </div>
                    )}
                    {seller.isBlocked ? (
                      <button
                        onClick={() => unblockSeller(seller._id)}
                        className="w-7 h-7 flex items-center justify-center bg-green-600 text-white rounded-md"
                        title="Unblock Seller"
                      >
                        <Check size={14} />
                      </button>
                    ) : (
                      <button
                        onClick={() => blockSeller(seller._id)}
                        className="w-7 h-7 flex items-center justify-center bg-red-600 text-white rounded-md"
                        title="Block Seller"
                      >
                        <ShieldCheck size={14} />
                      </button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {selectedSeller && (
        <div className="fixed inset-0 bg-slate-950/20 backdrop-blur-[2px] flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
          <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl space-y-6 relative overflow-hidden border border-slate-100">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-primary to-primary-dark/50"></div>

            <div className="flex items-center gap-6">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center text-2xl font-black shadow-md">
                {selectedSeller.userId?.name?.charAt(0)}
              </div>
              <div>
                <h2 className="text-xl font-black text-slate-950 tracking-tighter uppercase leading-tight">
                  {selectedSeller.userId.name}
                </h2>
                <p className=" text-slate-900 font-black uppercase tracking-widest text-[9px] mt-0.5">
                  {selectedSeller.sellerType} MERCHANT
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6 text-slate-900">
              <div className="space-y-0.5">
                <p className="text-[9px] font-black  text-slate-900 uppercase tracking-widest">
                  Digital Mail
                </p>
                <p className="font-bold text-xs">{selectedSeller.userId.email}</p>
              </div>

              <div className="space-y-0.5">
                <p className="text-[9px] font-black  text-slate-900 uppercase tracking-widest">
                  Mobile Line
                </p>
                <p className="font-bold text-xs">{selectedSeller.userId.phone}</p>
              </div>

              <div className="space-y-0.5">
                <p className="text-[9px] font-black  text-slate-900 uppercase tracking-widest">
                  Global Location
                </p>
                <p className="font-bold text-xs leading-snug">
                  {selectedSeller.city}, {selectedSeller.district}, {selectedSeller.state}
                </p>
              </div>

              <div className="space-y-0.5">
                <p className="text-[9px] font-black  text-slate-900 uppercase tracking-widest">
                  Joined Network
                </p>
                <p className="font-bold text-xs">
                  {new Date(selectedSeller.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className="flex justify-between items-center pt-6 border-t border-slate-50">
              <div
                className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border ${
                  selectedSeller.verificationStatus === 'approved'
                    ? 'bg-primary/10 text-primary border-primary/10'
                    : 'bg-amber-50 text-amber-700 border-amber-100/50'
                }`}
              >
                {selectedSeller.verificationStatus}
              </div>

              <button
                onClick={() => setSelectedSeller(null)}
                className="px-6 py-2.5 bg-primary text-white rounded-xl font-black uppercase tracking-widest text-[10px] hover:bg-primary-dark transition-all"
              >
                Close Profile
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
