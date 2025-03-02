import { ColumnDef } from '@tanstack/react-table'

export type Rating = {
  id: number
  fullName: string
  studentCode: string
  email: string
  department: string
  role: string
  ratingCount: number
  generalSatisfaction: number
  expertiseKnowledge: number
  attitude: number
  responseSpeed: number
  understanding: number
}

export const columns: ColumnDef<Rating>[] = [
  {
    accessorKey: 'stt',
    header: 'STT',
    cell: ({ row }) => row.index + 1
  },
  {
    accessorKey: 'fullName',
    header: 'Họ và tên'
  },
  {
    accessorKey: 'studentCode',
    header: 'MSSV/MSGV'
  },
  {
    accessorKey: 'email',
    header: 'Email'
  },
  {
    accessorKey: 'department',
    header: 'Phòng/Khoa'
  },
  {
    accessorKey: 'role',
    header: 'Chức vụ'
  },
  {
    accessorKey: 'ratingCount',
    header: 'Số lượng đánh giá'
  },
  {
    accessorKey: 'generalSatisfaction',
    header: 'Mức hài lòng chung',
    cell: ({ row }) => (row.getValue('generalSatisfaction') as number).toFixed(2)
  },
  {
    accessorKey: 'expertiseKnowledge',
    header: 'Kiến thức chuyên môn',
    cell: ({ row }) => (row.getValue('expertiseKnowledge') as number).toFixed(2)
  },
  {
    accessorKey: 'attitude',
    header: 'Thái độ phục vụ',
    cell: ({ row }) => (row.getValue('attitude') as number).toFixed(2)
  },
  {
    accessorKey: 'responseSpeed',
    header: 'Tốc độ phản hồi',
    cell: ({ row }) => (row.getValue('responseSpeed') as number).toFixed(2)
  },
  {
    accessorKey: 'understanding',
    header: 'Khả năng nắm bắt vấn đề',
    cell: ({ row }) => (row.getValue('understanding') as number).toFixed(2)
  }
] 