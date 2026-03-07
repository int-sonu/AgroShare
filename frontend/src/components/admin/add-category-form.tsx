"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function AddCategoryForm({refresh}:any){

  const [name,setName] = useState("")
  const [image,setImage] = useState<File | null>(null)

  const handleSubmit = async (e:any)=>{

    e.preventDefault()

    const formData = new FormData()

    formData.append("name",name)

    if(image){
      formData.append("image",image)
    }

    const res = await fetch(
      "http://localhost:5000/api/categories",
      {
        method:"POST",
        body:formData
      }
    )

    const data = await res.json()

    if(data.success){

      alert("Category added")

      setName("")
      refresh()
    }

  }

  return(

    <form
      onSubmit={handleSubmit}
      className="border p-4 rounded space-y-4"
    >

      <Input
        placeholder="Category Name"
        value={name}
        onChange={(e)=>setName(e.target.value)}
      />

      <Input
        type="file"
        onChange={(e)=>setImage(e.target.files?.[0] || null)}
      />

      <Button type="submit">
        Save Category
      </Button>

    </form>
  )
}