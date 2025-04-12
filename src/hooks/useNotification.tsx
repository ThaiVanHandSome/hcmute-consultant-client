import { useContext, useEffect, useRef } from 'react'

import { Client, over } from 'stompjs'
import SockJS from 'sockjs-client'
import { useQueryClient } from '@tanstack/react-query'

import { AppContext } from '@/contexts/app.context'
import { toast } from 'sonner'
import { NotificationSocket } from '@/types/notification.type'
import { playNotificationSound, registerUserInteraction } from '@/utils/utils'

const useNotification = () => {
  const queryClient = useQueryClient()
  const { user } = useContext(AppContext)
  const stompClient = useRef<Client | null>(null)

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onPrivateNotification = (payload: any) => {
    queryClient.refetchQueries({
      queryKey: ['notifications']
    })
    const notification: NotificationSocket = JSON.parse(payload.body)

    toast(notification.data.content)
    playNotificationSound()
  }

  const onConnected = () => {
    stompClient.current?.subscribe('/user/' + user?.id + '/notification', onPrivateNotification)
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onError = (err: any) => {
    console.log(err)
  }

  const connect = () => {
    const SERVER_URL = import.meta.env.VITE_SERVER_URL
    console.log(SERVER_URL)
    const Sock = new SockJS(`${SERVER_URL}/ws`)
    stompClient.current = over(Sock)

    const accessToken = localStorage.getItem('accessToken')
    const headers = {
      Authorization: 'Bearer ' + accessToken
    }
    stompClient.current.connect(headers, onConnected, onError)
  }

  useEffect(() => {
    if (user?.id) {
      registerUserInteraction()
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
