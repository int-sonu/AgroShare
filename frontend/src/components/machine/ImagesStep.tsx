'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';

type Props = {
  machineId: string;
  nextStep: () => void;
  prevStep: () => void;
};

export default function ImagesStep({ machineId, nextStep, prevStep }: Props) {
  const { accessToken: ctxToken } = useAuth();
  const accessToken =
    ctxToken || (typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null);

  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const selectedFiles = Array.from(e.target.files);

    setFiles(selectedFiles);
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

      <input type="file" multiple accept="image/*" onChange={handleFileChange} />

      <div className="flex gap-3">
        <button className="px-4 py-2 border rounded-md" onClick={prevStep} disabled={loading}>
          Back
        </button>
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
