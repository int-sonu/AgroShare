"use client"

import { useState } from "react"

import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select"

export default function AddCategoryForm({ refresh, close }: any) {

  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [status, setStatus] = useState("active")
  const [image, setImage] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: any) => {
    e.preventDefault()

    const formData = new FormData()
    formData.append("name", name)
    formData.append("description", description)
    formData.append("status", status)

    if (image) {
      formData.append("image", image)
    }

    try {
      setLoading(true)

      const res = await fetch("http://localhost:5000/categories", {
        method: "POST",
        body: formData,
      })

      if (!res.ok) {
        throw new Error("Failed to create category")
      }

      refresh()
      close()

      setName("")
      setDescription("")
      setStatus("active")
      setImage(null)

    } catch (error) {
      console.error("Create category failed", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">

      <Card className="w-full max-w-lg shadow-xl border border-gray-200 rounded-xl">

        <CardContent className="p-8">

          <h2 className="text-2xl font-semibold mb-6 text-gray-800">
            Add Category
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Category Name
              </label>

              <Input
                placeholder="Enter category name"
                className="focus:ring-2"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Description
              </label>

              <Textarea
                placeholder="Category description"
                className="focus:ring-2"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Category Image
              </label>

              <Input
                type="file"
                accept="image/*"
                onChange={(e: any) => setImage(e.target.files[0])}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Status
              </label>

              <Select
                value={status}
                onValueChange={(value) => setStatus(value)}
              >

                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>

              </Select>
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-3 pt-4">

              <Button
                type="button"
                variant="outline"
                onClick={close}
              >
                Cancel
              </Button>

              <Button
                type="submit"
                className="bg-green-600 hover:bg-green-700"
                disabled={loading}
              >
                {loading ? "Saving..." : "Create Category"}
              </Button>

            </div>

          </form>

        </CardContent>

      </Card>

    </div>
  )
}
