import { User } from '@/types/user.type'
import { getAccessTokenFromLocalStorage, getRoleFromLocalStorage, getUserFromLocalStorate } from '@/utils/auth'
import { createContext, useState } from 'react'

interface AppContextInterface {
  isAuthenticated: boolean
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>
  user: User | null
  setUser: React.Dispatch<React.SetStateAction<User | null>>
  reset: () => void
  role: string
  setRole: React.Dispatch<React.SetStateAction<string>>
}

const initialAppContext: AppContextInterface = {
  isAuthenticated: Boolean(getAccessTokenFromLocalStorage()),
  setIsAuthenticated: () => null,
  user: getUserFromLocalStorate(),
  setUser: () => null,
  reset: () => null,
  role: getRoleFromLocalStorage(),
  setRole: () => null
}

export const AppContext = createContext<AppContextInterface>(initialAppContext)

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(initialAppContext.isAuthenticated)
  const [user, setUser] = useState<User | null>(initialAppContext.user)
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
        setRole
      }}
    >
      {children}
    </AppContext.Provider>
  )
}
