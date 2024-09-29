import { ScrollArea } from '@/components/ui/scroll-area'
import ConsultActivity from '@/pages/User/Home/components/ListConsultActivity/components/ConsultActivity'

export default function ListConsultActivity() {
  return (
    <ScrollArea>
      <div className='px-4 py-2 h-remain-screen'>
        <div className='mb-2 py-2 rounded-sm font-bold text-lg px-2 text-gray-500'>Các hoạt động tự vấn</div>
        <ul>
          {Array(6)
            .fill(0)
            .map((_, index) => (
              <ConsultActivity key={index} />
            ))}
        </ul>
      </div>
    </ScrollArea>
  )
}
