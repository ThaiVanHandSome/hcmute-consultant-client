import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import DialogConsultantRole from '@/pages/Manage/ManageConsultantRole/components/DialogConsultantRole'
import DialogDeleteRoleConsultant from '@/pages/Manage/ManageConsultantRole/components/DialogDeleteRoleConsultant'
import { ConsultantRoleType } from '@/types/role.type'
import { TrashIcon } from '@radix-ui/react-icons'
import { Edit2Icon } from 'lucide-react'

interface Props {
  readonly roles?: ConsultantRoleType[]
}

export default function ConsultantRoleTable({ roles }: Props) {
  return (
    <Table className='bg-background font-semibold'>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>Tên</TableHead>
          <TableHead>Mã quyền</TableHead>
          <TableHead>Ngày tạo</TableHead>
          <TableHead>Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {roles?.map((role) => (
          <TableRow key={role.id}>
            <TableCell>{role.id}</TableCell>
            <TableCell>{role.name}</TableCell>
            <TableCell>{role.roleId}</TableCell>
            <TableCell>{role.createdAt}</TableCell>
            <TableCell>
              <div className='flex items-center space-x-2'>
                <DialogConsultantRole role={role}>
                  <Edit2Icon className='size-4' strokeWidth={1.5} />
                </DialogConsultantRole>
                <DialogDeleteRoleConsultant role={role}>
                  <TrashIcon className='size-5 text-destructive' />
                </DialogDeleteRoleConsultant>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
