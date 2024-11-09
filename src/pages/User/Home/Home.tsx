import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import path from '@/constants/path'
import { ROLE } from '@/constants/role'
import { AppContext } from '@/contexts/app.context'
import { QuestionCircle } from '@/icons'
import AsideNav from '@/pages/User/Home/components/AsideNav'
import ConsultantWorking from '@/pages/User/Home/components/ConsultantWorking'
import ListConsultActivity from '@/pages/User/Home/components/ListConsultActivity'
import ListQuestion from '@/pages/User/Home/components/ListQuestion'
import { useContext } from 'react'
import { Link } from 'react-router-dom'

export default function Home() {
  const { role } = useContext(AppContext)
  return (
    <div>
      <div className='flex relative'>
        <div className='w-[320px] fixed top-[var(--header-height)] pt-4 bg-background'>
          <AsideNav />
        </div>
        <div className='ml-[320px] mr-[360px] flex-1'>
          {role === ROLE.user && (
            <div className='flex items-center justify-center mt-4'>
              <div className='w-[90%] px-6 py-6 bg-gradient-to-r from-blue-400 to-purple-500 text-white mb-6 flex justify-between items-center z-10 bg-opacity-20 backdrop-filter backdrop-blur-lg rounded-xl shadow-xl'>
                <div className='flex'>
                  <QuestionCircle className='text-3xl text-white mb-4 animate-bounce size-9 mr-2' />
                  <div>
                    <p className='text-xl font-semibold mb-2'>Bạn cần ban tư vấn hỗ trợ</p>
                    <p className='text-md mb-4'>Hãy đặt câu hỏi ngay nhé</p>
                  </div>
                </div>
                <Link to={path.createQuestion}>
                  <Button className='bg-[#054bb4] text-white font-semibold px-5 py-2 rounded-md hover:bg-blue-600 transition duration-300'>
                    Đặt câu hỏi
                  </Button>
                </Link>
              </div>
            </div>
          )}
          <div className='px-12 w-full'>
            <ListQuestion />
          </div>
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
