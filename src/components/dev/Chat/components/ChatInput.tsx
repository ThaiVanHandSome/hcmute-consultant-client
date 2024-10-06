import { useEffect, useRef } from 'react'

import { useForm } from 'react-hook-form'
import { ImageIcon, PaperPlaneIcon } from '@radix-ui/react-icons'
import { useMutation } from '@tanstack/react-query'

import InputCustom from '@/components/dev/Form/InputCustom'
import { Form } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { uploadFile } from '@/apis/file.api'
import { CheckCircle2Icon, CircleX } from 'lucide-react'

interface Props {
  readonly sendMessage: (message?: string, imageUrl?: string) => void
  readonly messageEdit?: { messageId: number; content: string }
  readonly handleCloseUpdateMessage?: () => void
  readonly handleUpdateMessage: (messageId: number, newContent: string) => void
}

export default function ChatInput({ sendMessage, messageEdit, handleCloseUpdateMessage, handleUpdateMessage }: Props) {
  const form = useForm({
    defaultValues: {
      message: messageEdit?.content ? messageEdit?.content : ''
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
    const message = values.message
    if (!message.trim()) return
    if (!messageEdit) {
      sendMessage(message)
      form.setValue('message', '')
      return
    }
    if (message === messageEdit.content) return
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    handleUpdateMessage && handleUpdateMessage(messageEdit.messageId, message)
  })

  useEffect(() => {
    if (!messageEdit) {
      form.reset({
        message: ''
      })
      return
    }
    form.reset({
      message: messageEdit.content
    })
  }, [messageEdit])
  return (
    <Form {...form}>
      <form onSubmit={onSubmit}>
        {!messageEdit && (
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
                classNameInput='rounded-lg bg-secondary text-secondary-foreground'
                autoComplete='nope'
              />
            </div>
            <button type='submit'>
              <PaperPlaneIcon className='size-7 ml-2 text-primary cursor-pointer' />
            </button>
          </div>
        )}
        {messageEdit && (
          <div className='py-2 px-4 border-t'>
            <div className='flex items-center justify-between mb-2'>
              <p className='pt-2 font-semibold mb-4'>Chỉnh sửa tin nhắn</p>
              <div aria-hidden='true' onClick={handleCloseUpdateMessage} className='cursor-pointer p-2'>
                <CircleX />
              </div>
            </div>
            <div className='flex px-2'>
              <div className='flex-1'>
                <InputCustom
                  control={form.control}  
                  name='message'
                  className='mb-0'
                  classNameInput='rounded-lg bg-secondary text-secondary-foreground'
                  autoComplete='nope'
                />
              </div>
              <button type='submit'>
                <CheckCircle2Icon className='size-7 rounded-full bg-card mx-2 cursor-pointer fill-primary text-background' />
              </button>
            </div>
          </div>
        )}
      </form>
    </Form>
  )
}
