import FileItem from '@/components/dev/FileItem'
import QuestionImage from '@/components/dev/QuestionImage'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { CommonQuestion } from '@/types/question.type'
import { isImageFile } from '@/utils/utils'

interface Props {
  readonly children?: React.ReactNode
  readonly question: CommonQuestion
}

export default function DialogViewCommonQuestion({ children, question }: Props) {
  return (
    <Dialog>
      <DialogTrigger>{children}</DialogTrigger>
      <DialogContent className='p-6'>
        <DialogHeader>
          <DialogTitle>Chi tiết</DialogTitle>
        </DialogHeader>
        <div className='space-y-4 mt-4'>
          <p className='text-lg font-medium text-foreground'>{question.title}</p>
          <div className='text-foreground leading-relaxed' dangerouslySetInnerHTML={{ __html: question.content }}></div>

          {isImageFile(question?.fileName ?? '') ? (
            <div className='mt-4 -mx-4'>
              <QuestionImage url={question.fileName} />
            </div>
          ) : (
            <FileItem url={question?.fileName} />
          )}

          <div className='mt-6'>
            <blockquote className='border-l-4 border-gray-300 pl-4 italic text-foreground bg-background rounded-md p-4'>
              <div dangerouslySetInnerHTML={{ __html: question.answerContent }}></div>
            </blockquote>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
