import { createAdminCommonQuestion, updateAdminCommonQuestion } from '@/apis/question.api'
import FileShow from '@/components/dev/FileShow'
import Editor from '@/components/dev/Form/Editor'
import InputCustom from '@/components/dev/Form/InputCustom'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Form } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import useCommonQuestionQueryConfig from '@/hooks/useCommonQuestionQueryConfig'
import { CommonQuestion } from '@/types/question.type'
import { CommonQuestionSchema } from '@/utils/rules'
import { isImageFile } from '@/utils/utils'
import { yupResolver } from '@hookform/resolvers/yup'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import * as yup from 'yup'

interface Props {
  readonly question?: CommonQuestion
  readonly children: React.ReactNode
}

export type CommonQuesionFormData = yup.InferType<typeof CommonQuestionSchema>

export default function DialogCommonQuestion({ question, children }: Props) {
  const [open, setOpen] = useState<boolean>(false)
  const isUpdate = !!question

  const queryClient = useQueryClient()
  const commonQuestionQueryConfig = useCommonQuestionQueryConfig()
  const [file, setFile] = useState<File>()
  const [fileAnswer, setFileAnswer] = useState<File>()

  const previewImageAsk = useMemo(() => {
    if (isImageFile((file?.name as string) ?? '')) return file ? URL.createObjectURL(file) : (question?.file ?? '')
  }, [file])

  const previewImageAnswer = useMemo(() => {
    if (isImageFile((fileAnswer?.name as string) ?? ''))
      return fileAnswer ? URL.createObjectURL(fileAnswer) : (question?.fileAnswer ?? '')
  }, [fileAnswer])

  const form = useForm<CommonQuesionFormData>({
    defaultValues: {
      title: question?.title ?? '',
      content: question?.content ?? '',
      answerTitle: question?.answerTitle ?? '',
      answerContent: question?.answerContent ?? ''
    },
    resolver: yupResolver(CommonQuestionSchema)
  })

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, type: 'answer' | 'ask') => {
    const fileFromLocal = event.target.files?.[0]
    if (type === 'ask') {
      setFile(fileFromLocal)
      return
    }
    setFileAnswer(fileFromLocal)
  }

  const updateCommonQuestionMutation = useMutation({
    mutationFn: ({
      commonQuestionId,
      data,
      file,
      fileAnswer
    }: {
      commonQuestionId: number
      data: CommonQuesionFormData
      file: File
      fileAnswer: File
    }) => updateAdminCommonQuestion(commonQuestionId, data, file, fileAnswer)
  })

  const createCommonQuestionMutation = useMutation({
    mutationFn: ({ data, file, fileAnswer }: { data: CommonQuesionFormData; file: File; fileAnswer: File }) =>
      createAdminCommonQuestion(data, file, fileAnswer)
  })

  const onSubmit = form.handleSubmit((values) => {
    if (isUpdate) {
      const commonQuestionId = question.commonQuestionId
      updateCommonQuestionMutation.mutate(
        { commonQuestionId, data: values, file: file as File, fileAnswer: fileAnswer as File },
        {
          onSuccess: (res) => {
            toast.success(res.data.message)
            queryClient.invalidateQueries({
              queryKey: ['common-questions', commonQuestionQueryConfig]
            })
            setOpen(false)
          }
        }
      )
      return
    }
    createCommonQuestionMutation.mutate(
      { data: values, file: file as File, fileAnswer: fileAnswer as File },
      {
        onSuccess: (res) => {
          toast.success(res.data.message)
          queryClient.invalidateQueries({
            queryKey: ['common-questions', commonQuestionQueryConfig]
          })
          setOpen(false)
        }
      }
    )
  })

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>{children}</DialogTrigger>
      <DialogContent className='max-h-[90vh] overflow-y-auto max-w-[800px]'>
        <DialogHeader>
          <DialogTitle>{isUpdate ? 'Chỉnh sửa câu hỏi chung' : 'Thêm câu hỏi chung'}</DialogTitle>
        </DialogHeader>
        <div>
          <Form {...form}>
            <form onSubmit={onSubmit}>
              <InputCustom
                control={form.control}
                name='title'
                placeholder='Nhập tiêu đề câu hỏi'
                label='Tiêu đề câu hỏi'
              />
              <Editor control={form.control} name='content' label='Nội dung câu hỏi' />
              <div className='mb-4'>
                <div className='grid w-full max-w-sm items-center gap-1.5'>
                  <Label htmlFor='file'>Tệp đính kèm câu hỏi</Label>
                  <Input
                    id='file'
                    type='file'
                    onChange={(e) => handleFileChange(e, 'ask')}
                    accept='.jpg,.jpeg,.png,.gif'
                  />
                  {previewImageAsk && <img src={previewImageAsk} alt='fileUploadImage' className='object-cover h-64' />}
                  {!previewImageAsk && <FileShow url={question?.file} />}
                </div>
              </div>
              <InputCustom
                control={form.control}
                name='answerTitle'
                placeholder='Nhập tiêu đề câu trả lời'
                label='Tiêu đề câu trả lời'
              />
              <Editor control={form.control} name='answerContent' label='Nội dung câu câu trả lời' />
              <div className='mb-4'>
                <div className='grid w-full max-w-sm items-center gap-1.5'>
                  <Label htmlFor='file'>Tệp đính kèm câu trả lời</Label>
                  <Input
                    id='file'
                    type='file'
                    onChange={(e) => handleFileChange(e, 'answer')}
                    accept='.jpg,.jpeg,.png,.gif'
                  />
                  {previewImageAnswer && (
                    <img src={previewImageAnswer} alt='fileUploadImage' className='object-cover h-64' />
                  )}
                  {!previewImageAnswer && <FileShow url={question?.fileAnswer} />}
                </div>
              </div>
              <Button
                disabled={updateCommonQuestionMutation.isPending || createCommonQuestionMutation.isPending}
                isLoading={updateCommonQuestionMutation.isPending || createCommonQuestionMutation.isPending}
              >
                {isUpdate ? 'Lưu' : 'Thêm'}
              </Button>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  )
}
