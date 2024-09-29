import Header from '@/components/dev/Header'

export default function MainLayout({ children }: { readonly children: React.ReactNode }) {
  return (
    <div>
      <Header />
      <div className='bg-white mt-[var(--header-height)] min-h-[80vh]'>{children}</div>
    </div>
  )
}
