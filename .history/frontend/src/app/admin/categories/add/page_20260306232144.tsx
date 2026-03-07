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

    } catch (error) {
      console.error("Create category failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardContent className="p-6">

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Category Name */}
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Category Name
            </label>

            <Input
              placeholder="Enter category name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Description
            </label>

            <Textarea
              placeholder="Category description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* Image */}
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Category Image
            </label>

            <Input
              type="file"
              accept="image/*"
              onChange={(e: any) => setImage(e.target.files[0])}
            />
          </div>

          {/* Status */}
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Status
            </label>

            <Select value={status} onValueChange={setStatus}>
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
          <div className="flex gap-3 pt-4">

            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : "Create Category"}
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={close}
            >
              Cancel
            </Button>

          </div>

        </form>

      </CardContent>
    </Card>
  )
}