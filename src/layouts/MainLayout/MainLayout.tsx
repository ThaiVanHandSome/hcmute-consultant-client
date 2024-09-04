import Footer from '@/components/dev/Footer'
import Header from '@/components/dev/Header'

export default function MainLayout({ children }: { readonly children: React.ReactNode }) {
  return (
    <div>
      <Header />
      <div>{children}</div>
      <Footer />
    </div>
  )
}
