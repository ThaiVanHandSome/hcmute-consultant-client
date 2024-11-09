/* eslint-disable @typescript-eslint/no-explicit-any */
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
    if (user?.id) {
      stompClient.current?.subscribe(`/user/${user.id}/online-users`, onUserOnline)
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onError = (err: any) => {
    console.log('Lỗi kết nối WebSocket:', err)
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
      if (stompClient.current) {
        stompClient.current.disconnect(() => {
          console.log('Ngắt kết nối thành công')
        })
      }
    }
  }, [user?.id])

  return null
}
