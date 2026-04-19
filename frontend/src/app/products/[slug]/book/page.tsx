'use client';

import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import {
  Calendar as CalendarIcon,
  CreditCard,
  MapPin,
  Truck,
  ShieldCheck,
  Fuel,
  Info,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/context/AuthContext';
import { StripeProvider } from '@/components/payment/StripeProvider';
import { PaymentModal } from '@/components/payment/PaymentModal';

type MachineData = {
  _id?: string;
  machineName?: string;
  brandModel?: string;
  yearOfManufacture?: string;
  category?: { name?: string };
  location?: { district?: string; state?: string; village?: string };
  pricing?: {
    rentalPrice?: number;
    priceType?: string;
    minimumRentalDuration?: number;
    securityDeposit?: number;
  };
  condition?: string;
  machineCapacityHP?: string;
  fuelType?: string;
  transport?: { transportAvailable?: boolean; transportCost?: number };
  description?: string;
  images?: (string | { url?: string; secure_url?: string })[];
  stock?: number;
  quantity?: number;
};

import { Suspense } from 'react';

function BookingContent() {
  const { slug } = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { accessToken } = useAuth();

  const initialQty = parseInt(searchParams.get('qty') || '1', 10);

  const [machine, setMachine] = useState<MachineData | null>(null);
  const [loading, setLoading] = useState(true);

  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [quantity, setQuantity] = useState(initialQty);
  const [bookingType, setBookingType] = useState<'reservation' | 'rental' | null>(null);
  const [step, setStep] = useState(1);
  const [deliveryMethod, setDeliveryMethod] = useState<'pickup' | 'delivery'>('pickup');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [village, setVillage] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [paymentData, setPaymentData] = useState<{ clientSecret: string; bookingId: string; amount: number } | null>(null);
  const [duration, setDuration] = useState(0);
  const [currentBookingId, setCurrentBookingId] = useState<string | null>(null);
  const [availabilityData, setAvailabilityData] = useState<{
    availableQty: number;
    isAvailable: boolean;
    nextAvailableDate: string | null;
  } | null>(null);
  const [checkingAvailability, setCheckingAvailability] = useState(false);

  const isReservationDisabled = quantity > 2;

  useEffect(() => {
    const fetchMachine = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/machines/slug/${slug}`
        );
        const data = await res.json();
        setMachine(data.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    if (slug) fetchMachine();
  }, [slug]);

  useEffect(() => {
    if (startDate && endDate && machine?._id) {
      if (!machine.pricing?.priceType || machine.pricing.priceType.toLowerCase().includes('day')) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        const diffTime = Math.abs(end.getTime() - start.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;
        setDuration(diffDays);
      } else if (duration === 0) {
        setDuration(machine.pricing?.minimumRentalDuration || 1);
      }

      // Check availability
      const fetchAvailability = async () => {
        setCheckingAvailability(true);
        try {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/machines/${machine._id}/availability?startDate=${startDate}&endDate=${endDate}&quantity=${quantity}`
          );
          const data = await res.json();
          if (data.success) {
            setAvailabilityData(data.data);
          }
        } catch (error) {
          console.error("Availability check failed:", error);
        } finally {
          setCheckingAvailability(false);
        }
      };
      
      fetchAvailability();
    }
  }, [startDate, endDate, quantity, machine?._id, duration, machine?.pricing?.minimumRentalDuration, machine?.pricing?.priceType]);

  if (loading || !machine) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-600"></div>
      </div>
    );
  }

  const machineData = machine!;
  const mainImage = machineData.images?.[0]
    ? typeof machineData.images[0] === 'string' 
      ? machineData.images[0] 
      : machineData.images[0].secure_url || machineData.images[0].url || '/placeholder-image.png'
    : '/placeholder-image.png';

  const handleBooking = async () => {
    if (!startDate || !endDate) {
      alert("Please select dates");
      return;
    }
    if (!bookingType) {
      alert("Please select a booking option");
      return;
    }
    if (deliveryMethod === 'delivery' && !deliveryAddress.trim()) {
      alert("Please provide a delivery address");
      return;
    }

    try {
      setLoading(true);
    
      const fullAddress = deliveryMethod === 'delivery' 
        ? `${village}, ${deliveryAddress}, PIN: ${postalCode}, Ph: ${phoneNumber}`
        : '';

      const res = await fetch(
       `${process.env.NEXT_PUBLIC_API_URL}/bookings`,
       {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify({
          machineId: machineData._id,
          startDate,
          endDate,
          quantity,
          duration,
          bookingType,
          deliveryMethod,
          deliveryAddress: fullAddress
        })
      });

      const result = await res.json();

      if (!result.success) {
        alert(result.message || "Failed to create booking");
        return;
      }

      const bookingId = result.data._id;
      setCurrentBookingId(bookingId);

      if (bookingType === 'rental') {
        const paymentRes = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/payments/create-payment-intent`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${accessToken}`
            },
            body: JSON.stringify({ bookingId })
          }
        );
        const paymentData = await paymentRes.json();
        
        if (paymentData.clientSecret) {
          setPaymentData({
            clientSecret: paymentData.clientSecret,
            bookingId,
            amount: result.data.totalPrice
          });
          setIsPaymentModalOpen(true);
        } else {
          alert(`Failed to initiate payment: ${paymentData.message || 'Please try again from your orders.'}`);
        }
      } else {
        router.push(`/booking-success?id=${bookingId}`);
      }
    } catch (error) {
      console.error("Booking Error:", error);
      const message = error instanceof Error ? error.message : "An error occurred while processing your booking";
      alert(message);
    } finally {
      setLoading(false);
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
        router.push(`/booking-success?id=${bId}`);
      }
    } catch (error) {
      console.error("Payment Confirmation Error:", error);
      if (paymentData?.bookingId) {
        router.push(`/booking-success?id=${paymentData.bookingId}`);
      } else {
        router.push('/myorders');
      }
    }
  };

  const handleNext = () => {
    if (step === 1) {
      if (!startDate || !endDate) return alert('Select dates');
      if (deliveryMethod === 'delivery') setStep(2);
      else setStep(3);
    } else if (step === 2) {
      if (!village || !deliveryAddress || !postalCode || !phoneNumber) return alert('Fill all address fields');
      setStep(3);
    } else if (step === 3) {
      if (!bookingType) return alert('Select a booking option');
      setStep(4);
    }
  };

  const handleBack = () => {
    if (step === 3 && deliveryMethod === 'pickup') setStep(1);
    else setStep(step - 1);
  };

  const renderStep1 = () => (
    <div className="grid md:grid-cols-2 gap-6 bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
      <div className="flex flex-col gap-6">
        <div className="relative aspect-[4/3] w-full rounded-xl overflow-hidden bg-gray-50 border border-gray-100">
          <Image
            src={mainImage}
            alt={machineData.machineName || 'Machine'}
            fill
            className="object-contain p-2"
            priority
          />
        </div>

        <div className="space-y-4">
          <div>
            <h2 className="text-xl font-black text-gray-900">{machineData.machineName}</h2>
            <div className="flex items-center gap-1.5 text-gray-500 text-xs font-medium mt-1">
              <MapPin className="w-3.5 h-3.5 text-rose-500" />
              <span>
                {machineData.location?.district}, {machineData.location?.state}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-green-50 p-3 rounded-xl border border-green-100">
              <p className="text-[10px] font-bold text-green-700/60 uppercase tracking-widest mb-1">
                Daily Price
              </p>
              <div className="flex items-baseline gap-1">
                <span className="text-lg font-black text-green-700">
                  ₹{machineData.pricing?.rentalPrice?.toLocaleString()}
                </span>
                <span className="text-[10px] font-bold text-green-600/80">
                  / {machineData.pricing?.priceType}
                </span>
              </div>
            </div>

            <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 flex flex-col justify-center">
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">
                Security Deposit
              </p>
              <p className="text-sm font-black text-gray-700">
                {machineData.pricing?.securityDeposit ? `₹${machineData.pricing.securityDeposit.toLocaleString()}` : 'None'}
              </p>
            </div>
          </div>

          <div className="space-y-2 pt-2 border-t border-gray-100">
            <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wider mb-2">Machine Details</h3>
            <div className="grid grid-cols-2 gap-y-2 text-sm text-gray-600">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-green-600" />
                <span className="font-medium text-xs">Condition: {machineData.condition || 'Good'}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Fuel className="w-4 h-4 text-green-600" />
                <span className="font-medium text-xs">Fuel: {machineData.fuelType || 'Diesel'}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-green-600" />
                <span className="font-medium text-xs">Transport: {machineData.transport?.transportAvailable ? 'Yes' : 'No'}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Info className="w-4 h-4 text-green-600" />
                <span className="font-medium text-xs">Power: {machineData.machineCapacityHP || 'N/A'} HP</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-5">
        <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
          <div className="flex items-center gap-2 mb-4">
            <CalendarIcon className="w-5 h-5 text-green-600" />
            <h3 className="font-black text-gray-800">Select Booking Dates</h3>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold text-gray-600 uppercase tracking-wider">Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="h-10 px-3 rounded-lg border border-gray-200 text-sm font-medium focus:ring-2 focus:ring-green-600 focus:outline-none"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold text-gray-600 uppercase tracking-wider">End Date</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                min={startDate || new Date().toISOString().split('T')[0]}
                className="h-10 px-3 rounded-lg border border-gray-200 text-sm font-medium focus:ring-2 focus:ring-green-600 focus:outline-none"
              />
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
          <div className="flex justify-between items-center">
            <h3 className="font-black text-gray-800">
              {machineData?.pricing?.priceType === 'Per Hour' ? 'Total Hours' : 
                machineData?.pricing?.priceType === 'Per Acre' ? 'Total Acres' : 'Rental Duration (Days)'}
            </h3>
            <div className="flex items-center gap-3 bg-gray-50 px-2 py-1 rounded-lg border border-gray-200">
              <button
                onClick={() => setDuration(Math.max(machineData?.pricing?.minimumRentalDuration || 1, duration - 1))}
                className="w-6 h-6 flex items-center justify-center font-bold text-gray-600 hover:text-green-600"
              >
                -
              </button>
              <span className="w-8 text-center font-black text-sm">{duration}</span>
              <button
                onClick={() => setDuration(duration + 1)}
                className="w-6 h-6 flex items-center justify-center font-bold text-gray-600 hover:text-green-600"
              >
                +
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-black text-gray-800">Booking Quantity</h3>
            <div className="flex items-center gap-3 bg-gray-50 px-2 py-1 rounded-lg border border-gray-200">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-6 h-6 flex items-center justify-center font-bold text-gray-600 hover:text-green-600"
              >
                -
              </button>
              <span className="w-4 text-center font-black text-sm">{quantity}</span>
              <button
                onClick={() => setQuantity(Math.min(machineData.quantity || 10, quantity + 1))}
                className="w-6 h-6 flex items-center justify-center font-bold text-gray-600 hover:text-green-600"
              >
                +
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="font-black text-gray-800 mb-2">Delivery Method</h3>

          <button
            onClick={() => setDeliveryMethod('pickup')}
            className={`w-full flex items-center p-3 rounded-xl border-2 transition-all text-left ${
              deliveryMethod === 'pickup'
                ? 'border-green-600 bg-green-50/50'
                : 'border-gray-100 bg-white hover:border-green-200 hover:bg-gray-50'
            }`}
          >
            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mr-3 ${
              deliveryMethod === 'pickup' ? 'border-green-600' : 'border-gray-300'
            }`}>
              {deliveryMethod === 'pickup' && <div className="w-2.5 h-2.5 rounded-full bg-green-600" />}
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-sm text-gray-900">Self Pickup (Free)</h4>
            </div>
            <CheckCircle2 className={`w-5 h-5 ${deliveryMethod === 'pickup' ? 'text-green-600' : 'opacity-0'}`} />
          </button>

          <button
            onClick={() => machineData.transport?.transportAvailable && setDeliveryMethod('delivery')}
            disabled={!machineData.transport?.transportAvailable}
            className={`w-full flex items-center p-3 rounded-xl border-2 transition-all text-left ${
              deliveryMethod === 'delivery'
                ? 'border-green-600 bg-green-50/50'
                : !machineData.transport?.transportAvailable
                ? 'border-gray-100 bg-gray-50 opacity-60 cursor-not-allowed'
                : 'border-gray-100 bg-white hover:border-green-200 hover:bg-gray-50'
            }`}
          >
            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mr-3 ${
              deliveryMethod === 'delivery' ? 'border-green-600' : 'border-gray-300'
            }`}>
              {deliveryMethod === 'delivery' && <div className="w-2.5 h-2.5 rounded-full bg-green-600" />}
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-sm text-gray-900">Home Delivery (₹{machineData.transport?.transportCost || 200})</h4>
            </div>
            <Truck className={`w-5 h-5 ${deliveryMethod === 'delivery' ? 'text-green-600' : 'text-gray-400 opacity-50'}`} />
          </button>
        </div>

        {/* Availability Status */}
        {startDate && endDate && availabilityData && (
          <div className={`p-4 rounded-xl border flex flex-col gap-2 transition-all duration-300 ${
            availabilityData.isAvailable 
              ? 'bg-green-50/50 border-green-100 text-green-700' 
              : availabilityData.availableQty > 0 
                ? 'bg-amber-50 border-amber-100 text-amber-700'
                : 'bg-rose-50 border-rose-100 text-rose-700'
          }`}>
            <div className="flex items-center gap-2">
              {availabilityData.isAvailable ? (
                <CheckCircle2 className="w-4 h-4" />
              ) : (
                <AlertCircle className="w-4 h-4" />
              )}
              <h4 className="font-black text-xs uppercase tracking-wider">
                {availabilityData.isAvailable 
                  ? 'Equipment Available' 
                  : availabilityData.availableQty > 0 
                    ? `Limited Stock: ${availabilityData.availableQty} available`
                    : 'Fully Booked for these dates'}
              </h4>
            </div>
            
            {!availabilityData.isAvailable && availabilityData.nextAvailableDate && (
              <div className="mt-2 pt-2 border-t border-current/10">
                <p className="text-[10px] font-bold opacity-70 mb-2 font-black uppercase tracking-widest">Suggested Availability:</p>
                <div className="flex items-center justify-between gap-3">
                   <div className="flex flex-col">
                      <span className="text-[9px] font-black uppercase opacity-60">Starts From</span>
                      <span className="text-sm font-black tracking-tight">{new Date(availabilityData.nextAvailableDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                   </div>
                   <Button 
                    variant="outline" 
                    size="sm"
                    className="h-8 border-current bg-transparent hover:bg-current hover:text-white font-black text-[10px] uppercase rounded-lg transition-all"
                    onClick={() => {
                      const newStart = new Date(availabilityData.nextAvailableDate!);
                      const newEnd = new Date(newStart.getTime() + (duration * 24 * 60 * 60 * 1000));
                      setStartDate(newStart.toISOString().split('T')[0]);
                      setEndDate(newEnd.toISOString().split('T')[0]);
                    }}
                   >
                     Apply
                   </Button>
                </div>
              </div>
            )}
          </div>
        )}

        <Button
          onClick={handleNext}
          disabled={checkingAvailability || (availabilityData && !availabilityData.isAvailable) || (!startDate || !endDate)}
          className={`w-full h-12 mt-4 rounded-xl font-black text-sm shadow-lg transition-all active:scale-95 ${
            (availabilityData && !availabilityData.isAvailable) || (!startDate || !endDate)
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none' 
              : 'bg-green-600 hover:bg-green-700 text-white shadow-green-600/20'
          }`}
        >
          {checkingAvailability ? 'Checking...' : (!startDate || !endDate) ? 'Select Dates' : (availabilityData && !availabilityData.isAvailable) ? 'Unavailable' : 'Next Step'}
        </Button>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100 max-w-2xl mx-auto">
      <h2 className="text-2xl font-black text-gray-900 mb-6">SHIPPING LOGISTICS</h2>
      <div className="space-y-6">
        <div>
          <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2 block">Detailed Address</label>
          <textarea
            value={deliveryAddress}
            onChange={(e) => setDeliveryAddress(e.target.value)}
            className="w-full p-4 rounded-2xl bg-blue-50/30 border border-blue-100 text-sm min-h-[100px] focus:ring-2 focus:ring-green-500 focus:outline-none"
            placeholder="House Name, Street, etc."
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2 block">Village / Urban Center</label>
            <input
              type="text"
              value={village}
              onChange={(e) => setVillage(e.target.value)}
              className="w-full p-4 rounded-2xl bg-blue-50/30 border border-blue-100 text-sm focus:ring-2 focus:ring-green-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2 block">Postal Address Code</label>
            <input
              type="text"
              value={postalCode}
              onChange={(e) => setPostalCode(e.target.value)}
              className="w-full p-4 rounded-2xl bg-blue-50/30 border border-blue-100 text-sm focus:ring-2 focus:ring-green-500 focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2 block">Communication Channel (Phone)</label>
          <input
            type="text"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="w-full p-4 rounded-2xl bg-blue-50/30 border border-blue-100 text-sm focus:ring-2 focus:ring-green-500 focus:outline-none"
            placeholder="Mobile Number"
          />
        </div>

        <div className="grid grid-cols-2 gap-4 mt-8">
          <Button variant="outline" onClick={handleBack} className="rounded-full h-12 font-bold">Back</Button>
          <Button onClick={handleNext} className="rounded-full h-12 bg-black text-white font-bold hover:bg-gray-800">SUBMIT →</Button>
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100 max-w-xl mx-auto">
      <h2 className="text-xl font-black text-gray-900 mb-6">Select Option</h2>
      <div className="space-y-4">
        <button
          onClick={() => !isReservationDisabled && setBookingType('reservation')}
          disabled={isReservationDisabled}
          className={`w-full flex items-center p-5 rounded-2xl border-2 transition-all text-left ${
            bookingType === 'reservation' ? 'border-green-600 bg-green-50/30' : 'border-gray-100 hover:border-green-200'
          }`}
        >
          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mr-4 ${
            bookingType === 'reservation' ? 'border-green-600' : 'border-gray-300'
          }`}>
            {bookingType === 'reservation' && <div className="w-3 h-3 rounded-full bg-green-600" />}
          </div>
          <div className="flex-1">
            <h4 className="font-bold text-gray-900">Reservation of Machine</h4>
            <p className="text-xs text-gray-500">Secure your machineData without immediate payment</p>
          </div>
        </button>

        <button
          onClick={() => setBookingType('rental')}
          className={`w-full flex items-center p-5 rounded-2xl border-2 transition-all text-left ${
            bookingType === 'rental' ? 'border-green-600 bg-green-50/30' : 'border-gray-100 hover:border-green-200'
          }`}
        >
          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mr-4 ${
            bookingType === 'rental' ? 'border-green-600' : 'border-gray-300'
          }`}>
            {bookingType === 'rental' && <div className="w-3 h-3 rounded-full bg-green-600" />}
          </div>
          <div className="flex-1">
            <h4 className="font-bold text-gray-900">Rental Pay Option</h4>
            <p className="text-xs text-gray-500">Pay now to confirm your immediate rental</p>
          </div>
          <CreditCard className="w-6 h-6 text-green-600" />
        </button>

        <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 mt-6">
          <h3 className="text-xs font-black text-gray-500 uppercase tracking-widest mb-4">BOOKING SUMMARY</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between text-gray-600">
              <span>Rental (₹{machineData.pricing?.rentalPrice} × {duration} Units × {quantity} Qty)</span>
              <span className="font-bold text-gray-900">₹{(machineData.pricing?.rentalPrice || 0) * duration * quantity}</span>
            </div>
            {machineData.pricing?.securityDeposit && (
              <div className="flex justify-between text-orange-500">
                <span>Security Deposit (Refundable)</span>
                <span className="font-bold">₹{machineData.pricing.securityDeposit}</span>
              </div>
            )}
            <div className="pt-4 border-t border-gray-200 flex justify-between items-center">
              <span className="font-black text-gray-900 text-base">Total Amount</span>
              <span className="text-2xl font-black text-green-600">
                ₹{((machineData.pricing?.rentalPrice || 0) * duration * quantity) + (machineData.pricing?.securityDeposit || 0)}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-8">
          <Button variant="outline" onClick={handleBack} className="rounded-2xl h-14 font-bold">Back</Button>
          <Button onClick={handleNext} className="rounded-2xl h-14 bg-green-600 text-white font-bold hover:bg-green-700">Confirm Rental</Button>
        </div>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100 max-w-2xl mx-auto">
      <div className="flex items-center gap-2 mb-8" onClick={handleBack}>
        <button className="text-gray-400">←</button>
        <h2 className="text-2xl font-black text-gray-900 uppercase">Final Validation</h2>
      </div>

      <div className="grid grid-cols-2 gap-8">
        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-2 text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-2">
              <div className="w-1 h-1 bg-gray-400 rounded-full" /> Target Destination
            </div>
            <p className="text-sm font-bold text-gray-900 leading-relaxed">
              {deliveryMethod === 'delivery' ? `${village}, ${deliveryAddress}, ${postalCode}` : 'Self Pickup at Store'}
              <br />{phoneNumber}
            </p>
          </div>

          <div>
            <div className="flex items-center gap-2 text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-2">
              <div className="w-1 h-1 bg-gray-400 rounded-full" /> Settlement Mode
            </div>
            <p className="text-sm font-bold text-gray-900 uppercase">{bookingType === 'rental' ? 'Payment with Stripe' : 'Reservation Only'}</p>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-2 text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-2">
              <div className="w-1 h-1 bg-gray-400 rounded-full" /> Manifest Content
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold text-gray-900">
                <span>{machineData.machineName} × {quantity}</span>
                <span>₹{(machineData.pricing?.rentalPrice || 0) * duration * quantity}</span>
              </div>
              <div className="flex justify-between text-xs font-bold text-gray-500">
                <span>SUBTOTAL</span>
                <span>₹{(machineData.pricing?.rentalPrice || 0) * duration * quantity}</span>
              </div>
              <div className="flex justify-between text-xs font-bold text-gray-500">
                <span>SHIPPING</span>
                <span>{deliveryMethod === 'delivery' ? `₹${machine.transport?.transportCost || 200}` : 'Free (Standard)'}</span>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-xl flex justify-between items-center">
            <span className="text-xs font-black text-gray-900 uppercase">Investment Core</span>
            <span className="text-xl font-black text-gray-900">
              ₹{((machine.pricing?.rentalPrice || 0) * duration * quantity) + 
                (machine.pricing?.securityDeposit || 0) + 
                (deliveryMethod === 'delivery' ? (machine.transport?.transportCost || 200) : 0)}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-12 flex justify-center">
        <button
          onClick={handleBooking}
          disabled={loading}
          className="bg-black text-white w-24 h-8 rounded-full flex items-center justify-center gap-2 text-xs font-bold group"
        >
          {loading ? '...' : (
            <>
              <div className="w-1 h-1 bg-yellow-400 rounded-full" />
              CONFIRM
              <div className="w-1 h-1 bg-red-400 rounded-full" />
            </>
          )}
        </button>
      </div>
    </div>
  );

  const handleCancelReservation = async () => {
    if (!currentBookingId) return;
    if (!window.confirm('Are you sure you want to cancel this reservation?')) return;
    
    try {
      setLoading(true);
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/bookings/${currentBookingId}/cancel`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify({ status: 'cancelled' })
      });
      const data = await res.json();
      if (data.success) {
        alert('Reservation cancelled successfully');
        router.push('/');
      } else {
        alert(data.message || 'Failed to cancel reservation');
      }
    } catch (error) {
      console.error("Cancel Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePayNowFromReservation = async () => {
    if (!currentBookingId) return;
    try {
      setLoading(true);
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/payments/create-payment-intent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify({ bookingId: currentBookingId })
      });
      const data = await res.json();
      if (data.clientSecret) {
        setPaymentData({
          clientSecret: data.clientSecret,
          bookingId: currentBookingId,
          amount: 0 
        });
        setIsPaymentModalOpen(true);
      } else {
        alert(data.message || 'Failed to initiate payment');
      }
    } catch (error) {
      console.error("Pay Now Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const renderStep5 = () => (
    <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-2xl shadow-green-600/5 text-center border border-green-50 animate-in fade-in zoom-in duration-500">
      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce">
        <CheckCircle2 className="w-10 h-10 text-green-600" />
      </div>

      <h2 className="text-3xl font-black text-gray-900 mb-4 tracking-tight">
        {bookingType === 'rental' ? 'Payment Successful!' : 'Reservation Successful!'}
      </h2>
      <p className="text-gray-500 font-bold text-sm max-w-sm mx-auto mb-10 leading-relaxed uppercase tracking-widest text-[10px]">
        {bookingType === 'rental' 
          ? 'Your machine has been booked successfully.' 
          : 'Complete payment within 6 hours to confirm your booking.'}
      </p>

      <div className="grid md:grid-cols-2 gap-6 text-left mb-10">
        <div className="bg-gray-50/50 p-6 rounded-[2rem] border border-gray-100/50">
          <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Booking Summary</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center text-xs">
              <span className="text-gray-400 font-bold uppercase tracking-tighter">Dates</span>
              <span className="font-black text-gray-900">{startDate} - {endDate}</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-gray-400 font-bold uppercase tracking-tighter">Quantity</span>
              <span className="font-black text-gray-900">{quantity} Unit(s)</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-gray-400 font-bold uppercase tracking-tighter">Method</span>
              <span className="px-2 py-0.5 bg-slate-100 rounded text-[9px] font-black uppercase text-slate-600">{deliveryMethod}</span>
            </div>
          </div>
        </div>

        <div className="bg-gray-50/50 p-6 rounded-[2rem] border border-gray-100/50">
          <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Transaction Info</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center text-xs">
              <span className="text-gray-400 font-bold uppercase tracking-tighter">Total Price</span>
              <span className="font-black text-green-600">₹{(((machine.pricing?.rentalPrice || 0) * duration * quantity) + (machine.pricing?.securityDeposit || 0) + (deliveryMethod === 'delivery' ? (machine.transport?.transportCost || 200) : 0)).toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-gray-400 font-bold uppercase tracking-tighter">Status</span>
              <Badge variant="outline" className={`text-[9px] font-black uppercase px-2 py-0 ${bookingType === 'rental' ? 'text-green-600 border-green-200 bg-green-50' : 'text-amber-600 border-amber-200 bg-amber-50'}`}>
                {bookingType === 'rental' ? 'PAID' : 'PENDING'}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3 max-w-md mx-auto">
        {bookingType === 'rental' ? (
          <>
            <Button 
              onClick={() => router.push('/myorders')}
              className="rounded-2xl h-14 w-full bg-slate-900 text-white font-black uppercase text-xs tracking-widest hover:bg-black transition-all shadow-xl shadow-slate-200"
            >
              View My Orders
            </Button>
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
          </>
        ) : (
          <>
            <Button 
              onClick={handlePayNowFromReservation}
              className="rounded-2xl h-14 w-full bg-green-600 text-white font-black uppercase text-xs tracking-widest hover:bg-green-700 transition-all shadow-xl shadow-green-600/20"
            >
              Pay Now
            </Button>
            <div className="grid grid-cols-2 gap-3">
              <Button 
                variant="outline"
                onClick={handleCancelReservation}
                className="rounded-2xl h-12 font-black uppercase text-[10px] tracking-widest border-2 border-rose-100 text-rose-500 hover:bg-rose-50 transition-all"
              >
                Cancel Reservation
              </Button>
              <Button 
                variant="outline"
                onClick={() => router.push('/myorders')}
                className="rounded-2xl h-12 font-black uppercase text-[10px] tracking-widest border-2 border-slate-100 hover:bg-slate-50 transition-all text-slate-600"
              >
                View My Orders
              </Button>
            </div>
          </>
        )}
      </div>

      <p className="mt-12 text-[9px] font-black text-gray-300 uppercase tracking-[0.2em] max-w-xs mx-auto">
        A detailed confirmation has been sent to your registered email address.
      </p>
    </div>
  );

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-6 flex items-center justify-between">
          <div>
            {step < 5 && (
              <Button
                variant="ghost"
                onClick={() => step > 1 ? handleBack() : router.back()}
                className="text-gray-500 hover:text-green-600 hover:bg-green-50 px-2 h-8"
              >
                ← Back
              </Button>
            )}
            <h1 className="text-2xl font-black text-gray-900 mt-2">
              {step === 1 ? 'Request Booking' : 
               step === 2 ? 'Shipping' : 
               step === 3 ? 'Payment' : 
               step === 4 ? 'Final Step' : 'Confirmation'}
            </h1>
          </div>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].filter(s => s !== 2 || deliveryMethod === 'delivery').map((s) => (
              <div 
                key={s} 
                className={`h-1.5 w-8 rounded-full ${step === s ? 'bg-green-600' : 'bg-gray-200'} ${step > s ? 'bg-green-400' : ''}`}
              />
            ))}
          </div>
        </div>

        {step === 1 && renderStep1()}
        {step === 2 && renderStep2()}
        {step === 3 && renderStep3()}
        {step === 4 && renderStep4()}
        {step === 5 && renderStep5()}
      </div>

      {isPaymentModalOpen && paymentData && (
        <StripeProvider>
          <PaymentModal
            isOpen={isPaymentModalOpen}
            onClose={() => setIsPaymentModalOpen(false)}
            clientSecret={paymentData.clientSecret}
            bookingId={paymentData.bookingId}
            amount={paymentData.amount}
            onSuccess={handlePaymentSuccess}
          />
        </StripeProvider>
      )}
    </div>
  );
}

export default function BookingPage() {
  return (
    <Suspense fallback={
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-600"></div>
      </div>
    }>
      <BookingContent />
    </Suspense>
  );
}
