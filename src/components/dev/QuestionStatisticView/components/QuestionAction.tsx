import { dialogViewType } from '@/pages/User/MyQuestion/MyQuestion'
import { EyeOpenIcon, TrashIcon } from '@radix-ui/react-icons'
import { Edit2Icon } from 'lucide-react'

interface Props {
  readonly openDialog: (s: string) => void
}

export default function QuestionAction({ openDialog }: Props) {
  return (
    <div className='flex items-center space-x-2'>
      <div aria-hidden='true' className='cursor-pointer' onClick={() => openDialog(dialogViewType.detail)}>
        <EyeOpenIcon className='size-4' />
      </div>
      <div aria-hidden='true' className='cursor-pointer' onClick={() => openDialog(dialogViewType.updateQuestion)}>
        <Edit2Icon className='size-4' strokeWidth={1.5} />
      </div>
      <div aria-hidden='true' className='cursor-pointer' onClick={() => openDialog(dialogViewType.deleteConfirm)}>
        <TrashIcon className='text-destructive' />
      </div>
    </div>
  )
}
