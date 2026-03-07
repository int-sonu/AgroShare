import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export default function CategoriesTable({categories}:any){

  return (

    <Table>

      <TableHeader>

        <TableRow>
          <TableHead>Image</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>

      </TableHeader>

      <TableBody>

        {categories.map((cat:any)=>(
          <TableRow key={cat._id}>

            <TableCell>

              <img
                src={`http://localhost:5000/uploads/categories/${cat.image}`}
                className="w-10 h-10 object-cover"
              />

            </TableCell>

            <TableCell>{cat.name}</TableCell>

            <TableCell>{cat.status}</TableCell>

          </TableRow>
        ))}

      </TableBody>

    </Table>

  )
}