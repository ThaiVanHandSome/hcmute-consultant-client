import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import DialogDeleteDistrict from '@/pages/Manage/ManageDistrict/components/DialogDeleteDistrict'
import DialogDistrict from '@/pages/Manage/ManageDistrict/components/DialogDistrict'
import { DistrictType } from '@/types/location.type'
import { TrashIcon } from '@radix-ui/react-icons'
import { Edit2Icon } from 'lucide-react'

interface Props {
  readonly districts?: DistrictType[]
}

export default function DistrictTable({ districts }: Props) {
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
            <TableHead>Mã Tỉnh/Thành phố</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {districts?.map((item) => (
            <TableRow key={item.code}>
              <TableCell>{item.code}</TableCell>
              <TableCell>{item.codeName}</TableCell>
              <TableCell>{item.fullName}</TableCell>
              <TableCell>{item.fullNameEn}</TableCell>
              <TableCell>{item.name}</TableCell>
              <TableCell>{item.nameEn}</TableCell>
              <TableCell>{item.provinceCode}</TableCell>
              <TableCell>
                <div className='flex items-center space-x-2'>
                  <DialogDistrict district={item}>
                    <Edit2Icon className='size-4' strokeWidth={1.5} />
                  </DialogDistrict>
                  <DialogDeleteDistrict district={item}>
                    <TrashIcon className='size-5 text-destructive' />
                  </DialogDeleteDistrict>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
