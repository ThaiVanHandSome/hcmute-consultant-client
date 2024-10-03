import { AppContext } from '@/contexts/app.context'
import { useContext, useEffect, useRef } from 'react'
import SockJS from 'sockjs-client'
import { Client, over } from 'stompjs'

export default function useUserOnline() {
  const { setOnlineUsers, user } = useContext(AppContext)
  const stompClient = useRef<Client | null>(null)

  const onUserOnline = (message: any) => {
    const updatedOnlineUsers = JSON.parse(message.body)
    console.log('Danh sách người dùng online:', updatedOnlineUsers)
    setOnlineUsers(updatedOnlineUsers)
  }

  const onConnected = () => {
    stompClient.current?.subscribe('/user/online-users', onUserOnline)
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onError = (err: any) => {
    console.log(err)
  }

  const connect = () => {
    const Sock = new SockJS('http://localhost:8080/ws')
    stompClient.current = over(Sock)

    const accessToken = localStorage.getItem('accessToken')
    const headers = {
      Authorization: 'Bearer ' + accessToken
    }
    stompClient.current.connect(headers, onConnected, onError)
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
