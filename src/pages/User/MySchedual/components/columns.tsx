import DialogViewSchedualDetail from '@/pages/User/MySchedual/components/DialogViewSchedualDetail'
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
    accessorKey: 'mode',
    header: 'Hình thức',
    cell: ({ row }) => <div className='capitalize '>{row.getValue('mode') ? 'Online' : 'Offline'}</div>
  },
  {
    accessorKey: 'statusPublic',
    header: 'Trạng thái',
    cell: ({ row }) => <div className='capitalize '>{row.getValue('statusPublic') ? 'Công khai' : 'Riêng tư'}</div>
  },
  {
    accessorKey: 'title',
    header: 'Tiêu đề',
    cell: ({ row }) => <div className='capitalize '>{row.getValue('title')}</div>
  },
  {
    accessorKey: 'action',
    header: '',
    cell: ({ row }) => {
      const schedual: SchedualConsultant = row.original
      return <DialogViewSchedualDetail schedule={schedual} />
    }
  }
]
