'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';

type Props = {
  machineId: string;
  nextStep: () => void;
  prevStep: () => void;
  initialData?: Record<string, any>; // eslint-disable-line @typescript-eslint/no-explicit-any
};

export default function ImagesStep({ machineId, nextStep, prevStep, initialData }: Props) {
  const { accessToken: token } = useAuth();
  const accessToken =
    token || (typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null);

  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);

  const hasExistingImages = initialData?.images && initialData.images.length > 0;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    setFiles(Array.from(e.target.files));
  };

  const handleUpload = async () => {
    if (files.length < 2) {
      alert('Upload at least 2 images');
      return;
    }

    const formData = new FormData();
    files.forEach((file: File) => {
      formData.append('images', file);
    });

    setLoading(true);

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/machines/${machineId}/images`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: formData,
    });

    const data = await res.json();
    setLoading(false);

    if (data.success) {
      nextStep();
    } else {
      alert('Upload failed');
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Upload Machine Images</h2>

      {hasExistingImages && (
        <div className="p-3 bg-green-50 border border-green-200 rounded-md">
          <p className="text-sm text-green-700 font-medium">
            ✅ {initialData.images.length} existing image(s). Upload new ones to replace, or skip.
          </p>
          <div className="flex gap-2 mt-2 flex-wrap">
            {initialData.images.slice(0, 3).map((url: string, i: number) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={i} src={url} alt={`img-${i}`} className="w-16 h-16 object-cover rounded" />
            ))}
          </div>
        </div>
      )}

      <input type="file" multiple accept="image/*" onChange={handleFileChange} />

      <div className="flex gap-3">
        <button className="px-4 py-2 border rounded-md" onClick={prevStep} disabled={loading}>
          Back
        </button>
        {hasExistingImages && (
          <button
            className="px-4 py-2 border border-gray-400 rounded-md text-gray-600 hover:bg-gray-50"
            onClick={nextStep}
            disabled={loading}
          >
            Keep Existing
          </button>
        )}
        <button
          onClick={handleUpload}
          className="bg-green-600 text-white px-4 py-2 rounded disabled:opacity-50"
          disabled={loading}
        >
          {loading ? 'Uploading...' : 'Upload Images'}
        </button>
      </div>
    </div>
  );
}
