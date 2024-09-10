import AsideNav from '@/pages/Home/components/AsideNav'
import ListConsultActivity from '@/pages/Home/components/ListConsultActivity'
import ListQuestion from '@/pages/Home/components/ListQuestion'

export default function Home() {
  return (
    <div className='py-3 px-6 bg-primary-bg'>
      <div className='flex'>
        <div className='w-[320px] fixed top-[var(--header-height)] pt-4'>
          <AsideNav />
        </div>
        <div className='ml-[320px] px-24 flex-1'>
          <ListQuestion />
        </div>
        <div className='w-[320px]'>
          <ListConsultActivity />
        </div>
      </div>
    </div>
  )
}