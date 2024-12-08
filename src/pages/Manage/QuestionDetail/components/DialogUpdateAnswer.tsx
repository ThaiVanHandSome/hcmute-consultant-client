import { updateAnswer } from '@/apis/question.api'
import FileShow from '@/components/dev/FileShow'
import Editor from '@/components/dev/Form/Editor'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Form } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { MyAnswer, Question } from '@/types/question.type'
import { AnswerSchema } from '@/utils/rules'
import { useMutation } from '@tanstack/react-query'
import { useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import * as yup from 'yup'

interface Props {
  readonly question?: Question
  readonly children: React.ReactNode
  readonly refetch: any
}

type FormData = yup.InferType<typeof AnswerSchema>

export default function DialogUpdateAnswer({ question, children, refetch }: Props) {
  const form = useForm<FormData>({
    defaultValues: {
      content: question?.answerContent ?? ''
    }
  })

  const [open, setOpen] = useState<boolean>(false)
  const [file, setFile] = useState<File>()
  const previewImage = useMemo(() => {
    return file ? URL.createObjectURL(file) : question ? question?.fileName : ''
  }, [file, question])

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileFromLocal = event.target.files?.[0]
    setFile(fileFromLocal)
  }

  const updateAnswerMutation = useMutation({
    mutationFn: ({ params, file }: { params: MyAnswer; file: File }) => updateAnswer(params, file)
  })

  const onSubmit = form.handleSubmit((values) => {
    const params: MyAnswer = {
      answerId: question?.answerId as number,
      title: 'ANSWER',
      content: values.content,
      statusApproval: false
    }
    updateAnswerMutation.mutate(
      { params, file: file as File },
      {
        onSuccess: () => {
          refetch()
          setOpen(false)
        }
      }
    )
  })

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>{children}</DialogTrigger>
      <DialogContent className='max-h-[80vh] overflow-y-auto max-w-[800px]'>
        <DialogHeader>
          <DialogTitle>Chỉnh sửa câu trả lời</DialogTitle>
        </DialogHeader>
        <div>
          <Form {...form}>
            <form className='space-y-4' onSubmit={onSubmit}>
              <div>
                <Editor control={form.control} name='content' />
              </div>
              <div className='grid w-full max-w-sm itemPs-center gap-1.5'>
                <Label htmlFor='file'>Tệp đính kèm</Label>
                <Input id='file' type='file' onChange={handleFileChange} />
                {previewImage && <FileShow url={previewImage} />}
              </div>
              <div className='flex items-center justify-between'>
                <div className='flex items-center space-x-2'>
                  <Button isLoading={updateAnswerMutation.isPending} disabled={updateAnswerMutation.isPending}>
                    Lưu
                  </Button>
                </div>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  )
}
