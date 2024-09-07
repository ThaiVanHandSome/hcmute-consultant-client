import { AppContext } from '@/contexts/app.context'
import useRouteElement from '@/hooks/useRouteElement'
import { AuthenticationTarget } from '@/utils/auth'
import { useContext, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'

function App() {
  const routeElement = useRouteElement()
  const location = useLocation()

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
      {routeElement} <ToastContainer />
    </>
  )
}

export default App
