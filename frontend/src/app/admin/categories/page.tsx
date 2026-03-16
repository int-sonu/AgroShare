'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Layers, Pencil, Trash2, Eye, EyeOff } from 'lucide-react';

interface Category {
  _id: string;
  name: string;
  image: string;
  description: string;
  status: 'active' | 'inactive';
}

export default function CategoriesPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

  const fetchCategories = useCallback(async () => {
    try {
      const res = await fetch(`${apiUrl}/categories`);

      if (!res.ok) throw new Error('Failed to fetch categories');

      const data = await res.json();
      setCategories(data.data || []);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  }, [apiUrl]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const deleteCategory = async (id: string) => {
    try {
      const res = await fetch(`${apiUrl}/categories/${id}`, { method: 'DELETE' });

      if (!res.ok) throw new Error('Delete failed');

      fetchCategories();
    } catch (error) {
      console.error('Delete failed', error);
    }
  };

  const toggleStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';

    try {
      const res = await fetch(`${apiUrl}/categories/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) throw new Error('Status update failed');

      fetchCategories();
    } catch (error) {
      console.error('Status update failed', error);
    }
  };

  return (
    <div className="space-y-8 p-8 max-w-3xl mx-auto">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-xl font-black text-slate-900 uppercase">
            Categories <span className="text-primary">Inventory</span>
          </h1>

          <p className="text-slate-900 text-sm mt-1 font-medium">
            Manage your agricultural product categories.
          </p>
        </div>

        <button
          type="button"
          onClick={() => router.push('/admin/categories/add')}
          className="bg-primary text-white px-5 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-widest shadow-sm hover:bg-primary-dark transition-all flex items-center gap-2"
        >
          <Layers size={16} strokeWidth={2.5} />
          Add Category
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left border-collapse table-fixed">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100 text-slate-900 uppercase text-[9px] font-black tracking-[0.2em]">
              <th className="p-5 w-[90px]">Image</th>
              <th className="p-5">Name</th>
              <th className="p-5">Description</th>
              <th className="p-5 w-[100px]">Status</th>
              <th className="p-5 text-right w-[130px]">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {categories.map((cat) => {
              const imageUrl = cat.image ? `${apiUrl}/${cat.image.replace(/^\//, '')}` : '';

              return (
                <tr key={cat._id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-5">
                    {cat.image ? (
                      <div className="relative w-14 h-14 rounded-xl overflow-hidden">
                        <Image
                          src={imageUrl}
                          alt={cat.name}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      </div>
                    ) : (
                      <div className="w-14 h-14 bg-slate-100 flex items-center justify-center text-[10px] font-bold rounded-xl">
                        Empty
                      </div>
                    )}
                  </td>

                  <td className="p-5 font-bold text-slate-900">{cat.name}</td>

                  <td className="p-5 text-sm text-slate-700">{cat.description}</td>

                  <td className="p-5">
                    <span
                      className={`px-3 py-1 rounded-xl text-[10px] font-bold uppercase ${
                        cat.status === 'active'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-rose-100 text-rose-600'
                      }`}
                    >
                      {cat.status}
                    </span>
                  </td>

                  <td className="p-5">
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleStatus(cat._id, cat.status);
                        }}
                        className="p-2 rounded-lg hover:bg-gray-100"
                        title="Toggle Status"
                      >
                        {cat.status === 'active' ? (
                          <Eye size={16} className="text-green-600" />
                        ) : (
                          <EyeOff size={16} className="text-gray-400" />
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() => router.push(`/admin/categories/edit/${cat._id}`)}
                        className="p-2 hover:bg-blue-50 rounded-lg"
                        title="Edit"
                      >
                        <Pencil size={18} className="text-blue-600" />
                      </button>

                      <button
                        type="button"
                        onClick={() => deleteCategory(cat._id)}
                        className="p-2 hover:bg-rose-50 rounded-lg"
                        title="Delete"
                      >
                        <Trash2 size={18} className="text-rose-600" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
