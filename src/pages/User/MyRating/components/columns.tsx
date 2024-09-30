import path from '@/constants/path'
import { Rating } from '@/types/rating.type'
import { ColumnDef } from '@tanstack/react-table'

export const columns: ColumnDef<Rating>[] = [
  {
    accessorKey: 'consultant',
    header: 'Tên',
    cell: ({ row }) => (
      <div className='capitalize font-semibold'>
        {(row.getValue('consultant') as { id: number; name: string })?.name}
      </div>
    )
  },
  {
    accessorKey: 'department',
    header: 'Phòng ban',
    cell: ({ row }) => (
      <div className='capitalize font-semibold'>
        {(row.getValue('department') as { id: number; name: string })?.name}
      </div>
    )
  },
  {
    accessorKey: 'id',
    header: 'Xem chi tiết',
    cell: ({ row }) => (
      <a
        target='_blank'
        href={path.consultantEvaluation + '?id=' + row.getValue('id')}
        className='text-blue-500 underline italic'
      >
        Xem chi tiết
      </a>
    )
  }
]
