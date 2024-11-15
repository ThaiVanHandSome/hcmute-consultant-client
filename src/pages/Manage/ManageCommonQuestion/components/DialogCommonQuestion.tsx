import { updateAdminCommonQuestion } from '@/apis/question.api'
import Editor from '@/components/dev/Form/Editor'
import InputCustom from '@/components/dev/Form/InputCustom'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Form } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from '@/hooks/use-toast'
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
  const previewImage = useMemo(() => {
    if (isImageFile((file?.name as string) ?? '')) return file ? URL.createObjectURL(file) : (question?.fileName ?? '')
  }, [file])

  const form = useForm<CommonQuesionFormData>({
    defaultValues: {
      title: question?.title ?? '',
      content: question?.content ?? '',
      answerTitle: question?.answerTitle ?? '',
      answerContent: question?.answerContent ?? ''
    },
    resolver: yupResolver(CommonQuestionSchema)
  })

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileFromLocal = event.target.files?.[0]
    setFile(fileFromLocal)
  }

  const updateCommonQuestionMutation = useMutation({
    mutationFn: ({
      commonQuestionId,
      data,
      file
    }: {
      commonQuestionId: number
      data: CommonQuesionFormData
      file: File
    }) => updateAdminCommonQuestion(commonQuestionId, data, file)
  })

  const onSubmit = form.handleSubmit((values) => {
    if (isUpdate) {
      const commonQuestionId = question.commonQuestionId
      updateCommonQuestionMutation.mutate(
        { commonQuestionId, data: values, file: file as File },
        {
          onSuccess: (res) => {
            toast({
              variant: 'success',
              description: res.data.message
            })
            queryClient.invalidateQueries({
              queryKey: ['common-questions', commonQuestionQueryConfig]
            })
            setOpen(false)
          }
        }
      )
    }
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
              <InputCustom
                control={form.control}
                name='answerTitle'
                placeholder='Nhập tiêu đề câu trả lời'
                label='Tiêu đề câu trả lời'
              />
              <Editor control={form.control} name='answerContent' label='Nội dung câu câu trả lời' />
              <div className='mb-4'>
                <div className='grid w-full max-w-sm items-center gap-1.5'>
                  <Label htmlFor='file'>Tệp đính kèm</Label>
                  <Input id='file' type='file' onChange={handleFileChange} />
                  {previewImage && <img src={previewImage} alt='fileUploadImage' className='object-cover h-64' />}
                </div>
              </div>
              <Button>{isUpdate ? 'Lưu' : 'Thêm'}</Button>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  )
}
