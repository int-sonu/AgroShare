"use client"

import { useState, useEffect } from "react"
import AddCategoryForm from "@/components/admin/AddCategoryForm"

interface Category {
  _id: string
  name: string
  image: string
  description: string
  status: string
}

export default function CategoriesPage() {

  const [categories, setCategories] = useState<Category[]>([])
  const [showForm, setShowForm] = useState(false)

  const fetchCategories = async () => {
    try {
      const res = await fetch("http://localhost:5000/categories")
      const data = await res.json()

      setCategories(data.data || [])
    } catch (error) {
      console.error("Failed to fetch categories")
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  return (
    <div className="space-y-6">

      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">
          Categories
        </h1>

        <button
          onClick={() => setShowForm(true)}
          className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
        >
          + Add Category
        </button>
      </div>

      {/* Add Form */}
      {showForm && (
        <AddCategoryForm
          refresh={fetchCategories}
          close={() => setShowForm(false)}
        />
      )}

      {/* Categories Table */}
      <div className="bg-white rounded-lg shadow overflow-x-auto">

        <table className="w-full text-sm">

          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-4 text-left">Image</th>
              <th className="p-4 text-left">Name</th>
              <th className="p-4 text-left">Description</th>
              <th className="p-4 text-left">Status</th>
            </tr>
          </thead>

          <tbody>

            {categories.map((cat) => (
              <tr key={cat._id} className="border-b hover:bg-gray-50">

                {/* Image */}
                <td className="p-4">
                  <img
                    src={`http://localhost:5000/${cat.image}`}
                    alt={cat.name}
                    className="w-12 h-12 object-cover rounded"
                  />
                </td>

                {/* Name */}
                <td className="p-4 font-medium text-gray-900">
                  {cat.name}
                </td>

                {/* Description */}
                <td className="p-4 text-gray-600">
                  {cat.description}
                </td>

                {/* Status */}
                <td className="p-4">
                  <span
                    className={`px-2 py-1 text-xs rounded ${
                      cat.status === "active"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {cat.status}
                  </span>
                </td>

              </tr>
            ))}

          </tbody>

        </table>

      </div>

    </div>
  )
}