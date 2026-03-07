"use client"

import { useRouter } from "next/navigation"
import AddCategoryForm from "@/components/admin/AddCategoryForm"

export default function AddCategoryPage() {

  const router = useRouter()

  return (
    <div className="p-6 max-w-xl">

      <h1 className="text-2xl font-bold mb-6">
        Add Category
      </h1>

      <AddCategoryForm
        refresh={() => router.push("/admin/categories")}
        close={() => router.push("/admin/categories")}
      />

    </div>
  )
}