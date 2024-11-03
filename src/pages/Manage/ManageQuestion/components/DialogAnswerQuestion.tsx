import Editor from '@/components/dev/Form/Editor'
import Question from '@/components/dev/Question'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import { Form, FormLabel } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Question as QuestionType } from '@/types/question.type'
import { useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'

interface Props {
  readonly question: QuestionType
}

export default function DialogAnswerQuestion({ question }: Props) {
  const [open, setOpen] = useState<boolean>(false)
  const [file, setFile] = useState<File>()
  const previewImage = useMemo(() => {
    return file ? URL.createObjectURL(file) : ''
  }, [file])

  const form = useForm({
    defaultValues: {
      content: ''
    }
  })

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileFromLocal = event.target.files?.[0]
    setFile(fileFromLocal)
  }
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <div className='text-sm text-center w-full'>Trả lời câu hỏi</div>
      </DialogTrigger>
      <DialogContent className='min-w-[800px] max-h-[80vh] overflow-y-auto bg-primary-bg'>
        <Question question={question} />
        <div>
          <Form {...form}>
            <form className='space-y-4'>
              <div>
                <FormLabel>Trả lời câu hỏi</FormLabel>
                <Editor control={form.control} name='content' />
              </div>
              <div className='grid w-full max-w-sm items-center gap-1.5'>
                <Label htmlFor='file'>Tệp đính kèm</Label>
                <Input id='file' type='file' onChange={handleFileChange} />
                {(previewImage || file) && (
                  <img src={previewImage} alt='fileUploadImage' className='object-cover h-64' />
                )}
              </div>
              <Button className='w-full'>Gửi</Button>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  )
}
