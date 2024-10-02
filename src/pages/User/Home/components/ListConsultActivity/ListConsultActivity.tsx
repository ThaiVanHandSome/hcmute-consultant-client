import { Button } from '@/components/ui/button'
import ConsultActivity from '@/pages/User/Home/components/ListConsultActivity/components/ConsultActivity'

export default function ListConsultActivity() {
  return (
    <div className=' py-2'>
      <div className='mb-2 py-2 rounded-sm font-bold text-lg px-2 text-gray-500'>Các hoạt động tự vấn</div>
      <ul>
        {Array(2)
          .fill(0)
          .map((_, index) => (
            <ConsultActivity key={index} />
          ))}
      </ul>
      <div className='flex items-center justify-center'>
        <Button className='px-2 h-8 text-xs'>Xem thêm</Button>
      </div>
    </div>
  )
}
