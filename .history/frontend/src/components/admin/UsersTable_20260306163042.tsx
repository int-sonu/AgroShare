import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow,} from "@/components/ui/table";

export default function UsersTable({ users }: any) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Phone</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {users.map((u: any) => (
          <TableRow key={u._id}>
            <TableCell>{u.name}</TableCell>
            <TableCell>{u.email}</TableCell>
            <TableCell>{u.phone}</TableCell>
            <TableCell>{u.status}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}