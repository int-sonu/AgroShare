'use client';

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
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Calendar,
  User,
  Package,
  CreditCard,
  Clock,
} from 'lucide-react';

interface Booking {
  _id: string;
  machine: {
    machineName: string;
    brandModel: string;
  };
  customer: {
    name: string;
    phone: string;
    email: string;
  };
  startDate: string;
  endDate: string;
  quantity: number;
  totalPrice: number;
  bookingType: 'reservation' | 'rental';
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  createdAt: string;
}

export default function SellerBookingsPage() {
  const { accessToken } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const fetchBookings = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/bookings/seller`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          cache: 'no-store',
        }
      );

      if (!res.ok) {
        throw new Error('Failed to fetch bookings');
      }

      const data = await res.json();

      if (data?.success) {
        setBookings(data.data);
      } else {
        setBookings([]);
      }

    } catch (error) {
      console.error('Fetch bookings error:', error);
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (accessToken) fetchBookings();
  }, [accessToken]);

  const handleStatusUpdate = async (id: string, newStatus: string) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/bookings/${id}/status`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (!res.ok) {
        throw new Error('Failed to update status');
      }

      const data = await res.json();

      if (data?.success) {
        setBookings((prev) =>
          prev.map((b) =>
            b._id === id ? { ...b, status: newStatus as any } : b
          )
        );
      }

    } catch (error) {
      console.error('Update status error:', error);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-amber-100 text-amber-700">Pending</Badge>;
      case 'confirmed':
        return <Badge className="bg-green-100 text-green-700">Confirmed</Badge>;
      case 'cancelled':
        return <Badge className="bg-rose-100 text-rose-700">Cancelled</Badge>;
      case 'completed':
        return <Badge className="bg-blue-100 text-blue-700">Completed</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6 p-4">
      <div>
        <h1 className="text-2xl font-black text-gray-900">
          Booking Management
        </h1>
        <p className="text-sm text-gray-500">
          View and manage requests for your machinery
        </p>
      </div>

      <Card className="rounded-2xl overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Machine</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Dates</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {bookings.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10">
                  No bookings found
                </TableCell>
              </TableRow>
            ) : (
              bookings.map((booking) => (
                <TableRow key={booking._id}>
                  <TableCell>
                    {booking.machine?.machineName}
                  </TableCell>

                  <TableCell>
                    {booking.customer?.name}
                  </TableCell>

                  <TableCell>
                    {new Date(booking.startDate).toLocaleDateString()}
                  </TableCell>

                  <TableCell>
                    ₹{booking.totalPrice}
                  </TableCell>

                  <TableCell>
                    {getStatusBadge(booking.status)}
                  </TableCell>

                  <TableCell className="text-right">
                    {booking.status === 'pending' && (
                      <Button
                        size="sm"
                        onClick={() =>
                          handleStatusUpdate(booking._id, 'confirmed')
                        }
                      >
                        Confirm
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}