import { useNavigate } from 'react-router-dom'
import { parseJWT } from '@/utils/utils'
import path from '@/constants/path'
import { useContext, useEffect, useState } from 'react'
import { AppContext } from '@/contexts/app.context'

const API_URL = import.meta.env.VITE_API_URL

const OAuth2RedirectHandler = () => {
  const { setIsAuthenticated, setUser } = useContext(AppContext)
  const [isLoaded, setIsLoaded] = useState<boolean>(false)

  const getUrlParameter = (name: string) => {
    const urlParams = new URLSearchParams(location.search)
    return urlParams.get(name) ?? ''
  }

  const token = getUrlParameter('token')

  const navigate = useNavigate()

  useEffect(() => {
    if (isLoaded) navigate(path.home)
  }, [isLoaded])

  if (token) {
    const payload = parseJWT(token)
    localStorage.setItem('accessToken', token)
    localStorage.setItem('ROLE', payload.authorities)
    setIsAuthenticated(true)

    const getProfile = async () => {
      const res = await fetch(`${API_URL}profile`, {
        headers: {
          Authorization: 'Bearer ' + token
        }
      })
      if (res.ok) {
        const response = await res.json()
        setUser(response.data)
        setIsLoaded(true)
      }
    }
    getProfile()
  } else {
    navigate(path.login)
  }

  return <></>
}

export default OAuth2RedirectHandler
