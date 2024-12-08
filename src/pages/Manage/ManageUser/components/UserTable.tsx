import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import DialogUser from '@/pages/Manage/ManageUser/components/DialogUser'
import DialogViewUserDetail from '@/pages/Manage/ManageUser/components/DialogViewUserDetail'
import { AdminUser } from '@/types/user.type'
import { formatDate } from '@/utils/utils'
import { EyeOpenIcon } from '@radix-ui/react-icons'
import { Edit2Icon } from 'lucide-react'

interface Props {
  readonly users?: AdminUser[]
}

export default function UserTable({ users }: Props) {
  return (
    <div>
      <Table className='font-semibold bg-background'>
        <TableHeader className='bg-primary'>
          <TableRow>
            <TableHead className='!text-primary-foreground'>ID</TableHead>
            <TableHead className='!text-primary-foreground'>Username</TableHead>
            <TableHead className='!text-primary-foreground'>Email</TableHead>
            <TableHead className='!text-primary-foreground'>Khoa</TableHead>
            <TableHead className='!text-primary-foreground'>Role</TableHead>
            <TableHead className='!text-primary-foreground'>Hoạt động</TableHead>
            <TableHead className='!text-primary-foreground'>Trạng thái</TableHead>
            <TableHead className='!text-primary-foreground'></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users?.map((user) => (
            <TableRow key={user.id}>
              <TableCell>{user.id}</TableCell>
              <TableCell>{user.username}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user?.department?.name ?? 'Trống'}</TableCell>
              <TableCell>{user.role.name}</TableCell>
              <TableCell>{formatDate(user.lastActivity, true)}</TableCell>
              <TableCell>
                {user.isActivity ? (
                  <Badge variant='secondary'>Còn sử dụng</Badge>
                ) : (
                  <Badge variant='destructive'>Đã khóa</Badge>
                )}
              </TableCell>
              <TableCell>
                <div className='flex items-center space-x-2'>
                  <DialogViewUserDetail id={user.id}>
                    <EyeOpenIcon />
                  </DialogViewUserDetail>
                  <DialogUser user={user}>
                    <Edit2Icon className='size-4' strokeWidth={1.5} />
                  </DialogUser>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
