import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import DialogDeleteRole from '@/pages/Manage/ManageRole/components/DialogDeleteRole'
import DialogRole from '@/pages/Manage/ManageRole/components/DialogRole'
import { RoleType } from '@/types/role.type'
import { TrashIcon } from '@radix-ui/react-icons'
import { Edit2Icon } from 'lucide-react'

interface Props {
  readonly roles?: RoleType[]
}

export default function RoleTable({ roles }: Props) {
  return (
    <Table className='bg-background font-semibold'>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>Tên</TableHead>
          <TableHead>Ngày tạo</TableHead>
          <TableHead>Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {roles?.map((role) => (
          <TableRow key={role.id}>
            <TableCell>{role.id}</TableCell>
            <TableCell>{role.name}</TableCell>
            <TableCell>{role.createdAt}</TableCell>
            <TableCell>
              <div className='flex items-center space-x-2'>
                <DialogRole role={role}>
                  <Edit2Icon className='size-4' strokeWidth={1.5} />
                </DialogRole>
                <DialogDeleteRole role={role}>
                  <TrashIcon className='size-5 text-destructive' />
                </DialogDeleteRole>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
