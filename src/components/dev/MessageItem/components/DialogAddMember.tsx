import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { PlusIcon } from '@radix-ui/react-icons'
import { useState } from 'react'

export default function DialogAddMember() {
  const [open, setOpen] = useState<boolean>(false)
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <div className='text-sm font-semibold cursor-pointer flex items-center'>
          <PlusIcon />
          <span className='ml-1'>Thêm thành viên</span>
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Thêm thành viên</DialogTitle>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}
