import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import DialogDeleteField from '@/pages/Manage/ManageField/components/DialogDeleteField'
import DialogField from '@/pages/Manage/ManageField/components/DialogField'
import { AdminField } from '@/types/field.type'
import { TrashIcon } from '@radix-ui/react-icons'
import { Edit2Icon } from 'lucide-react'

interface Props {
  readonly fields?: AdminField[]
}

export default function FieldTable({ fields }: Props) {
  return (
    <div>
      <Table className='font-semibold bg-background'>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Tên</TableHead>
            <TableHead>Ngày tạo</TableHead>
            <TableHead>Khoa</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {fields?.map((field) => (
            <TableRow key={field.id}>
              <TableCell>{field.id}</TableCell>
              <TableCell>{field.name}</TableCell>
              <TableCell>{field.createdAt}</TableCell>
              <TableCell>{field.departmentId}</TableCell>
              <TableCell>
                <div className='flex items-center space-x-2'>
                  <DialogField field={field}>
                    <Edit2Icon className='size-4' strokeWidth={1.5} />
                  </DialogField>
                  <DialogDeleteField field={field}>
                    <TrashIcon className='size-5 text-destructive' />
                  </DialogDeleteField>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
