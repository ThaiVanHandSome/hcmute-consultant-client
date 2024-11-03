import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import DialogDeleteWard from '@/pages/Manage/ManageWard/components/DialogDeleteWard'
import DialogWard from '@/pages/Manage/ManageWard/components/DialogWard'
import { WardType } from '@/types/location.type'
import { TrashIcon } from '@radix-ui/react-icons'
import { Edit2Icon } from 'lucide-react'

interface Props {
  readonly wards?: WardType[]
}

export default function WardTable({ wards }: Props) {
  return (
    <div className='bg-background rounded-md font-semibold'>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Mã</TableHead>
            <TableHead>Tên Mã</TableHead>
            <TableHead>Tên (Full)</TableHead>
            <TableHead>Tên (Full English)</TableHead>
            <TableHead>Tên</TableHead>
            <TableHead>Tên (English)</TableHead>
            <TableHead>Mã Quận/Huyện</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {wards?.map((item) => (
            <TableRow key={item.code}>
              <TableCell>{item.code}</TableCell>
              <TableCell>{item.codeName}</TableCell>
              <TableCell>{item.fullName}</TableCell>
              <TableCell>{item.fullNameEn}</TableCell>
              <TableCell>{item.name}</TableCell>
              <TableCell>{item.nameEn}</TableCell>
              <TableCell>{item.districtCode}</TableCell>
              <TableCell>
                <div className='flex items-center space-x-2'>
                  <DialogWard ward={item}>
                    <Edit2Icon className='size-4' strokeWidth={1.5} />
                  </DialogWard>
                  <DialogDeleteWard ward={item}>
                    <TrashIcon className='size-5 text-destructive' />
                  </DialogDeleteWard>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
