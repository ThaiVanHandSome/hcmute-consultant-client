import Header from '@/components/dev/Header'

export default function MainLayout({ children }: { readonly children: React.ReactNode }) {
  return (
    <div>
      <Header />
      {/* <div className='lg:hidden grid grid-cols-2 border-b sticky top-[var(--header-height)] z-50 backdrop-blur supports-[backdrop-filter]:bg-background/60'>
        <div className='flex items-center justify-center border-r py-4'>
          <HeaderNotification />
        </div>
        <div className='flex items-center justify-center'>
          <HeaderMessage />
        </div>
      </div> */}
      <div className='bg-primary-bg mt-[var(--header-height)] min-h-remain-screen'>{children}</div>
    </div>
  )
}
