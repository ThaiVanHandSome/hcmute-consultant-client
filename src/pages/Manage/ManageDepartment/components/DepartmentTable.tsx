import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import DialogDeleteDepartment from '@/pages/Manage/ManageDepartment/components/DialogDeleteDepartment'
import DialogDepartment from '@/pages/Manage/ManageDepartment/components/DialogDepartment'
import { AdminDepartment } from '@/types/department.type'
import { TrashIcon } from '@radix-ui/react-icons'
import { Edit2Icon } from 'lucide-react'

interface Props {
  readonly departments?: AdminDepartment[]
}

export default function DepartmentTable({ departments }: Props) {
  return (
    <div>
      <Table className='font-semibold bg-background'>
        <TableHeader className='bg-primary'>
          <TableRow>
            <TableHead className='!text-primary-foreground'>ID</TableHead>
            <TableHead className='!text-primary-foreground'>Tên</TableHead>
            <TableHead className='!text-primary-foreground'>Mô tả</TableHead>
            <TableHead className='!text-primary-foreground'>Ngày tạo</TableHead>
            <TableHead className='!text-primary-foreground'>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {departments?.map((department) => (
            <TableRow key={department.id}>
              <TableCell>{department.id}</TableCell>
              <TableCell>{department.name}</TableCell>
              <TableCell>{department.description}</TableCell>
              <TableCell>{department.createdAt}</TableCell>
              <TableCell>
                <div className='flex items-center space-x-2'>
                  <DialogDepartment department={department}>
                    <Edit2Icon className='size-4' strokeWidth={1.5} />
                  </DialogDepartment>
                  <DialogDeleteDepartment department={department}>
                    <TrashIcon className='size-5 text-destructive' />
                  </DialogDeleteDepartment>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
