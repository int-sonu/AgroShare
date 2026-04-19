'use client';

import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Package,
  ChevronRight,
  Download,
  CreditCard,
  Search
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { PaymentModal } from '@/components/payment/PaymentModal';
import { StripeProvider } from '@/components/payment/StripeProvider';

type Booking = {
  _id: string;
  machine: {
    machineName: string;
    brandModel?: string;
    images: (string | { url: string; secure_url: string })[];
    pricing: { rentalPrice: number; securityDeposit: number };
  };
  startDate: string;
  endDate: string;
  quantity: number;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  bookingType: 'reservation' | 'rental';
  holdExpiresAt?: string;
  deliveryMethod: string;
  deliveryAddress?: string;
  stripePaymentIntentId?: string;
};

export default function MyOrdersPage() {
  const { accessToken } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [paymentData, setPaymentData] = useState<{ clientSecret: string; bookingId: string; amount: number } | null>(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  
  // Search and Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('All');

  const tabs = ['All', 'Reserved', 'Active', 'Completed', 'Cancelled'];

  const fetchBookings = useCallback(async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/bookings/customer`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });
      const data = await res.json();
      if (data.success) {
        setBookings(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch bookings:', error);
    } finally {
      setLoading(false);
    }
  }, [accessToken]);

  useEffect(() => {
    if (accessToken) fetchBookings();
  }, [accessToken, fetchBookings]);

  const handleCancelBooking = async (bookingId: string) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;
    
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/bookings/${bookingId}/cancel`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify({ status: 'cancelled' })
      });
      const data = await res.json();
      if (data.success) {
        fetchBookings();
      } else {
        alert(data.message || 'Failed to cancel');
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handlePayNow = async (bookingId: string, amount: number) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/payments/create-payment-intent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify({ bookingId })
      });
      const data = await res.json();
      if (data.clientSecret) {
        setPaymentData({ clientSecret: data.clientSecret, bookingId, amount });
        setIsPaymentModalOpen(true);
      } else {
        alert(data.message || 'Failed to initiate payment');
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handlePaymentSuccess = async (intentId: string) => {
    try {
      setIsPaymentModalOpen(false);
      
      const bId = paymentData?.bookingId;
      if (bId) {
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/payments/confirm-payment`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
          },
          body: JSON.stringify({ 
            bookingId: bId,
            paymentIntentId: intentId 
          })
        });
      }
      fetchBookings();
    } catch (error) {
      console.error('Failed to confirm payment:', error);
      fetchBookings();
    }
  };

  const filteredBookings = bookings.filter(booking => {
    // Tab Filter
    const matchesTab = 
      activeTab === 'All' ||
      (activeTab === 'Reserved' && booking.bookingType === 'reservation' && booking.status === 'pending') ||
      (activeTab === 'Active' && (booking.status === 'confirmed' || (booking.bookingType === 'rental' && booking.status === 'pending'))) ||
      (activeTab === 'Completed' && booking.status === 'completed') ||
      (activeTab === 'Cancelled' && booking.status === 'cancelled');

    // Search Filter
    const matchesSearch = 
      booking.machine.machineName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking._id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.machine.brandModel?.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesTab && matchesSearch;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50/50 min-h-screen pb-20">
      <div className="max-w-6xl mx-auto px-4 pt-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div>
            <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-2">My Orders</h1>
            <p className="text-gray-500 font-bold text-xs uppercase tracking-[0.2em]">Manage your machine bookings and reservations</p>
          </div>
          <div className="flex items-center gap-4 bg-white p-2 rounded-[1.5rem] border border-gray-100 shadow-sm">
             <div className="px-6 py-2 border-r border-gray-100 flex flex-col items-center">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Active</span>
                <span className="text-lg font-black text-green-600">{bookings.filter(b => b.status === 'confirmed' || b.status === 'pending').length}</span>
             </div>
             <div className="px-6 py-2 flex flex-col items-center">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Completed</span>
                <span className="text-lg font-black text-gray-900">{bookings.filter(b => b.status === 'completed').length}</span>
             </div>
          </div>
        </div>

        {/* Search and Tabs Row */}
        <div className="bg-white rounded-[2rem] p-4 mb-10 border border-gray-100 shadow-xl shadow-gray-200/10">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            {/* Tabs */}
            <div className="flex items-center gap-1 overflow-x-auto pb-2 lg:pb-0 scrollbar-hide">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-wider transition-all duration-300 whitespace-nowrap ${
                    activeTab === tab 
                      ? 'bg-green-600 text-white shadow-lg shadow-green-600/20 translate-y-[-1px]' 
                      : 'text-gray-400 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Search Bar */}
            <div className="relative group w-full lg:w-96">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-green-600 transition-colors" />
              <input 
                type="text"
                placeholder="Search by Machine Name, Model or ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-6 py-3.5 bg-gray-50/50 border-2 border-transparent rounded-2xl text-xs font-bold text-gray-900 placeholder:text-gray-400 focus:outline-none focus:bg-white focus:border-green-600/20 transition-all shadow-inner"
              />
            </div>
          </div>
        </div>

        {filteredBookings.length === 0 ? (
          <div className="bg-white rounded-[2.5rem] p-20 text-center border border-gray-100 shadow-xl shadow-gray-200/20">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Package className="w-10 h-10 text-gray-300" />
            </div>
            <h3 className="text-xl font-black text-gray-900 mb-2">
              {searchQuery || activeTab !== 'All' ? 'No matching orders found' : 'No bookings yet'}
            </h3>
            <p className="text-gray-400 font-bold text-[10px] uppercase tracking-widest mb-8">
              {searchQuery || activeTab !== 'All' ? 'Try adjusting your search or filters' : 'Start exploring machines to book your first equipment'}
            </p>
            {!searchQuery && activeTab === 'All' && (
              <Link href="/category">
                <Button className="bg-green-600 hover:bg-green-700 text-white rounded-2xl px-8 h-12 font-black uppercase text-xs tracking-widest transition-all">
                  Browse Machines
                </Button>
              </Link>
            )}
            {(searchQuery || activeTab !== 'All') && (
              <Button 
                onClick={() => { setSearchQuery(''); setActiveTab('All'); }}
                variant="outline" 
                className="rounded-2xl px-8 h-12 font-black uppercase text-xs tracking-widest border-2 border-slate-100"
              >
                Clear All Filters
              </Button>
            )}
          </div>
        ) : (
          <div className="grid gap-6">
            {filteredBookings.map((booking) => (
              <BookingCard 
                key={booking._id} 
                booking={booking} 
                onCancel={handleCancelBooking}
                onPay={() => handlePayNow(booking._id, booking.totalPrice)}
              />
            ))}
          </div>
        )}
      </div>

      {paymentData && (
        <StripeProvider>
          <PaymentModal
            isOpen={isPaymentModalOpen}
            onClose={() => setIsPaymentModalOpen(false)}
            clientSecret={paymentData.clientSecret}
            amount={paymentData.amount}
            onSuccess={handlePaymentSuccess}
          />
        </StripeProvider>
      )}
    </div>
  );
}

function BookingCard({ booking, onCancel, onPay }: { booking: Booking; onCancel: (id: string) => void; onPay: (id: string) => void }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const isPending = booking.status === 'pending';
  
  const mainImage = booking.machine.images?.[0]
    ? typeof booking.machine.images[0] === 'string' 
      ? booking.machine.images[0] 
      : booking.machine.images[0].secure_url || booking.machine.images[0].url || '/placeholder-machine.png'
    : '/placeholder-machine.png';

  const durationDays = Math.ceil((new Date(booking.endDate).getTime() - new Date(booking.startDate).getTime()) / (1000 * 60 * 60 * 24)) || 1;

  return (
    <div className="bg-white rounded-[2rem] overflow-hidden border border-gray-100 shadow-xl shadow-gray-200/20 hover:shadow-gray-200/40 transition-all duration-500 group">
      <div className="p-6 md:p-8 flex flex-col lg:flex-row gap-8">
        <div className="relative w-full lg:w-48 h-48 lg:h-32 rounded-2xl overflow-hidden shrink-0 shadow-inner bg-gray-50">
          <Image 
            src={mainImage} 
            alt={booking.machine.machineName} 
            fill 
            className="object-cover group-hover:scale-110 transition-transform duration-700"
          />
          <div className="absolute top-2 left-2">
             <Badge className={`uppercase text-[9px] font-black px-2 py-0.5 rounded-lg border-2 shadow-sm ${
               booking.status === 'confirmed' ? 'bg-green-50 text-green-600 border-green-100' :
               booking.status === 'pending' ? 'bg-amber-50 text-amber-600 border-amber-100' :
               'bg-rose-50 text-rose-500 border-rose-100'
             }`}>
               {booking.status}
             </Badge>
          </div>
        </div>

        <div className="flex-1">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                 <span className="text-[9px] font-black text-green-600 uppercase tracking-widest bg-green-50 px-2 py-0.5 rounded-md">{booking.bookingType}</span>
                 <ChevronRight className="w-3 h-3 text-gray-300" />
                 <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">ID: {booking._id.slice(-8)}</span>
              </div>
              <h3 className="text-xl md:text-2xl font-black text-gray-900 tracking-tighter leading-tight">{booking.machine.machineName}</h3>
              {booking.machine.brandModel && (
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mt-1">{booking.machine.brandModel}</p>
              )}
            </div>
            <div className="text-right">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Total Amount</p>
              <p className="text-2xl font-black text-green-600 tracking-tighter">₹{booking.totalPrice.toLocaleString()}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8 py-6 border-y border-gray-50/80">
            <DetailItem 
              icon={<Calendar className="w-3.5 h-3.5" />} 
              label="Schedule" 
              value={`${new Date(booking.startDate).toLocaleDateString()} - ${new Date(booking.endDate).toLocaleDateString()}`} 
            />
            <DetailItem 
              icon={<Package className="w-3.5 h-3.5" />} 
              label="Quantity" 
              value={`${booking.quantity} Unit(s)`} 
            />
            <DetailItem 
              icon={<MapPin className="w-3.5 h-3.5" />} 
              label="PickUp" 
              value={booking.deliveryMethod} 
            />
            {isPending && booking.holdExpiresAt && (
               <DetailItem 
                 icon={<Clock className="w-3.5 h-3.5 text-amber-500" />} 
                 label="Guard Time" 
                 value={new Date(booking.holdExpiresAt).toLocaleTimeString()}
                 valueClass="text-amber-600 font-black"
               />
            )}
            {booking.status === 'confirmed' && (
              <DetailItem 
                icon={<CheckCircle2 className="w-3.5 h-3.5 text-green-500" />} 
                label="Confirmation" 
                value="Secured"
                valueClass="text-green-600 font-black"
              />
            )}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap gap-2">
              {isPending && (
                 <>
                   <Button 
                    onClick={() => onPay(booking._id)}
                    className="bg-green-600 hover:bg-green-700 text-white rounded-xl px-6 h-12 font-black uppercase text-[10px] tracking-widest shadow-xl shadow-green-600/20 transition-all hover:-translate-y-0.5"
                   >
                     <CreditCard className="w-4 h-4 mr-2" />
                     Pay Total
                   </Button>
                   <Button 
                    variant="outline"
                    onClick={() => onCancel(booking._id)}
                    className="rounded-xl px-6 h-12 font-black uppercase text-[10px] tracking-widest border-2 border-rose-100 text-rose-500 hover:bg-rose-50 transition-all"
                   >
                     <XCircle className="w-4 h-4 mr-2" />
                     Cancel
                   </Button>
                 </>
              )}
              {booking.status === 'confirmed' && (
                 <Button 
                  variant="outline"
                  onClick={() => alert('Manifest generating...')}
                  className="rounded-xl px-6 h-12 font-black uppercase text-[10px] tracking-widest border-2 border-slate-100 hover:bg-slate-50 transition-all text-slate-700 shadow-sm"
                 >
                   <Download className="w-4 h-4 mr-2" />
                   E-Invoice
                 </Button>
              )}
            </div>
            
            <button 
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] flex items-center gap-2 hover:text-green-600 transition-colors py-2"
            >
              {isExpanded ? 'Hide Details' : 'View Full Summary'}
              <ChevronRight className={`w-3 h-3 transition-transform duration-300 ${isExpanded ? 'rotate-90' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {isExpanded && (
        <div className="bg-gray-50/50 border-t border-gray-100 p-8 animate-in slide-in-from-top-4 duration-500">
          <div className="grid md:grid-cols-2 gap-10">
            <div>
              <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6">Execution Details</h4>
              <div className="space-y-4">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-400 font-bold">Rental Duration</span>
                  <span className="font-black text-gray-900">{durationDays} Day(s)</span>
                </div>
                {booking.deliveryAddress && (
                  <div className="pt-4 border-t border-gray-100">
                    <span className="text-[9px] font-bold text-gray-400 uppercase tracking-[0.1em] block mb-2">Delivery Coordinates</span>
                    <p className="text-[11px] font-black text-gray-900 leading-relaxed max-w-xs">{booking.deliveryAddress}</p>
                  </div>
                )}
                {booking.stripePaymentIntentId && (
                  <div className="pt-4 border-t border-gray-100">
                    <span className="text-[9px] font-bold text-gray-400 uppercase tracking-[0.1em] block mb-2">Payment Method</span>
                    <p className="text-[11px] font-mono text-slate-500 truncate" title={booking.stripePaymentIntentId}>{booking.stripePaymentIntentId}</p>
                  </div>
                )}
              </div>
            </div>

            <div>
              <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6">Pricing Summary</h4>
              <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm space-y-4">
                <div className="flex justify-between items-center text-[11px]">
                  <span className="text-gray-400 font-bold uppercase tracking-tighter">Gross Rental</span>
                  <span className="font-black text-gray-900">₹{(booking.machine.pricing.rentalPrice * durationDays * booking.quantity).toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center text-[11px]">
                  <span className="text-gray-400 font-bold uppercase tracking-tighter">Security Deposit</span>
                  <span className="font-black text-gray-900">₹{booking.machine.pricing.securityDeposit.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center text-[11px]">
                  <span className="text-gray-400 font-bold uppercase tracking-tighter">PickUp Fee</span>
                  <span className="font-black text-gray-900">{booking.deliveryMethod === 'delivery' ? '₹200 (Estimated)' : '₹0 (Self)'}</span>
                </div>
                <div className="pt-4 border-t-2 border-dashed border-gray-100 flex justify-between items-center text-sm">
                  <span className="text-gray-900 font-black uppercase tracking-widest text-[10px]">Total Investment</span>
                  <span className="text-xl font-black text-green-600">₹{booking.totalPrice.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function DetailItem({ icon, label, value, valueClass = "text-gray-900 font-bold" }: { icon: React.ReactNode; label: string; value: string; valueClass?: string }) {
  return (
    <div>
      <div className="flex items-center gap-1.5 mb-1 opacity-60">
        <span className="text-gray-400">{icon}</span>
        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{label}</span>
      </div>
      <p className={`text-[11px] uppercase tracking-tight ${valueClass}`}>{value}</p>
    </div>
  );
}
