import { Button } from '@/components/ui/button'
import { Consultant } from '@/types/consultant.type'
import { CaretSortIcon } from '@radix-ui/react-icons'
import { ColumnDef } from '@tanstack/react-table'

export const columns: ColumnDef<Consultant>[] = [
  {
    accessorKey: 'name',
    header: 'Họ tên',
    cell: ({ row }) => <div className='capitalize font-semibold'>{row.getValue('name')}</div>
  },
  {
    accessorKey: 'phoneNumber',
    header: 'Số điện thoại',
    cell: ({ row }) => <div className='capitalize'>{row.getValue('phoneNumber')}</div>
  },
  {
    accessorKey: 'email',
    header: ({ column }) => {
      return (
        <Button variant='ghost' onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          Email
          <CaretSortIcon className='ml-2 h-4 w-4' />
        </Button>
      )
    },
    cell: ({ row }) => <div className='lowercase'>{row.getValue('email')}</div>
  },
  {
    accessorKey: 'avatar',
    header: 'Ảnh đại diện',
    cell: ({ row }) => <img src={row.original.avatar} alt='Avatar' className='h-10 w-10 rounded-full object-cover' />
  },
  {
    accessorKey: 'department',
    header: 'Khoa',
    cell: ({ row }) => <div className='capitalize'>{row.getValue('department')}</div>
  }
]
