import { Navigate } from 'react-router-dom';
import { parseJWT } from '@/utils/utils';
import path from '@/constants/path';

const OAuth2RedirectHandler = () => {

  const getUrlParameter = (name: String) => {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    const regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    const results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
  };

  const token = getUrlParameter('token');
  const error = getUrlParameter('error');

  console.log(token);
  if (token) {
    const payload = parseJWT(token);
    localStorage.setItem('accessToken', token);
    localStorage.setItem('ROLE', payload.authorities)

    return <Navigate to={path.home} />;
  } else {
    return <Navigate to="/login" state={{ error }} />;
  }
};

export default OAuth2RedirectHandler;
