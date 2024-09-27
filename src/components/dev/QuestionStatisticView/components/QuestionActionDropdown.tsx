import { DotsHorizontalIcon, FileTextIcon, TrashIcon } from '@radix-ui/react-icons'

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { dialogViewType } from '@/pages/User/MyQuestion/MyQuestion'

interface Props {
  readonly openDialog: (s: string) => void
}

export default function QuestionActionDropdown({ openDialog }: Props) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <DotsHorizontalIcon className='size-5 text-primary cursor-pointer' />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem
          onClick={() => openDialog(dialogViewType.detail)}
          className='flex items-center gap-1 text-primary font-semibold'
        >
          <FileTextIcon />
          <span>Xem chi tiết</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => openDialog(dialogViewType.deleteConfirm)}
          className='flex items-center gap-1 text-destructive font-semibold'
        >
          <TrashIcon />
          <span>Xóa câu hỏi</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
