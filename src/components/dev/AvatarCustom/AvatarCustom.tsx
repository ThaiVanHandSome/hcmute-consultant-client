import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

interface Props {
  readonly url: string | undefined
  readonly fallback?: string
  readonly className?: string
}

export default function AvatarCustom({ url, fallback = 'USER', className = 'size-9' }: Props) {
  return (
    <Avatar className={className}>
      <AvatarImage src={url} alt='avatar' />
      <AvatarFallback>{fallback}</AvatarFallback>
    </Avatar>
  )
}
