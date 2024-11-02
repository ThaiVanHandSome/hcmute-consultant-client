import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import AsideNav from '@/pages/User/Home/components/AsideNav'
import ConsultantWorking from '@/pages/User/Home/components/ConsultantWorking'
import ListConsultActivity from '@/pages/User/Home/components/ListConsultActivity'
import ListQuestion from '@/pages/User/Home/components/ListQuestion'

export default function Home() {
  return (
    <div className='py-6'>
      <div className='flex relative'>
        <div className='w-[320px] fixed top-[var(--header-height)] pt-4 bg-background'>
          <AsideNav />
        </div>
        <div className='ml-[320px] mr-[360px] px-16 flex-1'>
          <ListQuestion />
        </div>
        <div className='w-[360px] fixed top-[var(--header-height)] right-0 pt-4 bg-background'>
          <ScrollArea>
            <div className='h-remain-screen'>
              <ListConsultActivity />
              <Separator className='my-2' />
              <ConsultantWorking />
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  )
}
