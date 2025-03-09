import { Navigate } from 'react-router-dom'
import { parseJWT } from '@/utils/utils'
import path from '@/constants/path'
import { useContext } from 'react'
import { AppContext } from '@/contexts/app.context'

const OAuth2RedirectHandler = () => {
  const { setIsAuthenticated } = useContext(AppContext)
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

    return <Navigate to={path.home} />
  } else {
    return <Navigate to='/login' state={{ error }} />
  }
}

export default OAuth2RedirectHandler
