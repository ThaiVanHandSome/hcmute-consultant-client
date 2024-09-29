import { SchedualConsultant } from '@/types/consultant.type'
import { ColumnDef } from '@tanstack/react-table'

export const columns: ColumnDef<SchedualConsultant>[] = [
  {
    accessorKey: 'department',
    header: 'Khoa',
    cell: ({ row }) => (
      <div className='capitalize font-semibold'>
        {(row.getValue('department') as { id: number; name: string })?.name}
      </div>
    )
  },
  {
    accessorKey: 'consultantName',
    header: 'Tư vấn viên',
    cell: ({ row }) => <div className='capitalize font-semibold'>{row.getValue('consultantName')}</div>
  },
  {
    accessorKey: 'title',
    header: 'Tiêu đề',
    cell: ({ row }) => <div className='capitalize font-semibold'>{row.getValue('title')}</div>
  },
  {
    accessorKey: 'content',
    header: 'Nội dung',
    cell: ({ row }) => <div dangerouslySetInnerHTML={{ __html: row.getValue('content') }} />
  }
]
