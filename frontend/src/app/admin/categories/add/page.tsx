'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function AddCategoryForm({
  refresh,
  close,
}: {
  refresh?: () => void;
  close?: () => void;
}) {
  const router = useRouter();

  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('active');
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const validateName = (value: string) => {
    let error = '';
    const trimmed = value.trim();

    if (!trimmed) {
      error = 'Category name is required';
    } else if (trimmed.length < 2 || trimmed.length > 50) {
      error = 'Name must be between 2 and 50 characters';
    } else if (!/^[A-Za-z ]+$/.test(trimmed)) {
      error = 'Only letters and spaces allowed';
    } else if (/\s{2,}/.test(trimmed)) {
      error = 'Multiple spaces are not allowed';
    }

    setErrors((prev: Record<string, string>) => ({ ...prev, name: error }));
  };

  const validateImage = (file: File) => {
    let error = '';
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'];

    if (!allowedTypes.includes(file.type)) {
      error = 'Only JPG, PNG, WEBP, AVIF images allowed';
    }

    if (file.size > 5 * 1024 * 1024) {
      error = 'Image must be under 5MB';
    }

    setErrors((prev: Record<string, string>) => ({ ...prev, image: error }));
  };

  const generateSlug = (value: string) => {
    return value.toLowerCase().trim().replace(/ /g, '-').replace(/[^\w-]+/g, '');
  };

  const handleNameChange = (value: string) => {
    setName(value);
    setSlug(generateSlug(value));
    validateName(value);
  };

  const handleImageChange = (file: File) => {
    validateImage(file);
    setImage(file);
    const imageUrl = URL.createObjectURL(file);
    setPreview(imageUrl);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    validateName(name);
    if (errors.name || errors.image) return;

    const formattedName = name.trim().charAt(0).toUpperCase() + name.trim().slice(1);

    const formData = new FormData();
    formData.append('name', formattedName);
    formData.append('slug', slug.trim() || generateSlug(name));
    formData.append('description', description.trim());
    formData.append('status', status);

    if (image) {
      formData.append('image', image);
    }

    try {
      setLoading(true);
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

      const res = await fetch(`${apiUrl}/categories`, {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        throw new Error('Failed to create category');
      }

      if (refresh) refresh();
      if (close) close();
      else router.push('/admin/categories');

      setName('');
      setDescription('');
      setStatus('active');
      setImage(null);
      setPreview(null);
      setErrors({});
    } catch (error) {
      console.error('Create category failed', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-transparent">
      <div className="w-full max-w-lg bg-white shadow-lg rounded-xl p-8">
        <h2 className="text-2xl font-semibold mb-6 text-black">Add Category</h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-black mb-1">Category Name</label>

            <input
              type="text"
              placeholder="Enter category name"
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-black"
            />

            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-black mb-1">Slug (URL Name)</label>

            <input
              type="text"
              placeholder="category-slug"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-black bg-gray-50"
            />
            <p className="text-[10px] text-gray-500 mt-1 uppercase font-bold tracking-tight">Used for SEO friendly URLs</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-black mb-1">Description</label>

            <textarea
              placeholder="Category description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-black"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-black mb-1">Category Image</label>

            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/avif"
              onChange={(e) => {
                if (e.target.files && e.target.files.length > 0) {
                  handleImageChange(e.target.files[0]);
                }
              }}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-black"
            />

            {errors.image && <p className="text-red-500 text-sm mt-1">{errors.image}</p>}

            {preview && (
              <div className="mt-3">
                <p className="text-sm text-gray-600 mb-2">Preview</p>

                <Image
                  src={preview}
                  alt="Category Preview"
                  width={160}
                  height={160}
                  className="w-40 h-40 object-cover rounded-lg border"
                />
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-black mb-1">Status</label>

            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full border text-black border-gray-300 rounded-lg px-3 py-2"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() => (close ? close() : router.back())}
              className="px-4 py-2 border border-gray-300 rounded-lg text-black"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Create Category'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
