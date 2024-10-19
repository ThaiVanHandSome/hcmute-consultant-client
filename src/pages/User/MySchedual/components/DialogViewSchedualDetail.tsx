import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import { SchedualConsultant } from '@/types/consultant.type'

interface Props {
  readonly schedule: SchedualConsultant
}

export default function DialogViewSchedualDetail({ schedule }: Props) {
  return (
    <Dialog>
      <DialogTrigger>
        <Button>Xem chi tiết</Button>
      </DialogTrigger>
      <DialogContent className='max-w-[800px]'>
        <h1 className='font-semibold text-center text-xl mb-3'>Chi tiết lịch tư vấn</h1>
        <div className='space-y-3'>
          <div className='grid grid-cols-3 gap-2'>
            <div className='col-span-1 font-bold italic'>Khoa:</div>
            <div className='col-span-2'>{schedule.department.name}</div>
          </div>
          <div className='grid grid-cols-3 gap-2'>
            <div className='col-span-1 font-bold italic'>Tư vấn viên:</div>
            <div className='col-span-2'>{schedule.consultantName}</div>
          </div>
          <div className='grid grid-cols-3 gap-2'>
            <div className='col-span-1 font-bold italic'>Thời gian:</div>
            <div className='col-span-2'>
              {schedule.consultationDate} {schedule.consultationTime}
            </div>
          </div>
          <div className='grid grid-cols-3 gap-2'>
            <div className='col-span-1 font-bold italic'>Tiêu đề:</div>
            <div className='col-span-2'>{schedule.title}</div>
          </div>
          <div className='grid grid-cols-3 gap-2'>
            <div className='col-span-1 font-bold italic'>Nội dung:</div>
            <div
              dangerouslySetInnerHTML={{ __html: schedule.content }}
              className='col-span-2 px-2 py-1 bg-primary-bg rounded-xl'
            ></div>
          </div>
          <div className='grid grid-cols-3 gap-2'>
            <div className='col-span-1 font-bold italic'>Trạng thái:</div>
            <div className='col-span-2'>{schedule.statusPublic ? 'Công khai' : 'Riêng tư'}</div>
          </div>
          <div className='grid grid-cols-3 gap-2'>
            <div className='col-span-1 font-bold italic'>Hình thức:</div>
            <div className='col-span-2'>{schedule.mode ? 'Online' : 'Offline'}</div>
          </div>
          <div className='grid grid-cols-3 gap-2'>
            <div className='col-span-1 font-bold italic'>{schedule.mode ? 'Link:' : 'Địa điểm:'}</div>
            <div className='col-span-2'>{schedule.mode ? schedule.link : schedule.location}</div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
