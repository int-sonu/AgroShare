"use client"

import { useState } from "react"

import AddCategoryForm from "./AddCategoryForm"

import { Button } from "@/components/ui/button"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog"

export default function CategoriesPage() {

  const [open, setOpen] = useState(false)

  const fetchCategories = () => {
    console.log("refresh category list")
  }

  return (
    <div className="p-6">

      <Button onClick={() => setOpen(true)}>
        Add Category
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>

        <DialogContent className="max-w-lg">

          <DialogHeader>
            <DialogTitle>Add Category</DialogTitle>
          </DialogHeader>

          <AddCategoryForm
            refresh={fetchCategories}
            close={() => setOpen(false)}
          />

        </DialogContent>

      </Dialog>

    </div>
  )
}