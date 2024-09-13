import AsideNav from '@/pages/User/Home/components/AsideNav'
import ListConsultActivity from '@/pages/User/Home/components/ListConsultActivity'
import ListQuestion from '@/pages/User/Home/components/ListQuestion'

export default function Home() {
  return (
    <div className='bg-primary-bg py-6'>
      <div className='container'>
        <div className='flex relative'>
          <div className='w-[320px] fixed top-[var(--header-height)] pt-4'>
            <AsideNav />
          </div>
          <div className='ml-[320px] mr-[320px] px-16 flex-1'>
            <ListQuestion />
          </div>
          <div className='w-[320px] fixed top-[var(--header-height)] right-16 pt-4'>
            <ListConsultActivity />
          </div>
        </div>
      </div>
    </div>
  )
}
