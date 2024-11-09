import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { AdminUser } from '@/types/user.type'

interface Props {
  readonly users?: AdminUser[]
}

export default function UserTable({ users }: Props) {
  return (
    <div>
      <Table className='font-semibold bg-background'>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Username</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Khoa</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Hoạt động</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users?.map((user) => (
            <TableRow key={user.id}>
              <TableCell>{user.id}</TableCell>
              <TableCell>{user.username}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user?.department?.name}</TableCell>
              <TableCell>{user.role.name}</TableCell>
              <TableCell>{user.lastActivity}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
