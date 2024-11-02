import { deleteQuestion, getAllQuestion } from '@/apis/question.api'
import PaginationCustom from '@/components/dev/PaginationCustom'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import path from '@/constants/path'
import useQuestionQueryConfig, { QuestionQueryConfig } from '@/hooks/useQuestionQueryConfig'
import { Question as QuestionType } from '@/types/question.type'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import NoDataIcon from '@/assets/images/utils/no-data.png'
import QuestionStatisticView from '@/components/dev/QuestionStatisticView/QuestionStatisticView'
import { toast } from '@/hooks/use-toast'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import Question from '@/components/dev/Question'
import QuestionForm from '@/components/dev/QuestionForm'
import QuestionFilter from '@/components/dev/QuestionFilter'

export const dialogViewType = {
  detail: 'detail',
  deleteConfirm: 'delete-confirm',
  updateQuestion: 'update-question'
} as const

export default function MyQuestion() {
  const queryConfig: QuestionQueryConfig = useQuestionQueryConfig()

  // dialog
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [dialogView, setDialogView] = useState<string>('')
  const [questionActive, setQuestionActive] = useState<QuestionType>()

  const openDialog = (type: string) => {
    setIsOpen(true)
    setDialogView(type)
  }

  const { data: questionsOfUser, refetch } = useQuery({
    queryKey: ['questions', queryConfig],
    queryFn: () => getAllQuestion(queryConfig)
  })

  const deleteQuestionMutation = useMutation({
    mutationFn: (id: number) => deleteQuestion(id)
  })

  const handleDeleteQuestion = () => {
    if (!questionActive?.id) return
    deleteQuestionMutation.mutate(questionActive?.id, {
      onSuccess: (res) => {
        toast({
          variant: 'success',
          description: res.data.message
        })
        refetch()
      }
    })
    setIsOpen(false)
  }

  const renderConfirmDeleteQuestion = () => (
    <div>
      <p>Bạn chắc chắn muốn xóa câu hỏi này chứ?</p>
      <Separator className='my-2' />
      <div className='px-2'>
        <div className='text-blue-600 font-semibold text-sm'>#{questionActive?.department.name}</div>
        <div className='mb-3 text-blue-600 font-semibold text-sm'>#{questionActive?.field.name}</div>
        <div className='font-semibold text-md italic mb-2'>🎯 {questionActive?.title}</div>
      </div>
      <div className='flex justify-end'>
        <Button onClick={() => setIsOpen(false)}>Hủy</Button>
        <Button
          disabled={deleteQuestionMutation.isPending}
          isLoading={deleteQuestionMutation.isPending}
          variant='destructive'
          className='ml-3 px-4 flex-shrink-0'
          onClick={handleDeleteQuestion}
        >
          Xóa
        </Button>
      </div>
    </div>
  )

  return (
    <div>
      <div>
        <div className='mb-6'>
          <QuestionFilter queryConfig={queryConfig} path={path.myQuestions} />
        </div>
        <Separator className='my-8' />
        <div>
          {!questionsOfUser && (
            <div className='flex items-center justify-center'>
              <img src={NoDataIcon} alt='no-data' className='size-48' />
            </div>
          )}
          {questionsOfUser?.data.data.content.map((question) => (
            <QuestionStatisticView
              key={question.id}
              question={question}
              openDialog={openDialog}
              setQuestionActive={setQuestionActive}
            />
          ))}
        </div>
        {questionsOfUser && (
          <PaginationCustom
            path={path.myQuestions}
            queryConfig={queryConfig}
            pageSize={questionsOfUser?.data.data.totalPages}
          />
        )}
      </div>
      {/* show detail question */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className='min-w-[800px] w-[800px] max-w-[800px] max-h-[80vh] overflow-y-auto mt-8'>
          {dialogView === dialogViewType.detail && <Question question={questionActive as QuestionType} />}
          {dialogView === dialogViewType.updateQuestion && <QuestionForm question={questionActive} />}
          {dialogView === dialogViewType.deleteConfirm && renderConfirmDeleteQuestion()}
        </DialogContent>
      </Dialog>
    </div>
  )
}
