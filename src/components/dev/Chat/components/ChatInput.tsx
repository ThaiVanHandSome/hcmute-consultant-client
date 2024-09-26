import { useRef } from 'react'

import { useForm } from 'react-hook-form'
import { ImageIcon, PaperPlaneIcon } from '@radix-ui/react-icons'
import { useMutation } from '@tanstack/react-query'

import InputCustom from '@/components/dev/Form/InputCustom'
import { Form } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { uploadFile } from '@/apis/file.api'

interface Props {
  readonly sendMessage: (message?: string, imageUrl?: string) => void
}

export default function ChatInput({ sendMessage }: Props) {
  const form = useForm({
    defaultValues: {
      message: ''
    }
  })

  const inputFileRef = useRef<HTMLInputElement>(null)

  const fileUploadMutation = useMutation({
    mutationFn: (body: FormData) => uploadFile(body)
  })

  const handleUploadFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const formData = new FormData()
      formData.append('file', file)
      fileUploadMutation.mutate(formData, {
        onSuccess: (res) => {
          sendMessage('', res.data.fileUrl)
        },
        onError: (err) => {
          console.log(err)
        }
      })
    }
  }

  const onSubmit = form.handleSubmit((values) => {
    if (!values.message.trim()) return
    sendMessage(values.message)
    form.setValue('message', '')
  })
  return (
    <Form {...form}>
      <form onSubmit={onSubmit}>
        <div className='shadow-lg px-3 py-2 flex items-center w-full'>
          <Input ref={inputFileRef} type='file' className='hidden' onChange={handleUploadFile} />
          <div>
            <ImageIcon
              className='size-7 mr-2 text-primary cursor-pointer'
              onClick={() => inputFileRef.current?.click()}
            />
          </div>
          <div className='flex-1'>
            <InputCustom
              control={form.control}
              name='message'
              className='mb-0'
              classNameInput='rounded-lg bg-slate-200'
              autoComplete='nope'
            />
          </div>
          <button type='submit'>
            <PaperPlaneIcon className='size-7 ml-2 text-primary cursor-pointer' />
          </button>
        </div>
      </form>
    </Form>
  )
}
