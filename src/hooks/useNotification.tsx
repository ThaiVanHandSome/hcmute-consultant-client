import { AppContext } from '@/contexts/app.context'
import { toast } from '@/hooks/use-toast'
import { Notification } from '@/types/notification.type'
import { useQueryClient } from '@tanstack/react-query'
import { useContext, useEffect, useRef } from 'react'
import SockJS from 'sockjs-client'
import { Client, over } from 'stompjs'

const useNotification = () => {
  const queryClient = useQueryClient()
  const { user } = useContext(AppContext)
  const stompClient = useRef<Client | null>(null)

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onPrivateNotification = (payload: any) => {
    queryClient.refetchQueries({
      queryKey: ['notifications']
    })
    const notification: Notification = JSON.parse(payload.body)
    toast({
      variant: 'default',
      title: 'Thông báo',
      description: notification.content
    })
  }

  const onConnected = () => {
    stompClient.current?.subscribe('/user/' + user?.id + '/notification', onPrivateNotification)
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onError = (err: any) => {
    console.log(err)
  }

  const connect = () => {
    const Sock = new SockJS('http://localhost:8080/ws')
    stompClient.current = over(Sock)
    stompClient.current.connect({}, onConnected, onError)
  }

  useEffect(() => {
    if (user?.id) {
      connect()
    }
    return () => {
      stompClient.current?.disconnect(() => {
        console.log('Disconnected successfully')
      })
    }
  }, [user?.id])

  return null
}

export default useNotification
