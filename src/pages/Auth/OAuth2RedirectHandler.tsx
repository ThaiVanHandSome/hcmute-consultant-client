import { Navigate } from 'react-router-dom';
import { parseJWT } from '@/utils/utils';
import path from '@/constants/path';
import { useContext } from 'react';
import { AppContext } from '@/contexts/app.context';

const OAuth2RedirectHandler = () => {
  const { setIsAuthenticated, setUser, setRole } = useContext(AppContext);

  const getUrlParameter = (name: string) => {
    const regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    const results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
  };

  const token = getUrlParameter('token');
  const error = getUrlParameter('error');
  const userInfo = getUrlParameter('user');

  console.log('Token:', token);
  console.log('Error:', error);
  console.log('User Info:', userInfo);
  console.log('Current URL:', window.location.href);

  if (token) {
    const payload = parseJWT(token);
    console.log('JWT Payload:', payload);
    
    localStorage.setItem('accessToken', token);
    localStorage.setItem('ROLE', payload.authorities);
    
    if (userInfo) {
      const user = JSON.parse(decodeURIComponent(userInfo));
      console.log('Parsed User:', user);
      localStorage.setItem('user', JSON.stringify(user));
      setUser(user);
    }

    setIsAuthenticated(true);
    setRole(payload.authorities);
    console.log('LocalStorage after setting:', {
      accessToken: localStorage.getItem('accessToken'),
      role: localStorage.getItem('ROLE'),
      user: localStorage.getItem('user')
    });

    return <Navigate to={path.home} />;
  } else {
    console.log('No token found, redirecting to login');
    return <Navigate to="/login" state={{ error }} />;
  }
};

export default OAuth2RedirectHandler;
