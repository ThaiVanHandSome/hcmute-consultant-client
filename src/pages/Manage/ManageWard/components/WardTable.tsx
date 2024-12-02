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
        <TableHeader className='bg-primary'>
          <TableRow>
            <TableHead className='!text-primary-foreground'>Mã</TableHead>
            <TableHead className='!text-primary-foreground'>Tên Mã</TableHead>
            <TableHead className='!text-primary-foreground'>Tên (Full)</TableHead>
            <TableHead className='!text-primary-foreground'>Tên (Full English)</TableHead>
            <TableHead className='!text-primary-foreground'>Tên</TableHead>
            <TableHead className='!text-primary-foreground'>Tên (English)</TableHead>
            <TableHead className='!text-primary-foreground'>Mã Quận/Huyện</TableHead>
            <TableHead className='!text-primary-foreground'>Action</TableHead>
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
