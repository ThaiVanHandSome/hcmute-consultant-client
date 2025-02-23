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
    console.log('OAuth2RedirectHandler mounted');
    console.log('Full URL:', window.location.href);
    
    const searchParams = new URLSearchParams(window.location.search);
    const token = searchParams.get('token');
    
    console.log('Search params:', Object.fromEntries(searchParams.entries()));
    console.log('Extracted token:', token);

    if (token) {
      console.log('Processing token...');
      
      try {
        const payload = parseJWT(token);
        console.log('JWT Payload:', payload);

        // Lưu vào localStorage trực tiếp trước
        localStorage.setItem('accessToken', token);
        localStorage.setItem('ROLE', payload.authorities);
        
        console.log('Direct localStorage check:', {
          accessToken: localStorage.getItem('accessToken'),
          role: localStorage.getItem('ROLE')
        });

        // Sau đó mới dùng các hàm helper
        setAccessTokenToLocalStorage(token);
        setRoleToLocalStorage(payload.authorities);
        
        // Set context state
        setIsAuthenticated(true);
        setRole(payload.authorities);

        console.log('Final localStorage check:', {
          accessToken: localStorage.getItem('accessToken'),
          role: localStorage.getItem('ROLE')
        });

        // Delay navigation một chút để đảm bảo state đã được cập nhật
        setTimeout(() => {
          console.log('Navigating to home...');
          navigate(path.home, { replace: true });
        }, 100);

      } catch (error) {
        console.error('Error in OAuth handler:', error);
        navigate('/login', { replace: true });
      }
    } else {
      console.log('No token found in URL');
      navigate('/login', { replace: true });
    }

    // Cleanup function
    return () => {
      console.log('OAuth2RedirectHandler unmounting');
    };
  }, []); // Chỉ chạy một lần khi mount

  console.log('Rendering OAuth2RedirectHandler');
  return <div className="text-center py-8">Đang xử lý đăng nhập...</div>;
};

export default OAuth2RedirectHandler;
