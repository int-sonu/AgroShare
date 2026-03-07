"use client"

import { useState } from "react"

export default function AddCategoryForm({ refresh, close }: any) {

  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [status, setStatus] = useState("active")
  const [image, setImage] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: any) => {
    e.preventDefault()

    try {

      setLoading(true)

      const formData = new FormData()
      formData.append("name", name)
      formData.append("description", description)
      formData.append("status", status)

      if (image) {
        formData.append("image", image)
      }

      const res = await fetch("http://localhost:5000/categories", {
        method: "POST",
        body: formData,
      })

      if (!res.ok) {
        throw new Error("Failed to create category")
      }

      refresh()

    } catch (error) {

      console.error("Error creating category")

    } finally {

      setLoading(false)

    }
  }

  return (

    <form
      onSubmit={handleSubmit}
      className="space-y-4 bg-white p-6 rounded-lg shadow"
    >

      {/* Name */}
      <div>
        <label className="text-sm font-medium text-gray-700">
          Category Name
        </label>

        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full border rounded-md p-2 mt-1"
        />
      </div>

      {/* Description */}
      <div>
        <label className="text-sm font-medium text-gray-700">
          Description
        </label>

        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          className="w-full border rounded-md p-2 mt-1"
        />
      </div>

      {/* Image Upload */}
      <div>
        <label className="text-sm font-medium text-gray-700">
          Category Image
        </label>

        <input
          type="file"
          accept="image/*"
          onChange={(e: any) => setImage(e.target.files[0])}
          required
          className="w-full mt-1"
        />
      </div>

      {/* Status */}
      <div>
        <label className="text-sm font-medium text-gray-700">
          Status
        </label>

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-full border rounded-md p-2 mt-1"
        >
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      {/* Buttons */}
      <div className="flex gap-3 pt-4">

        <button
          type="submit"
          disabled={loading}
          className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
        >
          {loading ? "Saving..." : "Create Category"}
        </button>

        <button
          type="button"
          onClick={close}
          className="bg-gray-300 px-4 py-2 rounded-md"
        >
          Cancel
        </button>

      </div>

    </form>

  )
}