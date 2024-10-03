import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

interface Props {
  readonly url: string | undefined
  readonly fallback?: string
  readonly className?: string
  readonly isWorking?: boolean
}

export default function AvatarCustom({ url, fallback = 'USER', isWorking = false, className = 'size-9' }: Props) {
  return (
    <div className='rounded-full relative'>
      <Avatar className={className}>
        <AvatarImage src={url} alt='avatar' />
        <AvatarFallback>{fallback}</AvatarFallback>
      </Avatar>
      {isWorking && <div className='size-2 rounded-full bg-green-600 absolute bottom-0 right-0' />}
    </div>
  )
}
