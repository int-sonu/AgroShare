'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function AdminProfilePage() {
  const { user } = useAuth();
  const router = useRouter();

  return (
    <div className="flex items-center justify-center min-h-[80vh] p-8 bg-slate-50">
      <div className="w-full max-w-3xl bg-white rounded-3xl shadow-xl p-10">
        <div className="flex items-center gap-6 mb-8">
          <div className="w-16 h-16 bg-gray-200 rounded-xl flex items-center justify-center text-2xl font-bold">
            {user?.name?.charAt(0)?.toUpperCase() || 'A'}
          </div>

          <div>
            <h2 className="text-xl font-bold">{user?.name || 'Admin'}</h2>
            <p className="text-sm text-gray-500 uppercase tracking-wide">Administrator</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-y-8 text-sm">
          <div>
            <p className="text-gray-500 text-xs uppercase">Digital Mail</p>
            <p className="font-semibold">{user?.email || 'info.agroshare@gmail.com'}</p>
          </div>

          <div>
            <p className="text-gray-500 text-xs uppercase">Mobile Line</p>
            <p className="font-semibold">9876543210</p>
          </div>

          <div>
            <p className="text-gray-500 text-xs uppercase">Role</p>
            <p className="font-semibold capitalize">{user?.role || 'admin'}</p>
          </div>

          <div>
            <p className="text-gray-500 text-xs uppercase">Status</p>
            <p className="font-semibold text-green-600">Active</p>
          </div>
        </div>

        <div className="border-t mt-10 pt-6 flex justify-between">
          <button
            onClick={() => router.back()}
            className="px-6 py-2 rounded-full bg-black text-white text-sm font-semibold"
          >
            CLOSE PROFILE
          </button>
        </div>
      </div>
    </div>
  );
}
