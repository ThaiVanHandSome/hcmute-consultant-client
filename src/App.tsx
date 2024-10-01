import { Toaster } from '@/components/ui/toaster'
import { AppContext } from '@/contexts/app.context'
import useNotification from '@/hooks/useNotification'
import useRouteElement from '@/hooks/useRouteElement'
import { AuthenticationTarget } from '@/utils/auth'
import { playNotificationSound } from '@/utils/utils'
import { useContext, useEffect } from 'react'

function App() {
  useNotification()
  const routeElement = useRouteElement()

  const { reset } = useContext(AppContext)
  useEffect(() => {
    AuthenticationTarget.addEventListener('clearLS', reset)
    return () => {
      AuthenticationTarget.removeEventListener('clearLS', reset)
    }
  }, [reset])

  useEffect(() => {
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth'
    })
  }, [location])

  return (
    <>
      {routeElement} <Toaster />
    </>
  )
}

export default App
