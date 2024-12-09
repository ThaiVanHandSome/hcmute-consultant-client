import FileShow from '@/components/dev/FileShow'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { CommonQuestion } from '@/types/question.type'

interface Props {
  readonly children?: React.ReactNode
  readonly question: CommonQuestion
}

export default function DialogViewCommonQuestion({ children, question }: Props) {
  return (
    <Dialog>
      <DialogTrigger>{children}</DialogTrigger>
      <DialogContent className='p-6 max-h-[90vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle>Chi tiết</DialogTitle>
        </DialogHeader>
        <div className='space-y-4 mt-4'>
          <p className='text-lg font-medium text-foreground'>{question.title}</p>
          <div className='text-foreground leading-relaxed' dangerouslySetInnerHTML={{ __html: question.content }}></div>

          <FileShow url={question.file} />

          <div className='mt-6'>
            <blockquote className='border-l-4 border-gray-300 pl-4 italic text-foreground bg-background rounded-md p-4'>
              <Label className='text-sm font-semibold mb-3'>Câu trả lời</Label>
              <p className='text-lg font-medium text-foreground'>{question.answerTitle}</p>
              <div dangerouslySetInnerHTML={{ __html: question.answerContent }}></div>
              <FileShow url={question.fileAnswer} />
            </blockquote>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
