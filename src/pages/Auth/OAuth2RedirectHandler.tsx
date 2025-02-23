import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { parseJWT } from '@/utils/utils';
import path from '@/constants/path';
import { useContext } from 'react';
import { AppContext } from '@/contexts/app.context';
import { setAccessTokenToLocalStorage, setRoleToLocalStorage, setUserToLocalStorage } from '@/utils/auth';
import http from '@/utils/http';

const OAuth2RedirectHandler = () => {
  const navigate = useNavigate();
  const { setIsAuthenticated, setUser, setRole } = useContext(AppContext);

  useEffect(() => {
    console.log('OAuth2RedirectHandler mounted');
    
    const searchParams = new URLSearchParams(window.location.search);
    const token = searchParams.get('token');
    
    console.log('Extracted token:', token);

    if (token) {
      try {
        const payload = parseJWT(token);
        console.log('JWT Payload:', payload);

        // Lưu token và role
        setAccessTokenToLocalStorage(token);
        setRoleToLocalStorage(payload.authorities);
        
        // Set authentication state
        setIsAuthenticated(true);
        setRole(payload.authorities);

        // Gọi API để lấy thông tin user
        http.get('/api/v1/profile')
          .then(response => {
            const userData = response.data.data;
            console.log('User Data:', userData);
            
            // Lưu thông tin user
            setUserToLocalStorage(userData);
            setUser(userData);

            // Chuyển hướng sau khi có đầy đủ thông tin
            navigate(path.home, { replace: true });
          })
          .catch(error => {
            console.error('Error fetching user data:', error);
            navigate('/register', { replace: true });
          });

      } catch (error) {
        console.error('Error in OAuth handler:', error);
        navigate('/register', { replace: true });
      }
    } else {
      console.log('No token found in URL');
      navigate('/register', { replace: true });
    }
  }, []); // Chỉ chạy một lần khi mount

  return <div className="text-center py-8">Đang xử lý đăng nhập...</div>;
};

export default OAuth2RedirectHandler;
