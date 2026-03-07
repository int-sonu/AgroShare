

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

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

  const fetchCategories = async () => {
    try {
      const res = await fetch('http://localhost:5000/categories');
      const data = await res.json();
      setCategories(data.data || []);
    } catch (error) {
      console.error('Failed to fetch categories');
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const deleteCategory = async (id: string) => {
    try {
      await fetch(`http://localhost:5000/categories/${id}`, {
        method: 'DELETE',
      });

      fetchCategories();
    } catch (error) {
      console.error('Delete failed');
    }
  };

  const toggleStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';

    try {
      await fetch(`http://localhost:5000/categories/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      fetchCategories();
    } catch (error) {
      console.error('Status update failed');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Categories</h1>

        <button
          onClick={() => router.push('/admin/categories/add')}
          className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
        >
          + Add Category
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-4 text-left text-black">Image</th>
              <th className="p-4 text-left  text-black">Name</th>
              <th className="p-4 text-left  text-black">Description</th>
              <th className="p-4 text-left  text-black">Status</th>
              <th className="p-4 text-left  text-black">Actions</th>
            </tr>
          </thead>

          <tbody>
            {categories.map((cat) => (
              <tr key={cat._id} className="border-b hover:bg-gray-50">
                <td className="p-4">
               <Image
  src={`${process.env.NEXT_PUBLIC_API_URL}/${cat.image}`}
  alt={cat.name}
  width={48}
  height={48}
  className="rounded object-cover"
/>
                </td>

                <td className="p-4 font-medium text-gray-900">{cat.name}</td>

                <td className="p-4 text-black">{cat.description}</td>

                <td className="p-4">
                  <span
                    className={`px-2 py-1 text-xs rounded ${
                      cat.status === 'active'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {cat.status}
                  </span>
                </td>

                <td className="p-4 flex gap-2">
                  <button
                    onClick={() => toggleStatus(cat._id, cat.status)}
                    className="px-3 py-1 text-xs bg-yellow-500 text-black rounded hover:bg-yellow-600 "
                  >
                    Status
                  </button>

                  <button className="px-3 py-1 text-xs bg-blue-600 text-blackrounded hover:bg-blue-700">
                    Edit
                  </button>

                  <button
                    onClick={() => deleteCategory(cat._id)}
                    className="px-3 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
