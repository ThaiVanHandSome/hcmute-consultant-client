import { Navigate } from 'react-router-dom'
import { parseJWT } from '@/utils/utils'
import path from '@/constants/path'
import { useContext } from 'react'
import { AppContext } from '@/contexts/app.context'

const API_URL = import.meta.env.VITE_API_URL

const OAuth2RedirectHandler = () => {
  const { setIsAuthenticated, setUser } = useContext(AppContext)

  const getUrlParameter = (name: string) => {
    const urlParams = new URLSearchParams(location.search)
    return urlParams.get(name) ?? ''
  }

  const token = getUrlParameter('token')
  const error = getUrlParameter('error')

  console.log(token)
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
        return <Navigate to={path.home} />
      }
    }
    getProfile()
  } else {
    return <Navigate to='/login' state={{ error }} />
  }
}

export default OAuth2RedirectHandler
