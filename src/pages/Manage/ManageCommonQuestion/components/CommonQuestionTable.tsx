import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import DialogCommonQuestion from '@/pages/Manage/ManageCommonQuestion/components/DialogCommonQuestion'
import DialogDeleteCommonQuestion from '@/pages/Manage/ManageCommonQuestion/components/DialogDeleteCommonQuestion'
import DialogViewCommonQuestion from '@/pages/Manage/ManageCommonQuestion/components/DialogViewCommonQuestion'
import { CommonQuestion } from '@/types/question.type'
import { TrashIcon } from '@radix-ui/react-icons'
import { Edit2Icon, EyeIcon } from 'lucide-react'

interface Props {
  readonly commonQuestions?: CommonQuestion[]
}

export default function CommonQuestionTable({ commonQuestions }: Props) {
  return (
    <div className='bg-background text-foreground rounded-md font-semibold'>
      <Table className='rounded-md'>
        <TableHeader className='bg-primary'>
          <TableRow>
            <TableHead className='!text-primary-foreground'>ID</TableHead>
            <TableHead className='!text-primary-foreground'>Khoa</TableHead>
            <TableHead className='!text-primary-foreground'>Tiêu đề</TableHead>
            <TableHead className='!text-primary-foreground'>Ngày tạo</TableHead>
            <TableHead className='!text-primary-foreground'>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {commonQuestions?.map((question) => (
            <TableRow key={question.commonQuestionId}>
              <TableCell>{question.commonQuestionId}</TableCell>
              <TableCell>{question.department?.name || 'Trống'}</TableCell>
              <TableCell>{question.title}</TableCell>
              <TableCell>{question.createdAt}</TableCell>
              <TableCell>
                <div className='flex items-center space-x-2'>
                  <DialogViewCommonQuestion question={question}>
                    <EyeIcon className='size-5' strokeWidth={1.5} />
                  </DialogViewCommonQuestion>
                  <DialogCommonQuestion question={question}>
                    <Edit2Icon className='size-4' strokeWidth={1.5} />
                  </DialogCommonQuestion>
                  <DialogDeleteCommonQuestion question={question}>
                    <TrashIcon className='size-5 text-destructive' />
                  </DialogDeleteCommonQuestion>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
