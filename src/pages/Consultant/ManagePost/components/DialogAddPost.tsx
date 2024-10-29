import { createPost } from '@/apis/post.api'
import Editor from '@/components/dev/Form/Editor'
import InputCustom from '@/components/dev/Form/InputCustom'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Form } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from '@/hooks/use-toast'
import { PostRequest } from '@/types/post.type'
import { AddPostSchema } from '@/utils/rules'
import { isImageFile } from '@/utils/utils'
import { yupResolver } from '@hookform/resolvers/yup'
import { PlusIcon } from '@radix-ui/react-icons'
import { useMutation } from '@tanstack/react-query'
import { useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import * as yup from 'yup'

type FormData = yup.InferType<typeof AddPostSchema>

export default function DialogAddPost() {
  const [open, setOpen] = useState<boolean>(false)
  const [file, setFile] = useState<File>()
  const previewImage = useMemo(() => {
    if (isImageFile((file?.name as string) ?? '')) return file ? URL.createObjectURL(file) : ''
  }, [file])

  const form = useForm<FormData>({
    defaultValues: {
      title: '',
      content: ''
    },
    resolver: yupResolver(AddPostSchema)
  })

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileFromLocal = event.target.files?.[0]
    setFile(fileFromLocal)
  }

  const createPostMutation = useMutation({
    mutationFn: (body: PostRequest) => createPost(body)
  })

  const onSubmit = form.handleSubmit((values) => {
    values.content = `<div class="editor">${values.content}</div>`
    const body: PostRequest = {
      ...values,
      anonymous: false,
      file: file as File
    }
    createPostMutation.mutate(body, {
      onSuccess: (res) => {
        toast({
          description: res.data.message
        })
        setOpen(false)
      }
    })
  })

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <Button>
          <PlusIcon />
          <span>Thêm bài đăng</span>
        </Button>
      </DialogTrigger>
      <DialogContent className='min-w-[800px]'>
        <DialogHeader>
          <DialogTitle>Thêm bài đăng</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={onSubmit}>
            <InputCustom control={form.control} name='title' placeholder='Tiêu đề' label='Tiêu đề' />
            <Editor control={form.control} name='content' label='Nội dung' />
            <div className='mb-4'>
              <div className='grid w-full max-w-sm items-center gap-1.5'>
                <Label htmlFor='file'>Tệp đính kèm</Label>
                <Input id='file' type='file' onChange={handleFileChange} />
                {previewImage && <img src={previewImage} alt='fileUploadImage' className='object-cover h-64' />}
              </div>
            </div>
            <Button>Thêm</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
