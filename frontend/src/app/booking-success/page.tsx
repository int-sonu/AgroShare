'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { 
  CheckCircle2, 
  CreditCard
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

interface BookingData {
  _id: string;
  machine: {
    machineName: string;
  };
  startDate: string;
  endDate: string;
  quantity: number;
  totalPrice: number;
  bookingType: 'reservation' | 'rental';
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  holdExpiresAt?: string;
}

function SuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { accessToken } = useAuth();
  const bookingId = searchParams.get('id');
  
  const [booking, setBooking] = useState<BookingData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooking = async () => {
      if (!bookingId || !accessToken) return;
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/bookings/${bookingId}`, {
          headers: { 'Authorization': `Bearer ${accessToken}` }
        });
        const data = await res.json();
        if (data.success) {
          setBooking(data.data);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchBooking();
  }, [bookingId, accessToken]);

  if (loading) {
     return (
        <div className="flex justify-center items-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-600"></div>
        </div>
     );
  }

  if (!booking) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-black text-gray-900 mb-4">Booking not found</h1>
        <Link href="/">
          <Button variant="ghost">Back to Home</Button>
        </Link>
      </div>
    );
  }

  const isReservation = booking.bookingType === 'reservation';
  const isPaid = booking.status === 'confirmed';

  return (
    <div className="bg-gray-50/50 min-h-screen py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-2xl shadow-green-600/5 text-center border border-green-50 animate-in fade-in zoom-in duration-500">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce">
            <CheckCircle2 className="w-10 h-10 text-green-600" />
          </div>

          <h2 className="text-3xl font-black text-gray-900 mb-4 tracking-tight">
            {isPaid ? 'Payment Successful!' : 'Reservation Successful!'}
          </h2>
          <p className="text-gray-500 font-bold text-sm max-w-sm mx-auto mb-10 leading-relaxed uppercase tracking-widest text-[10px]">
            {isPaid 
              ? 'Your machine has been booked successfully.' 
              : 'Complete payment within 6 hours to confirm your booking.'}
          </p>

          <div className="grid md:grid-cols-2 gap-6 text-left mb-10">
            <div className="bg-gray-50/50 p-6 rounded-[2rem] border border-gray-100/50">
              <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Booking Summary</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-400 font-bold uppercase tracking-tighter">Machine</span>
                  <span className="font-black text-gray-900 truncate max-w-[150px]">{booking.machine.machineName}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-400 font-bold uppercase tracking-tighter">Dates</span>
                  <span className="font-black text-gray-900">{new Date(booking.startDate).toLocaleDateString()} - {new Date(booking.endDate).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-400 font-bold uppercase tracking-tighter">Quantity</span>
                  <span className="font-black text-gray-900">{booking.quantity} Unit(s)</span>
                </div>
              </div>
            </div>

            <div className="bg-gray-50/50 p-6 rounded-[2rem] border border-gray-100/50">
              <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Transaction Info</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-400 font-bold uppercase tracking-tighter">Total Price</span>
                  <span className="font-black text-green-600">₹{booking.totalPrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-400 font-bold uppercase tracking-tighter">Status</span>
                  <Badge variant="outline" className={`text-[9px] font-black uppercase px-2 py-0 ${isPaid ? 'text-green-600 border-green-200 bg-green-50' : 'text-amber-600 border-amber-200 bg-amber-50'}`}>
                    {isPaid ? 'PAID' : 'PENDING'}
                  </Badge>
                </div>
                {!isPaid && booking.holdExpiresAt && (
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-gray-400 font-bold uppercase tracking-tighter">Expires In</span>
                    <span className="font-black text-rose-500 uppercase tracking-tighter">{new Date(booking.holdExpiresAt).toLocaleTimeString()}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3 max-w-md mx-auto">
            {!isPaid ? (
               <Button 
                onClick={() => router.push('/myorders')}
                className="rounded-2xl h-14 w-full bg-green-600 text-white font-black uppercase text-xs tracking-widest hover:bg-green-700 transition-all shadow-xl shadow-green-600/20"
               >
                 <CreditCard className="w-4 h-4 mr-2" />
                 Pay Now from My Orders
               </Button>
            ) : (
                <Button 
                    onClick={() => router.push('/myorders')}
                    className="rounded-2xl h-14 w-full bg-slate-900 text-white font-black uppercase text-xs tracking-widest hover:bg-black transition-all shadow-xl shadow-slate-200"
                >
                    View My Orders
                </Button>
            )}
            
            <div className="grid grid-cols-2 gap-3">
              <Button 
                variant="outline"
                onClick={() => alert('Invoice download starting...')}
                className="rounded-2xl h-12 font-black uppercase text-[10px] tracking-widest border-2 border-slate-100 hover:bg-slate-50 transition-all text-slate-600"
              >
                Download Invoice
              </Button>
              <Button 
                variant="outline"
                onClick={() => router.push('/')}
                className="rounded-2xl h-12 font-black uppercase text-[10px] tracking-widest border-2 border-slate-100 hover:bg-slate-50 transition-all text-slate-600"
              >
                Back to Home
              </Button>
            </div>
          </div>

          <p className="mt-12 text-[9px] font-black text-gray-300 uppercase tracking-[0.2em] max-w-xs mx-auto text-center">
            A confirmation has been sent to your registered email address.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SuccessContent />
    </Suspense>
  );
}
