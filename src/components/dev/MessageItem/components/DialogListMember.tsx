import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'

export default function DialogListMember() {
  return (
    <Dialog>
      <DialogTrigger>
        <div className='text-sm font-semibold cursor-pointer flex items-center px-2 py-1 hover:bg-secondary rounded transition-all'>
          <span className='ml-1'>Thành viên</span>
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Thêm thành viên</DialogTitle>
        </DialogHeader>
        <div>
          
        </div>
      </DialogContent>
    </Dialog>
  )
}
