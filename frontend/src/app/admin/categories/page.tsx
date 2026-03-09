'use client';
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Layers, Settings, ShoppingCart } from 'lucide-react';

interface Category {
  _id: string;
  name: string;
  image: string;
  description: string;
  status: string;
}

export default function CategoriesPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);

  const fetchCategories = useCallback(async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const res = await fetch(`${apiUrl}/categories`);

      if (!res.ok) {
        throw new Error('Failed to fetch categories');
      }

      const data = await res.json();
      setCategories(data.data || []);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const deleteCategory = async (id: string) => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      await fetch(`${apiUrl}/categories/${id}`, { method: 'DELETE' });

      fetchCategories();
    } catch {
      console.error('Delete failed');
    }
  };

  const toggleStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      await fetch(`${apiUrl}/categories/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      fetchCategories();
    } catch {
      console.error('Status update failed');
    }
  };

  return (
    <div className="space-y-8 p-8 max-w-3xl mx-auto">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-xl font-black text-slate-900 tracking-tighter uppercase leading-none">
            Categories <span className="text-primary">Inventory</span>
          </h1>
          <p className=" text-slate-900 text-sm mt-1 font-medium">
            Manage your agricultural product categories and their visibility.
          </p>
        </div>

        <button
          onClick={() => router.push('/admin/categories/add')}
          className="bg-primary text-white px-5 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-widest shadow-sm hover:bg-primary-dark transition-all flex items-center gap-2"
        >
          <Layers size={16} strokeWidth={2.5} />
          Add Category
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50 border-b border-slate-100  text-slate-900 uppercase text-[9px] font-black tracking-[0.2em]">
              <th className="p-5">Image</th>
              <th className="p-5">Name</th>
              <th className="p-5">Description</th>
              <th className="p-5">Status</th>
              <th className="p-5 text-right">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {categories.map((cat) => {
              const apiUrl = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000').replace(
                /\/$/,
                '',
              );
              const imageUrl = cat.image ? `${apiUrl}/${cat.image.replace(/^\//, '')}` : '';

              return (
                <tr key={cat._id} className="group hover:bg-slate-50/50 transition-colors">
                  <td className="p-5">
                    {cat.image ? (
                      <div className="relative w-14 h-14 rounded-2xl overflow-hidden ring-1 ring-slate-100 shadow-sm border-2 border-white transition-transform group-hover:scale-105">
                        <Image
                          src={imageUrl}
                          alt={cat.name}
                          fill
                          className="object-cover"
                          unoptimized={true}
                        />
                      </div>
                    ) : (
                      <div className="w-14 h-14 bg-slate-100 flex items-center justify-center text-[10px]  text-slate-900 font-bold rounded-xl uppercase tracking-tighter">
                        Empty
                      </div>
                    )}
                  </td>

                  <td className="p-5">
                    <div className="font-bold text-slate-900">{cat.name}</div>
                  </td>

                  <td className="p-5">
                    <p className="text-sm  text-slate-900 line-clamp-2 max-w-xs">
                      {cat.description}
                    </p>
                  </td>

                  <td className="p-5">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-xl text-[9px] font-black uppercase tracking-widest border border-slate-50 ${
                        cat.status === 'active'
                          ? 'bg-primary/10 text-primary'
                          : 'bg-rose-50 text-rose-700'
                      }`}
                    >
                      {cat.status}
                    </span>
                  </td>

                  <td className="p-5">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => toggleStatus(cat._id, cat.status)}
                        className="p-2   text-slate-900 hover:text-primary hover:bg-primary/5 rounded-lg transition-all"
                        title="Toggle Status"
                      >
                        <Layers size={16} strokeWidth={2} />
                      </button>

                      <button
                        className="p-2  text-slate-900 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                        title="Edit"
                      >
                        <Settings size={18} />
                      </button>

                      <button
                        onClick={() => deleteCategory(cat._id)}
                        className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                        title="Delete"
                      >
                        <ShoppingCart size={18} />
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
