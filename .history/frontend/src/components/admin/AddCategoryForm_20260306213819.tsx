"use client"

import { useState } from "react"

export default function AddCategoryForm({ refresh, close }: any) {

  const [name,setName] = useState("")
  const [image,setImage] = useState<File | null>(null)

  const handleSubmit = async (e:any) => {

    e.preventDefault()

    const formData = new FormData()

    formData.append("name", name)

    if(image){
      formData.append("image", image)
    }

    const res = await fetch("http://localhost:5000/categories", {
      method: "POST",
      body: formData
    })

    const data = await res.json()

    if(data.success){
      alert("Category Added")
      refresh()
      close()
    }

  }

  return (

    <form
      onSubmit={handleSubmit}
      className="border p-4 rounded space-y-3"
    >

      <input
        className="border p-2 w-full"
        placeholder="Category Name"
        value={name}
        onChange={(e)=>setName(e.target.value)}
      />

      <input
        type="file"
        onChange={(e)=>setImage(e.target.files?.[0] || null)}
      />

      <button
        type="submit"
        className="bg-black text-white px-4 py-2 rounded"
      >
        Save
      </button>

    </form>

  )
}