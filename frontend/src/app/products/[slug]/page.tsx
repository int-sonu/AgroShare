'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import {
  MapPin,
  Phone,
  Calendar,
  ShieldCheck,
  Info,
  Fuel,
  Gauge,
  Lock,
  User,
  Truck,
  Maximize2,
  LockIcon,
  Mail,
  UserCheck,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/context/AuthContext';

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
  operator?: { operatorIncluded?: boolean; operatorName?: string; operatorPhone?: string };
  seller?: { name?: string; phone?: string; email?: string };
  description?: string;
  images?: (string | { url?: string; secure_url?: string })[];
  stock?: number;
  quantity?: number;
};

export default function MachineDetailPage() {
  const { slug } = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [machine, setMachine] = useState<MachineData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [selectedQuantity, setSelectedQuantity] = useState(1);


  const getImageUrl = (image: any) => {
    if (!image) return '/images/category-placeholder.png';
    const url = typeof image === 'string' ? image : image?.url || image?.secure_url;
    if (!url) return '/images/category-placeholder.png';
    if (url.startsWith('http') || url.startsWith('//')) {
      return url.startsWith('//') ? `https:${url}` : url;
    }
    return `${process.env.NEXT_PUBLIC_API_URL}/${url.replace(/^\//, '')}`;
  };

  useEffect(() => {
    const fetchMachine = async () => {
      try {
 const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/machines/slug/${slug}`,
          { cache: 'no-store' }
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

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (!machine) {
    return (
      <div className="text-center py-10 px-4">
        <h2 className="text-lg font-bold text-gray-800">Machine not found</h2>
        <Button
          className="mt-4 bg-green-600 h-9 rounded-lg text-sm"
          onClick={() => window.history.back()}
        >
          Go Back
        </Button>
      </div>
    );
  }

  const images = machine.images || [];
  const isLoggedIn = !!user;

  return (
    <div className="bg-gray-50 min-h-screen pb-6">
      <div className="container mx-auto px-4 md:px-6 py-4">
        <div className="grid lg:grid-cols-12 gap-5 bg-white rounded-2xl p-4 md:p-5 shadow-sm border border-gray-100">
          <div className="lg:col-span-6 flex flex-col md:flex-row gap-4">
            <div className="order-2 md:order-1 flex md:flex-col gap-2 overflow-x-auto md:overflow-y-auto md:max-h-[400px] scrollbar-hide py-1">
              {images.map((img: string | { url?: string; secure_url?: string }, idx: number) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(idx)}
                  className={`relative w-14 h-14 md:w-16 md:h-16 rounded-md overflow-hidden border-2 transition-all shrink-0 bg-white ${activeImage === idx
                      ? 'border-green-600 shadow-sm'
                      : 'border-gray-100 hover:border-gray-200'
                    }`}
                >
                  <Image
                    src={getImageUrl(img)}
                    alt={`Thumbnail ${idx + 1}`}
                    fill
                    className="object-contain p-1"
                  />
                </button>
              ))}
            </div>

            <div className="order-1 md:order-2 flex-1 relative aspect-[16/10] w-full h-[300px] md:h-[400px] rounded-xl overflow-hidden bg-white border border-gray-50 group">
              <div className="w-full h-full relative cursor-crosshair overflow-hidden">
                <Image
                  src={getImageUrl(images[activeImage])}
                  alt={machine.machineName || 'Machine Image'}
                  fill
                  className="object-contain p-4 transition-transform duration-500 ease-out group-hover:scale-[1.3] origin-center"
                  priority
                />
              </div>
              <div className="absolute top-2.5 left-2.5">
                <Badge className="bg-green-600 text-white hover:bg-green-700 border-0 shadow-sm text-[9px] py-0 px-2 h-5 flex items-center gap-1 uppercase tracking-tighter">
                  {machine.category?.name || 'Equipment'}
                </Badge>
              </div>
              <div className="absolute bottom-2.5 right-2.5 bg-white/80 p-1.5 rounded-full shadow-sm backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity">
                <Maximize2 className="w-4 h-4 text-gray-600" />
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 flex flex-col space-y-3 lg:pl-1">
            <div className="space-y-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-bold text-green-600 uppercase tracking-widest">
                  {machine.brandModel || 'Universal'}
                </span>
                <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                  {machine.yearOfManufacture || 'N/A'}
                </span>
              </div>
              <h1 className="text-xl md:text-2xl font-black text-gray-900 leading-tight">
                {machine.machineName}
              </h1>
              <div className="flex items-center gap-1 text-gray-500 text-[11px] font-medium pt-0.5">
                <MapPin className="w-3 h-3 text-rose-500" />
                <span>
                  {isLoggedIn && machine.location?.village ? `${machine.location.village}, ` : ''}
                  {machine.location?.district}, {machine.location?.state}
                </span>
                {!isLoggedIn && (
                  <span className="text-[9px] text-gray-400 font-bold ml-1 flex items-center gap-0.5">
                    <LockIcon className="w-2 h-2" /> Village hidden
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 mt-2">

              </div>
            </div>

            <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-2.5 rounded-xl border border-green-100 flex flex-wrap justify-between items-center gap-4 transition-all relative overflow-hidden">
              <div className="min-w-[100px]">
                <p className="text-[9px] font-bold text-green-700/60 uppercase tracking-widest mb-0">
                  Daily Price
                </p>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-black text-green-700">
                    ₹{machine.pricing?.rentalPrice?.toLocaleString()}
                  </span>
                  <span className="text-[11px] font-bold text-green-600/80">
                    / {machine.pricing?.priceType}
                  </span>
                </div>
              </div>

              <div className="flex gap-4 items-center">
                {machine.pricing?.minimumRentalDuration && (
                  <div className="text-right pr-4 border-r border-green-200/50">
                    <p className="text-[9px] font-bold text-green-700/60 uppercase tracking-widest mb-0">
                      Min Booking
                    </p>
                    <p className="text-[11px] font-black text-green-700">
                      {machine.pricing.minimumRentalDuration}{' '}
                      {machine.pricing.priceType?.split(' ')[1] || 'Unit'}
                    </p>
                  </div>
                )}


              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              <DetailItem
                icon={<ShieldCheck className="w-3 h-3" />}
                label="Condition"
                value={machine.condition || 'Excellent'}
              />
              <DetailItem
                icon={<Gauge className="w-3 h-3" />}
                label="Power"
                value={`${machine.machineCapacityHP || '45'} HP`}
              />
              <DetailItem
                icon={<Fuel className="w-3 h-3" />}
                label="Fuel"
                value={machine.fuelType || 'Diesel'}
              />
              <DetailItem
                icon={<Lock className="w-3 h-3" />}
                label="Deposit"
                value={
                  isLoggedIn
                    ? machine.pricing?.securityDeposit
                      ? `₹${machine.pricing.securityDeposit}`
                      : 'None'
                    : 'Login to view'
                }
                isLocked={!isLoggedIn}
              />
              <DetailItem
                icon={<Truck className="w-3 h-3" />}
                label="Transportation"
                value={
                  machine.transport?.transportAvailable
                    ? isLoggedIn
                      ? `₹${machine.transport.transportCost}`
                      : 'Available'
                    : 'N/A'
                }
                isLocked={!isLoggedIn && machine.transport?.transportAvailable}
              />
              <DetailItem
                icon={<Calendar className="w-3 h-3" />}
                label="MFG Year"
                value={machine.yearOfManufacture || 'N/A'}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {isLoggedIn ? (
                <div className="p-2.5 rounded-xl border border-gray-100 bg-gray-50/40 hover:bg-white transition-colors">
                  <div className="flex items-center gap-1.5 mb-1">
                    <User className="w-3.5 h-3.5 text-green-600" />
                    <span className="text-[10px] font-bold text-gray-800 uppercase tracking-wider">
                      Operator Info
                    </span>
                  </div>
                  {machine.operator?.operatorIncluded ? (
                    <div className="space-y-0.5">
                      <p className="text-sm text-gray-700 font-bold">
                        {machine.operator.operatorName || 'Assigned Driver'}
                      </p>
                      <p className="text-sm text-gray-600 font-medium flex items-center gap-1">
                        <Phone className="w-3 h-3 text-green-600" />{' '}
                        {machine.operator.operatorPhone || 'N/A'}
                      </p>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-400 italic font-medium pt-0.5">
                      Self-operate only
                    </p>
                  )}
                </div>
              ) : (
                <div className="p-2.5 rounded-xl border border-dashed border-gray-200 bg-gray-50/20 flex flex-col items-center justify-center py-2 text-center">
                  <LockIcon className="w-3.5 h-3.5 text-gray-300 mb-1" />
                  <p className="text-[9px] text-gray-500 font-bold uppercase tracking-tight">
                    Operator Info Locked
                  </p>
                </div>
              )}

              {isLoggedIn ? (
                <div className="p-2.5 rounded-xl border border-gray-100 bg-gray-50/40 hover:bg-white transition-colors">
                  <div className="flex items-center gap-1.5 mb-1">
                    <UserCheck className="w-3.5 h-3.5 text-green-600" />
                    <span className="text-[10px] font-bold text-gray-800 uppercase tracking-wider">
                      Seller Contact
                    </span>
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-sm text-gray-700 font-bold">
                      {machine.seller?.name || 'Authorized Seller'}
                    </p>
                    <div className="flex flex-col gap-0.5">
                      <p className="text-sm text-gray-600 font-medium flex items-center gap-1">
                        <Phone className="w-3 h-3 text-green-600" />{' '}
                        {machine.seller?.phone || 'N/A'}
                      </p>
                      <p className="text-sm text-gray-600 font-medium flex items-center gap-1">
                        <Mail className="w-3 h-3 text-green-600" />{' '}
                        {machine.seller?.email || 'N/A'}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-2.5 rounded-xl border border-dashed border-gray-200 bg-gray-50/20 flex flex-col items-center justify-center py-2 text-center">
                  <LockIcon className="w-3.5 h-3.5 text-gray-300 mb-1" />
                  <Button
                    onClick={() => router.push('/auth/login')}
                    variant="ghost"
                    className="h-4 p-0 text-[10px] text-green-600 font-black hover:bg-transparent uppercase tracking-tight"
                  >
                    Login to view Seller
                  </Button>
                </div>
              )}
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-gray-800 font-bold text-[12px]">
                <Info className="w-3.5 h-3.5 text-green-600" />
                <h3 className="uppercase tracking-wide text-[11px]">Description</h3>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed line-clamp-2 hover:line-clamp-none transition-all duration-300">
                {machine.description ||
                  'Top-tier machinery for all your professional agricultural needs. Well-maintained and recently serviced for peak performance.'}
              </p>
            </div>

            {(machine.quantity ?? 1) > 0 && (
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100 mb-4">
                <div className="flex flex-col">
                  <span className="text-sm font-black text-gray-500 uppercase tracking-widest">Select Quantity</span>
                </div>
                <div className="flex items-center gap-4 bg-white px-3 py-1.5 rounded-lg border border-gray-200">
                  <button
                    onClick={() => setSelectedQuantity(Math.max(1, selectedQuantity - 1))}
                    className="w-6 h-6 flex items-center justify-center font-bold text-lg hover:text-green-600 transition-colors"
                  >
                    -
                  </button>
                  <span className="w-4 text-center font-black text-sm">{selectedQuantity}</span>
                  <button
                    onClick={() => setSelectedQuantity(Math.min(machine.quantity || 1, selectedQuantity + 1))}
                    className="w-6 h-6 flex items-center justify-center font-bold text-lg hover:text-green-600 transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>
            )}

            <div className="flex gap-2.5 pt-1 mt-auto">
              <Button
                onClick={() => (isLoggedIn ? null : router.push('/auth/login'))}
                className="flex-[1.2] h-10 rounded-lg bg-green-600 hover:bg-green-700 text-white font-black text-xs shadow-md shadow-green-600/20 active:scale-98 transition-all uppercase tracking-wider"
              >
                {isLoggedIn ? (
                  <>
                    <Phone className="w-3.5 h-3.5 mr-1.5" /> Contact Seller
                  </>
                ) : (
                  'Login to View Contact'
                )}
              </Button>
              <Button
                variant="outline"
                onClick={() => (isLoggedIn ? router.push(`/products/${slug}/book?qty=${selectedQuantity}`) : router.push('/auth/login'))}
                className="flex-1 h-10 rounded-lg border-2 border-gray-100 font-black text-xs hover:bg-gray-50 active:scale-98 transition-all uppercase tracking-wider text-gray-700"
              >
                {isLoggedIn ? 'Request Booking' : 'Login to Book'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface DetailItemProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  isLocked?: boolean;
}

function DetailItem({ icon, label, value, isLocked = false }: DetailItemProps) {
  return (
    <div
      className={`p-2 rounded-lg border border-gray-50 bg-gray-50/30 flex flex-col gap-0 group transition-all shadow-[inset_0_1px_2px_rgba(0,0,0,0.01)] ${!isLocked && 'hover:bg-white hover:border-green-100'}`}
    >
      <div
        className={`flex items-center gap-1 text-gray-400 ${!isLocked && 'group-hover:text-green-500'} transition-colors`}
      >
        {icon}
        <span className="text-[8px] font-extrabold uppercase tracking-tight">{label}</span>
      </div>
      <div className="flex items-center gap-1">
        <p className={`text-[10px] font-black truncate text-gray-800`}>{value}</p>
        {isLocked && <LockIcon className="w-2 h-2 text-gray-300" />}
      </div>
    </div>
  );
}
