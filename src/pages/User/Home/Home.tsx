import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import path from '@/constants/path'
import { ROLE } from '@/constants/role'
import { AppContext } from '@/contexts/app.context'
import { QuestionCircle } from '@/icons'
import AsideNav from '@/pages/User/Home/components/AsideNav'
import ListQuestion from '@/pages/User/Home/components/ListQuestion'
import { useContext } from 'react'
import { Link } from 'react-router-dom'
import LogoTabline from '@/assets/images/logos/Logo_Tabline.png'
import ListPost from '@/pages/User/Home/components/ListPost'
import ListConsultActivity from '@/pages/User/Home/components/ListConsultActivity'

export default function Home() {
  const { role } = useContext(AppContext)
  return (
    <div className='bg-background'>
      <div className='flex relative'>
        <div className='hidden lg:block w-[320px] fixed top-[var(--header-height)] pt-4 border-r'>
          <AsideNav />
        </div>
        <div className='ml-0 lg:ml-[320px] mr-0 lg:mr-[360px] flex-1'>
          {role === ROLE.user && (
            <div className='flex items-center justify-center mt-4'>
              <div className='lg:w-[90%] w-[95%] px-6 py-6 bg-gradient-to-r from-blue-400 to-purple-500 text-white  flex flex-col lg:flex-row space-y-2 lg:space-y-0 justify-between items-center z-10 bg-opacity-20 backdrop-filter backdrop-blur-lg rounded-xl shadow-xl'>
                <div className='flex'>
                  <QuestionCircle className='text-3xl text-white mb-4 animate-bounce size-9 mr-2' />
                  <div>
                    <p className='text-xl font-semibold mb-2'>Bạn cần ban tư vấn hỗ trợ</p>
                    <p className='text-md '>Hãy đặt câu hỏi ngay nhé</p>
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
          <div className='lg:px-12 px-2 w-full mt-4'>
            <ListQuestion />
          </div>
        </div>
        <div className='hidden lg:block w-[360px] fixed top-[var(--header-height)] right-0 pt-4 px-2 border-l'>
          <ScrollArea>
            <div className='h-remain-screen'>
              <img src={LogoTabline} alt='logo-hcmute' className='w-96 object-cover mb-4' />
              <ListPost />
              <ListConsultActivity />
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  )
}
