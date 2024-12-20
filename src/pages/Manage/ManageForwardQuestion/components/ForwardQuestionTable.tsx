import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import DialogDeleteForwardQuestion from '@/pages/Manage/ManageForwardQuestion/components/DialogDeleteForwardQuestion'
import DialogForwardQuestion from '@/pages/Manage/ManageForwardQuestion/components/DialogForwardQuestion'
import { ForwardQuestion } from '@/types/question.type'
import { TrashIcon } from '@radix-ui/react-icons'
import { Edit2Icon } from 'lucide-react'

interface Props {
  readonly forwardQuestions?: ForwardQuestion[]
}

export default function ForwardQuestionTable({ forwardQuestions }: Props) {
  return (
    <Table className='bg-background font-semibold'>
      <TableHeader>
        <TableRow className='bg-primary !text-primary-foreground'>
          <TableHead className='!text-primary-foreground'>ID</TableHead>
          <TableHead className='!text-primary-foreground'>Chuyển đến</TableHead>
          <TableHead className='!text-primary-foreground'>Tiêu đề</TableHead>
          <TableHead className='!text-primary-foreground'>Tư vấn viên</TableHead>
          <TableHead className='!text-primary-foreground'>Thời gian</TableHead>
          {/* <TableHead className='!text-primary-foreground'>Câu hỏi</TableHead> */}
          <TableHead className='!text-primary-foreground'></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {forwardQuestions?.map((question) => (
          <TableRow key={question.id}>
            <TableCell>{question.id}</TableCell>
            <TableCell>{question.toDepartment.name}</TableCell>
            <TableCell>{question.title}</TableCell>
            <TableCell>{question.consultant.name}</TableCell>
            <TableCell>{question.createdAt}</TableCell>
            {/* <TableCell>
              <a
                className='underline italic text-primary'
                href={`/manage/questions/detail/${question.questionId}`}
                target='_blank'
              >
                {question.questionId}
              </a>
            </TableCell> */}
            <TableCell>
              <div className='flex items-center space-x-2'>
                <DialogForwardQuestion forwardQuestion={question}>
                  <Edit2Icon className='size-4' strokeWidth={1.5} />
                </DialogForwardQuestion>
                <DialogDeleteForwardQuestion forwardQuestion={question}>
                  <TrashIcon className='size-5 text-destructive' />
                </DialogDeleteForwardQuestion>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
