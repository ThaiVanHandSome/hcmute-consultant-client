import Header from '@/components/dev/Header'

export default function MainLayout({ children }: { readonly children: React.ReactNode }) {
  return (
    <div>
      <Header />
      <div className='bg-primary-bg mt-[var(--header-height)] min-h-remain-screen'>{children}</div>
    </div>
  )
}
