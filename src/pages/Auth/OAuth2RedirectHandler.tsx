import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { parseJWT } from '@/utils/utils';
import path from '@/constants/path';
import { useContext } from 'react';
import { AppContext } from '@/contexts/app.context';
import { setAccessTokenToLocalStorage, setRoleToLocalStorage } from '@/utils/auth';

const OAuth2RedirectHandler = () => {
  const navigate = useNavigate();
  const { setIsAuthenticated, setRole } = useContext(AppContext);

  useEffect(() => {
    // Lấy token từ URL params
    const currentUrl = window.location.href;
    const tokenIndex = currentUrl.indexOf('token=');
    let token = '';
    
    if (tokenIndex !== -1) {
      token = currentUrl.slice(tokenIndex + 6); // 6 là độ dài của 'token='
    }

    if (token) {
      console.log('Token from URL:', token);
      
      try {
        // Giải mã JWT
        const payload = parseJWT(token);
        console.log('Decoded JWT:', payload);

        // Lưu token và role vào localStorage
        setAccessTokenToLocalStorage(token);
        setRoleToLocalStorage(payload.authorities);
        
        // Cập nhật state trong context
        setIsAuthenticated(true);
        setRole(payload.authorities);

        console.log('LocalStorage after setting:', {
          accessToken: localStorage.getItem('accessToken'),
          role: localStorage.getItem('ROLE')
        });

        // Chuyển hướng về trang chính
        navigate(path.home);
      } catch (error) {
        console.error('Error processing token:', error);
        navigate('/login');
      }
    } else {
      console.log('No token found, redirecting to login...');
      navigate('/login');
    }
  }, [navigate, setIsAuthenticated, setRole]);

  return <div>Đang chuyển hướng...</div>;
};

export default OAuth2RedirectHandler;
