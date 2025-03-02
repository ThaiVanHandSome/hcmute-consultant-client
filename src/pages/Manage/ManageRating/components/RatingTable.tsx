import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { RatingType } from '@/types/rating.type'

interface RatingTableProps {
  ratings?: RatingType[]
}

export default function RatingTable({ ratings }: RatingTableProps) {
  const headers = [
    'STT',
    'Họ và tên',
    'MSSV/MSGV',
    'Email',
    'Phòng/Khoa',
    'Chức vụ',
    'Số lượng đánh giá',
    'Mức hài lòng chung',
    'Kiến thức chuyên môn',
    'Thái độ phục vụ', 
    'Tốc độ phản hồi',
    'Khả năng nắm bắt vấn đề'
  ]

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            {headers.map((header) => (
              <TableHead key={header}>{header}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {ratings?.length ? (
            ratings.map((rating, index) => (
              <TableRow key={rating.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{rating.fullName}</TableCell>
                <TableCell>{rating.studentCode}</TableCell>
                <TableCell>{rating.email}</TableCell>
                <TableCell>{rating.department}</TableCell>
                <TableCell>{rating.role}</TableCell>
                <TableCell>{rating.ratingCount}</TableCell>
                <TableCell>{(rating.generalSatisfaction * 2).toFixed(2)}</TableCell>
                <TableCell>{(rating.expertiseKnowledge * 2).toFixed(2)}</TableCell>
                <TableCell>{(rating.attitude * 2).toFixed(2)}</TableCell>
                <TableCell>{(rating.responseSpeed * 2).toFixed(2)}</TableCell>
                <TableCell>{(rating.understanding * 2).toFixed(2)}</TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={12} className="h-24 text-center">
                Không có dữ liệu
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
} 