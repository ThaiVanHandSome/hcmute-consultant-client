import { Button } from '@/components/ui/button'

interface Props {
  readonly isLoading: boolean
  readonly disabled: boolean
  readonly onClick: () => void
}

export default function ResendButton({ isLoading, disabled, onClick }: Props) {
  return (
    <Button
      isLoading={isLoading}
      disabled={disabled}
      type='button'
      variant='outline'
      className='w-full mb-4'
      onClick={onClick}
    >
      Gửi mã xác nhận lần nữa
    </Button>
  )
}
