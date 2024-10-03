import { User, UserOnline } from '@/types/user.type'
import {
  getAccessTokenFromLocalStorage,
  getOnlineUsersFromLocalStorate,
  getRoleFromLocalStorage,
  getUserFromLocalStorate
} from '@/utils/auth'
import { createContext, useState } from 'react'

interface AppContextInterface {
  isAuthenticated: boolean
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>
  user: User | null
  setUser: React.Dispatch<React.SetStateAction<User | null>>
  reset: () => void
  role: string
  setRole: React.Dispatch<React.SetStateAction<string>>
  onlineUsers: UserOnline[] | null
  setOnlineUsers: React.Dispatch<React.SetStateAction<UserOnline[] | null>>
}

const initialAppContext: AppContextInterface = {
  isAuthenticated: Boolean(getAccessTokenFromLocalStorage()),
  setIsAuthenticated: () => null,
  user: getUserFromLocalStorate(),
  setUser: () => null,
  reset: () => null,
  role: getRoleFromLocalStorage(),
  setRole: () => null,
  onlineUsers: getOnlineUsersFromLocalStorate(),
  setOnlineUsers: () => null
}

export const AppContext = createContext<AppContextInterface>(initialAppContext)

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(initialAppContext.isAuthenticated)
  const [user, setUser] = useState<User | null>(initialAppContext.user)
  const [onlineUsers, setOnlineUsers] = useState<UserOnline[] | null>(initialAppContext.onlineUsers ?? [])
  const [role, setRole] = useState<string>(initialAppContext.role)

  const reset = () => {
    setIsAuthenticated(false)
    setUser(null)
  }

  return (
    <AppContext.Provider
      value={{
        isAuthenticated,
        setIsAuthenticated,
        user,
        setUser,
        reset,
        role,
        setRole,
        onlineUsers,
        setOnlineUsers
      }}
    >
      {children}
    </AppContext.Provider>
  )
}
