import AuthHeader from '@/components/dev/AuthHeader'
import Footer from '@/components/dev/Footer'

interface Props {
  readonly children: React.ReactNode
}

export default function AuthLayout({ children }: Props) {
  return (
    <div>
      <AuthHeader />
      <div className='mt-[var(--header-height)]'>{children}</div>
      <Footer />
    </div>
  )
}
