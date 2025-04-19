import { AppContext } from '@/contexts/app.context'
import useNotification from '@/hooks/useNotification'
import useRouteElement from '@/hooks/useRouteElement'
import useUserOnline from '@/hooks/useUserOnline'
import { AuthenticationTarget } from '@/utils/auth'
import { useContext, useEffect } from 'react'
import { Toaster } from 'sonner'
import ChatBotIcon from '@/assets/images/icons/chat-bot.png'
import { Link } from 'react-router-dom'
import path from '@/constants/path'

function App() {
  useNotification()
  useUserOnline()
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
      <Link to={path.chatBot} className='fixed bottom-6 right-6 z-50 group'>
        <div className='relative p-2 bg-gradient-to-tr from-blue-600 to-blue-400 rounded-full shadow-lg hover:shadow-xl hover:shadow-blue-500/40 transition-all duration-300 hover:scale-105'>
          <div className='absolute -top-0.5 -right-0.5 w-2 h-2 bg-green-500 rounded-full animate-ping' />
          <div className='absolute -top-0.5 -right-0.5 w-2 h-2 bg-green-500 rounded-full' />
          <img src={ChatBotIcon} alt='chat-bot' className='size-8 filter brightness-0 invert' />
        </div>
        <div
          className='absolute bottom-full right-0 mb-2 px-3 py-1.5 bg-white rounded-lg shadow-md 
          opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap
          text-xs font-medium text-gray-700 translate-y-1 group-hover:translate-y-0'
        >
          Chat với trợ lý AI
        </div>
      </Link>
    </>
  )
}

export default App
