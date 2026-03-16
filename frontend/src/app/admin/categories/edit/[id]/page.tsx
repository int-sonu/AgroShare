'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';

export default function EditCategoryPage() {
  const params = useParams();
  const id = params?.id as string;

  const router = useRouter();

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!id) return;

    const fetchCategory = async () => {
      try {
        const res = await fetch(`${apiUrl}/categories/${id}`);

        if (!res.ok) {
          throw new Error('Failed to fetch category');
        }

        const data = await res.json();

        if (data?.data) {
          const category = data.data;

          setName(category.name || '');
          setDescription(category.description || '');

          if (category.image) {
            setPreview(`${apiUrl}/${category.image}`);
          }
        }
      } catch (error) {
        console.error('Fetch category failed:', error);
      }
    };

    fetchCategory();
  }, [id, apiUrl]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);

    if (image) {
      formData.append('image', image);
    }

    try {
      setLoading(true);

      const res = await fetch(`${apiUrl}/categories/${id}`, {
        method: 'PUT',
        body: formData,
      });

      if (!res.ok) {
        throw new Error('Update failed');
      }

      router.push('/admin/categories');
    } catch (error) {
      console.error('Update category failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-lg bg-white shadow-lg rounded-xl p-8">
        <h2 className="text-2xl font-semibold mb-6">Edit Category</h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium mb-1">Category Name</label>

            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border rounded-lg px-3 py-2"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Description</label>

            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border rounded-lg px-3 py-2"
            />
          </div>

          {preview && (
            <div>
              <label className="block text-sm font-medium mb-2">Current Image</label>

              <div className="relative w-28 h-28 rounded-lg overflow-hidden border">
                <Image src={preview} alt="Category" fill className="object-cover" unoptimized />
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-1">Change Image</label>

            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                if (e.target.files && e.target.files.length > 0) {
                  const file = e.target.files[0];
                  setImage(file);
                  setPreview(URL.createObjectURL(file));
                }
              }}
              className="w-full border rounded-lg px-3 py-2"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-4 py-2 border rounded-lg"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-green-600 text-white rounded-lg"
            >
              {loading ? 'Updating...' : 'Update Category'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
