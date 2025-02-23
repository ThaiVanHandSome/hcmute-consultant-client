import { Navigate } from 'react-router-dom'
import { parseJWT } from '@/utils/utils'
import path from '@/constants/path'

const OAuth2RedirectHandler = () => {
  console.log('trigger')

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

    return <Navigate to={path.home} />
  } else {
    return <Navigate to='/login' state={{ error }} />
  }
}

export default OAuth2RedirectHandler
