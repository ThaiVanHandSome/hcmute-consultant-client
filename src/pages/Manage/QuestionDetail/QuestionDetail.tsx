import { answerTheQuestion, getDeleteLog, getQuestionById } from '@/apis/question.api'
import AvatarCustom from '@/components/dev/AvatarCustom'
import FileItem from '@/components/dev/FileItem'
import Editor from '@/components/dev/Form/Editor'
import QuestionImage from '@/components/dev/QuestionImage'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import path from '@/constants/path'
import { AppContext } from '@/contexts/app.context'
import { toast } from '@/hooks/use-toast'
import DialogDeleteQuestion from '@/pages/Manage/QuestionDetail/components/DialogDeleteQuestion'
import DialogForwardQuestion from '@/pages/Manage/QuestionDetail/components/DialogForwardQuestion'
import { Answer } from '@/types/question.type'
import { formatDate, isImageFile } from '@/utils/utils'
import { TrashIcon } from '@radix-ui/react-icons'
import { useMutation, useQuery } from '@tanstack/react-query'
import clsx from 'clsx'
import { AlertTriangleIcon, EllipsisVertical, ReplyIcon } from 'lucide-react'
import { useContext, useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router-dom'

export default function QuestionDetail() {
  const { user } = useContext(AppContext)
  const { id } = useParams()
  const navigate = useNavigate()

  const [showToAnswer, setShowToAnswer] = useState<boolean>(false)
  const [file, setFile] = useState<File>()
  const previewImage = useMemo(() => {
    return file ? URL.createObjectURL(file) : ''
  }, [file])

  const { data: questionResponse } = useQuery({
    queryKey: ['question', id],
    queryFn: () => getQuestionById(parseInt(id as string)),
    enabled: !!id
  })
  const question = questionResponse?.data.data

  const answerMutation = useMutation({
    mutationFn: ({ params, file }: { params: Answer; file: File }) => answerTheQuestion(params, file)
  })

  const { data: deleteLog } = useQuery({
    queryKey: ['deletion-log', id],
    queryFn: () => getDeleteLog(parseInt(id as string)),
    enabled: !!id
  })

  const form = useForm({
    defaultValues: {
      content: ''
    }
  })

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileFromLocal = event.target.files?.[0]
    setFile(fileFromLocal)
  }

  const handleOpenToAnswer = () => {
    setShowToAnswer(true)
  }

  const onSubmit = form.handleSubmit((values) => {
    if (!question || !values.content || !file) return
    values.content = `<div class="editor">${values.content}</div>`
    const params: Answer = {
      questionId: question?.id,
      content: values.content,
      title: 'answer',
      statusApproval: false
    }
    answerMutation.mutate(
      { params, file },
      {
        onSuccess: (res) => {
          toast({
            variant: 'success',
            description: res.data.message
          })
          navigate(path.manageQuestion)
        }
      }
    )
  })

  const onSubmitWithStatus = () => {
    form.handleSubmit((values) => {
      if (!question || !values.content || !file) return
      values.content = `<div class="editor">${values.content}</div>`
      const params: Answer = {
        questionId: question?.id,
        content: values.content,
        title: 'answer',
        statusApproval: true
      }
      answerMutation.mutate(
        { params, file },
        {
          onSuccess: (res) => {
            toast({
              variant: 'success',
              description: res.data.message
            })
            navigate(path.manageQuestion)
          }
        }
      )
    })()
  }

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
      <div className='font-semibold mb-3 text-2xl'>{question?.title}</div>
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
          <div className='size-9 flex items-center justify-center rounded-full hover:bg-secondary cursor-pointer'>
            <EllipsisVertical className='size-4 text-secondary-foreground' />
          </div>
        </div>
      </div>
      {deleteLog?.data && (
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
      )}

      <div className='bg-background px-6 rounded-lg shadow-xl flex items-center justify-center py-2'>
        <div className='w-2/3 bg-primary-bg px-4 py-2 rounded-xl'>
          <div dangerouslySetInnerHTML={{ __html: question?.content as string }}></div>
          {question?.fileName && (
            <>
              {isImageFile(question?.fileName ?? '') && (
                <div className='-mx-4'>
                  <QuestionImage url={question.fileName} />
                </div>
              )}
              {!isImageFile(question?.fileName ?? '') && <FileItem url={question?.fileName} />}
            </>
          )}
        </div>
      </div>
      {question && !!question.answerContent && (
        <div className='flex w-full max-w-full mt-3'>
          <AvatarCustom url={question.answerAvatarUrl} className='size-8 mr-2' />
          <div className='flex-1'>
            <div className='rounded-2xl bg-secondary text-secondary-foreground px-4 py-2'>
              <div className='font-bold text-sm'>
                {question.answerUserLastname} {question.answerUserFirstname}
              </div>
              <div dangerouslySetInnerHTML={{ __html: question.answerContent }} className='text-sm'></div>
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
          <Button onClick={handleOpenToAnswer}>Phản hồi</Button>
          <DialogForwardQuestion questionId={question?.id as number} />
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
                  <Editor control={form.control} name='content' />
                </div>
                <div className='grid w-full max-w-sm items-center gap-1.5'>
                  <Label htmlFor='file'>Tệp đính kèm</Label>
                  <Input id='file' type='file' onChange={handleFileChange} />
                  {(previewImage || file) && (
                    <img src={previewImage} alt='fileUploadImage' className='object-cover h-64' />
                  )}
                </div>
                <div className='flex items-center justify-between'>
                  <div className='flex items-center space-x-2'>
                    <Button isLoading={answerMutation.isPending} disabled={answerMutation.isPending}>
                      Gửi
                    </Button>
                    <Button
                      type='button'
                      variant='secondary'
                      isLoading={answerMutation.isPending}
                      disabled={answerMutation.isPending}
                      onClick={onSubmitWithStatus}
                    >
                      Preview
                    </Button>
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
