import { ConsultationType } from '@/types/consultant.type'
import { ColumnDef } from '@tanstack/react-table'

export const columns: ColumnDef<ConsultationType>[] = [
  {
    accessorKey: 'consultationSchedule',
    header: 'Tiêu đề',
    cell: ({ row }) => (
      <div className='capitalize '>{(row.getValue('consultationSchedule') as { title: string })?.title}</div>
    )
  },
  {
    accessorKey: 'registeredAt',
    header: 'Thời gian đăng ký',
    cell: ({ row }) => <div className='capitalize '>{row.getValue('registeredAt')}</div>
  },
  {
    accessorKey: 'action',
    header: 'Chi tiết',
    cell: ({ row }) => {
      const consultation: ConsultationType = row.original
      console.log(consultation)
      return (
        <a
          href={`/schedule-activities/${consultation.consultationSchedule.id}`}
          target='_blank'
          className='font-semibold underline italic text-primary'
        >
          Xem chi tiết
        </a>
      )
    }
  }
]
