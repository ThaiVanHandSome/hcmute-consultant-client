import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import DialogDeleteProvince from '@/pages/Manage/ManageProvince/components/DialogDeleteProvince'
import DialogProvince from '@/pages/Manage/ManageProvince/components/DialogProvince'
import { ProvinceType } from '@/types/location.type'
import { TrashIcon } from '@radix-ui/react-icons'
import { Edit2Icon } from 'lucide-react'

interface Props {
  readonly provinces?: ProvinceType[]
}

export default function ProvinceTable({ provinces }: Props) {
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
            <TableHead className='!text-primary-foreground'>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {provinces?.map((item) => (
            <TableRow key={item.code}>
              <TableCell>{item.code}</TableCell>
              <TableCell>{item.codeName}</TableCell>
              <TableCell>{item.fullName}</TableCell>
              <TableCell>{item.fullNameEn}</TableCell>
              <TableCell>{item.name}</TableCell>
              <TableCell>{item.nameEn}</TableCell>
              <TableCell>
                <div className='flex items-center space-x-2'>
                  <DialogProvince province={item}>
                    <Edit2Icon className='size-4' strokeWidth={1.5} />
                  </DialogProvince>
                  <DialogDeleteProvince province={item}>
                    <TrashIcon className='size-5 text-destructive' />
                  </DialogDeleteProvince>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
