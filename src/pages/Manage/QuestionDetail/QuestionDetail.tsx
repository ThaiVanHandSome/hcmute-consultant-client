import { answerTheQuestion, approvalAnswer, getDeleteLog, getQuestionById } from '@/apis/question.api'
import AvatarCustom from '@/components/dev/AvatarCustom'
import FileShow from '@/components/dev/FileShow'
import Editor from '@/components/dev/Form/Editor'
import { useRecommendAnswers } from '@/components/dev/QuestionForm/hooks/useRecommendAnswers'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Form } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import path from '@/constants/path'
import { ROLE, Role } from '@/constants/role'
import { AppContext } from '@/contexts/app.context'
import { toast } from 'sonner'
import useQueryParams from '@/hooks/useQueryParams'
import DialogBanUser from '@/pages/Manage/QuestionDetail/components/DialogBanUser'
import DialogConvertToCommonQuestion from '@/pages/Manage/QuestionDetail/components/DialogConvertToCommonQuestion'
import DialogDeleteAnswer from '@/pages/Manage/QuestionDetail/components/DialogDeleteAnswer'
import DialogDeleteQuestion from '@/pages/Manage/QuestionDetail/components/DialogDeleteQuestion'
import DialogForwardQuestion from '@/pages/Manage/QuestionDetail/components/DialogForwardQuestion'
import DialogUpdateAnswer from '@/pages/Manage/QuestionDetail/components/DialogUpdateAnswer'
import DialogAnswerSuggestions from '@/pages/Manage/QuestionDetail/components/DialogAnswerSuggestions'
import { Answer } from '@/types/question.type'
import { formatDate } from '@/utils/utils'
import { TrashIcon } from '@radix-ui/react-icons'
import { useMutation, useQuery } from '@tanstack/react-query'
import clsx from 'clsx'
import { AlertTriangleIcon, BanIcon, EllipsisIcon, ReplyIcon } from 'lucide-react'
import { useContext, useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router-dom'

export default function QuestionDetail() {
  const { user, role } = useContext(AppContext)
  const { id } = useParams()
  const { status } = useQueryParams()
  const isApproval = status === 'APPROVAL'
  const navigate = useNavigate()

  const [showToAnswer, setShowToAnswer] = useState<boolean>(false)
  const [file, setFile] = useState<File>()
  const [questionPlainText, setQuestionPlainText] = useState<string>('')

  const { data: questionResponse, refetch } = useQuery({
    queryKey: ['question', id],
    queryFn: () => getQuestionById(parseInt(id as string)),
    enabled: !!id
  })
  const question = questionResponse?.data.data

  // Trích xuất plain text khi câu hỏi được tải
  useEffect(() => {
    if (question?.content) {
      // Loại bỏ các thẻ HTML
      const plainText = question.content.replace(/<[^>]+>/g, '').trim()
      setQuestionPlainText(plainText)
    }
  }, [question])

  // Hook gợi ý câu trả lời
  const { recommendedAnswers, isLoading: isLoadingAnswers, fetchRecommendedAnswers } = useRecommendAnswers()

  // Gọi API gợi ý câu trả lời khi có plain text
  useEffect(() => {
    if (questionPlainText) {
      fetchRecommendedAnswers(questionPlainText)
    }
  }, [questionPlainText, fetchRecommendedAnswers])

  const previewImage = useMemo(() => {
    return file ? URL.createObjectURL(file) : isApproval ? question?.fileName : ''
  }, [file, question])

  const answerMutation = useMutation({
    mutationFn: ({ params, file }: { params: Answer; file: File }) => answerTheQuestion(params, file)
  })

  const approvalAnswerMutation = useMutation({
    mutationFn: ({ questionId, content, file }: { questionId: number; content: string; file: File }) =>
      approvalAnswer(questionId, content, file)
  })

  const { data: deleteLog } = useQuery({
    queryKey: ['deletion-log', id],
    queryFn: () => getDeleteLog(parseInt(id as string)),
    enabled: !!id
  })

  const form = useForm({
    defaultValues: {
      content: isApproval ? question?.answerContent : ''
    }
  })

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileFromLocal = event.target.files?.[0]
    setFile(fileFromLocal)
  }

  const handleOpenToAnswer = () => {
    setShowToAnswer(true)
  }

  // Hàm xử lý khi người dùng chọn một câu trả lời gợi ý
  const handleSelectAnswer = (answer: string) => {
    form.setValue('content', answer)
    toast.success('Đã thêm câu trả lời mẫu vào editor', { duration: 1500 })
  }

  // Xử lý thay đổi nội dung câu trả lời
  const handleEditorChange = () => {
    // Khi người dùng nhập nội dung, có thể thêm logic ở đây nếu cần
  }

  const onSubmit = form.handleSubmit((values) => {
    if (!isApproval) {
      values.content = `<div class="editor">${values.content}</div>`
      const params: Answer = {
        questionId: question?.id as number,
        content: values.content,
        title: 'answer',
        statusApproval: false
      }
      answerMutation.mutate(
        { params, file: file as File },
        {
          onSuccess: (res) => {
            toast.success(res.data.message)
            navigate(path.manageQuestion)
          }
        }
      )
      return
    }
    const payload = {
      questionId: question?.id as number,
      content: values.content as string,
      file: file as File
    }
    approvalAnswerMutation.mutate(payload, {
      onSuccess: (res) => {
        toast.success(res.data.message)
        navigate(path.manageApprovalAnswer)
      }
    })
  })

  const onSubmitWithStatus = () => {
    form.handleSubmit((values) => {
      if (!question || !values.content) return
      values.content = `<div class="editor">${values.content}</div>`
      const params: Answer = {
        questionId: question?.id,
        content: values.content,
        title: 'answer',
        statusApproval: true
      }
      answerMutation.mutate(
        { params, file: file as File },
        {
          onSuccess: (res) => {
            toast.success(res.data.message)
            navigate(path.manageQuestion)
          }
        }
      )
    })()
  }

  useEffect(() => {
    if (!isApproval) return
    if (!form.watch('content') && question) {
      form.setValue('content', question.answerContent)
    }
  }, [question, isApproval])

  useEffect(() => {
    if (showToAnswer) {
      window.scrollTo({
        top: document.body.scrollHeight,
        behavior: 'smooth'
      })
    }
  }, [showToAnswer])

  return (
    <div>
      <div className='font-semibold mb-3 text-2xl break-words'>{question?.title}</div>
      <div className='flex items-center justify-between mb-4'>
        <div className='flex items-center space-x-2'>
          <AvatarCustom url={question?.askerAvatarUrl} className='size-7' />
          <p className='font-bold text-sm'>
            {question?.askerLastname} {question?.askerFirstname}
          </p>
          <div className='text-sm italic'>{question?.createdAt}</div>
        </div>
        <div className='flex items-center space-x-2'>
          <div
            aria-hidden='true'
            onClick={handleOpenToAnswer}
            className='size-9 flex items-center justify-center rounded-full hover:bg-secondary cursor-pointer'
          >
            <ReplyIcon className='size-4 text-secondary-foreground' />
          </div>
          <DialogBanUser question={question}>
            <div className='size-9 flex items-center justify-center rounded-full bg-destructive text-destructive-foreground'>
              <BanIcon className='size-4' />
            </div>
          </DialogBanUser>
        </div>
      </div>
      {deleteLog?.data?.data?.reason != null ? (
        <div className='bg-red-100 text-red-700 px-6 py-4 shadow-lg rounded-lg flex items-start gap-2 mb-3'>
          <AlertTriangleIcon className='w-5 h-5 text-red-700 mt-1' />
          <div>
            <span className='font-semibold block'>Lý do bị xóa: {deleteLog.data.data.reason}</span>
            <div className='text-sm text-red-600 mt-1'>
              <span>
                <b>Người xóa:</b> {deleteLog.data.data.deletedBy}
              </span>
              <span className='ml-4'>
                <b>Thời gian xóa:</b> {new Date(deleteLog.data.data.deletedAt).toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      ) : (
        <div className='text-sm text-gray-500'></div>
      )}

      {question?.forwardQuestionDTO && (
        <div className='bg-secondary text-secondary-foreground px-6 py-4 shadow-lg rounded-lg flex items-start gap-2 mb-3'>
          <div className='w-5 h-5 flex-shrink-0 text-primary mt-1'>
            <svg xmlns='http://www.w3.org/2000/svg' className='h-5 w-5' viewBox='0 0 20 20' fill='currentColor'>
              <path
                fillRule='evenodd'
                d='M18 10A8 8 0 112 10a8 8 0 0116 0zm-8-3a1 1 0 100-2 1 1 0 000 2zm-1 8a1 1 0 102 0V9a1 1 0 10-2 0v6z'
                clipRule='evenodd'
              />
            </svg>
          </div>
          <div>
            <span className='font-semibold block text-md'>{question?.forwardQuestionDTO.title}</span>

            <div className='text-sm mt-1'>
              <div className='text-primary'>
                <b>Chuyển từ:</b> {question?.forwardQuestionDTO.fromDepartment.name}
              </div>
              <div className='text-primary mt-1'>
                <b>Chuyển đến:</b> {question?.forwardQuestionDTO.toDepartment.name}
              </div>
              <div className='text-primary mt-1'>
                <b>Tư vấn viên thực hiện:</b> {question?.forwardQuestionDTO.consultant.name}
              </div>
              <div className='text-primary mt-1'>
                <b>Thời gian chuyển tiếp:</b> {question?.forwardQuestionDTO.createdAt}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className='bg-background px-6 rounded-lg shadow-xl flex items-center justify-center py-2'>
        <div className='w-2/3 bg-primary-bg px-4 py-2 rounded-xl'>
          <div dangerouslySetInnerHTML={{ __html: question?.content as string }}></div>
          {question?.fileName && <FileShow url={question?.fileName} />}
        </div>
      </div>
      {question && !!question.answerContent && (  
        <div className='flex w-full max-w-full mt-3'>
          <AvatarCustom url={question.answerAvatarUrl} className='size-8 mr-2' />
          <div className='flex-1'>
            <div className='flex items-center space-x-1'>
              <div className='flex-1 rounded-2xl bg-secondary text-secondary-foreground px-4 py-2'>
                <div className='font-bold text-sm'>
                  {question.answerUserLastname} {question.answerUserFirstname}
              </div>
                <div dangerouslySetInnerHTML={{ __html: question.answerContent }} className='text-sm'></div>
              </div>
              <div>
                <DropdownMenu>
                  <DropdownMenuTrigger>
                    <EllipsisIcon className='size-4' />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className='px-2 flex flex-col items-start'>
                    <DialogUpdateAnswer question={question} refetch={refetch}>
                      <span className='font-semibold text-sm'>Chỉnh sửa</span>
                    </DialogUpdateAnswer>
                    <DialogDeleteAnswer question={question} refetch={refetch}>
                      <span className='font-semibold text-sm text-destructive'>Xóa</span>
                    </DialogDeleteAnswer>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
            <div className='text-[10px] ml-4'>{formatDate(question.answerCreatedAt)}</div>
          </div>
        </div>
      )}

      <div
        className={clsx('flex items-center justify-between space-x-2 mt-4', {
          hidden: showToAnswer
        })}
      >
        <div className='space-x-2'>
          <Button onClick={handleOpenToAnswer}>{isApproval ? 'Đánh giá' : 'Phản hồi'}</Button>
          {!isApproval && <DialogForwardQuestion questionId={question?.id as number} />}
          {[ROLE.admin as Role, ROLE.advisor as Role].includes(role as Role) && (
            <DialogConvertToCommonQuestion question={question}>
              <Button type='button' variant='secondary'>
                Chuyển thành câu hỏi chung
              </Button>
            </DialogConvertToCommonQuestion>
          )}
        </div>
        <DialogDeleteQuestion questionId={parseInt(id as string)} />
      </div>
      {showToAnswer && (
        <div className='mt-4 flex gap-2'>
          <AvatarCustom url={user?.avatarUrl} />
          <div className='flex-1 bg-background px-4 py-2 rounded-xl shadow-xl'>
            <Form {...form}>
              <form className='space-y-4' onSubmit={onSubmit}>
                <div>
                  <Editor control={form.control} name='content' onChange={handleEditorChange} />
                </div>
                <div className='grid w-full max-w-sm items-center gap-1.5'>
                  <Label htmlFor='file'>Tệp đính kèm</Label>
                  <Input id='file' type='file' onChange={handleFileChange} />
                  {previewImage && <FileShow url={previewImage} />}
                </div>
                <div className='flex items-center justify-between'>
                  <div className='flex items-center space-x-2'>
                    <Button
                      isLoading={answerMutation.isPending || approvalAnswerMutation.isPending}
                      disabled={answerMutation.isPending || approvalAnswerMutation.isPending}
                    >
                      {!isApproval ? 'Gửi' : 'Phê duyệt'}
                    </Button>
                    {!isApproval && (
                      <>
                        <Button
                          type='button'
                          variant='secondary'
                          isLoading={answerMutation.isPending}
                          disabled={answerMutation.isPending}
                          onClick={onSubmitWithStatus}
                        >
                          Preview
                        </Button>
                        <DialogAnswerSuggestions
                          answers={recommendedAnswers}
                          onSelectAnswer={handleSelectAnswer}
                          isLoading={isLoadingAnswers}
                        />
                      </>
                    )}
                  </div>
                  <div aria-hidden='true' onClick={() => setShowToAnswer(false)} className='cursor-pointer'>
                    <TrashIcon className='size-5' />
                  </div>
                </div>
              </form>
            </Form>
          </div>
        </div>
      )}
    </div>
  )
}
