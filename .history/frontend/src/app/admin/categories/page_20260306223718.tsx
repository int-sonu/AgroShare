"use client"

import { useState,useEffect } from "react"
import AddCategoryForm from "@/components/admin/AddCategoryForm"

export default function CategoriesPage(){

  const [categories,setCategories] = useState([])
  const [showForm,setShowForm] = useState(false)

  const fetchCategories = async ()=>{

    const res = await fetch("http://localhost:5000/categories")
    const data = await res.json()

    setCategories(data.data)

  }

  useEffect(()=>{
    fetchCategories()
  },[])

  return(

    <div className="space-y-6">

      <div className="flex justify-between">

        <h1 className="text-xl font-bold  text-gray-900">
          Categories
        </h1>

        <button
          onClick={()=>setShowForm(true)}
          className="bg-black text-white px-4 py-2"
        >
          Add Category
        </button>

      </div>

      {showForm && (
        <AddCategoryForm
          refresh={fetchCategories}
          close={()=>setShowForm(false)}
        />
      )}

      <div>

        {categories.map((cat:any)=>(
          <div key={cat._id} className="border p-2">

            {cat.name}

          </div>
        ))}

      </div>

    </div>

  )
}