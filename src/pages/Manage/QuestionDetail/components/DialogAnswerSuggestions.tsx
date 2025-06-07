import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { useState } from 'react'
import { SparklesIcon } from 'lucide-react'

interface RecommendAnswerItem {
  answer: string
}

interface DialogAnswerSuggestionsProps {
  answers: RecommendAnswerItem[]
  onSelectAnswer: (answer: string) => void
  isLoading: boolean
}

export default function DialogAnswerSuggestions({ answers, onSelectAnswer, isLoading }: DialogAnswerSuggestionsProps) {
  const [open, setOpen] = useState(false)

  const handleSelectAnswer = (answer: string) => {
    onSelectAnswer(answer)
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant='secondary' type='button' className='flex items-center gap-1'>
          <SparklesIcon className='w-4 h-4' />
          <span>Câu trả lời gợi ý</span>
          {answers.length > 0 && (
            <span className='text-xs bg-primary text-white rounded-full px-2'>{answers.length}</span>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-2xl'>
        <DialogHeader>
          <DialogTitle>Câu trả lời gợi ý</DialogTitle>
          <DialogDescription>
            Chọn một câu trả lời mẫu để sử dụng hoặc điều chỉnh theo nhu cầu của bạn.
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className='py-8 flex justify-center items-center'>
            <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-primary'></div>
          </div>
        ) : answers.length === 0 ? (
          <div className='py-8 text-center text-muted-foreground'>
            Không có câu trả lời gợi ý. Hãy nhập nội dung câu hỏi để nhận gợi ý.
          </div>
        ) : (
          <div className='grid gap-3 py-4 max-h-96 overflow-y-auto'>
            {answers.map((answer, index) => (
              <div
                key={index}
                className='p-3 bg-secondary rounded-lg hover:bg-secondary/80 cursor-pointer'
                onClick={() => handleSelectAnswer(answer.answer)}
              >
                <div dangerouslySetInnerHTML={{ __html: answer.answer }} />
              </div>
            ))}
          </div>
        )}

        <DialogFooter>
          <Button variant='outline' onClick={() => setOpen(false)}>
            Đóng
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
