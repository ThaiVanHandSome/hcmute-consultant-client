import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { parseJWT } from '@/utils/utils';
import path from '@/constants/path';
import { useContext } from 'react';
import { AppContext } from '@/contexts/app.context';
import { setAccessTokenToLocalStorage, setRoleToLocalStorage, setUserToLocalStorage } from '@/utils/auth';
import http from '@/utils/http';

const OAuth2RedirectHandler = () => {
  // const navigate = useNavigate();
  // const { setIsAuthenticated, setUser, setRole } = useContext(AppContext);

  // // Hàm lấy tham số từ URL bằng RegExp
  // const getUrlParameter = (name: string) => {
  //   name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
  //   const regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
  //   const results = regex.exec(window.location.search);
  //   return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
  // };

  // useEffect(() => {
  //   console.log('OAuth2RedirectHandler mounted');

  //   // Lấy token từ URL
  //   const token = getUrlParameter('token');
  //   console.log('Extracted token:', token);

  //   if (!token) {
  //     console.log('No token found in URL');
  //     navigate('/register', { replace: true });
  //     return;
  //   }

  //   try {
  //     // Giải mã JWT
  //     const payload = parseJWT(token);
  //     console.log('JWT Payload:', payload);

  //     // Lưu token & role vào localStorage
  //     setAccessTokenToLocalStorage(token);
  //     setRoleToLocalStorage(payload.authorities);

  //     // Cập nhật trạng thái xác thực
  //     setIsAuthenticated(true);
  //     setRole(payload.authorities);

  //     // Gọi API lấy thông tin user
  //     http.get('/api/v1/profile')
  //       .then(response => {
  //         const userData = response.data.data;
  //         console.log('User Data:', userData);

  //         // Lưu thông tin user
  //         setUserToLocalStorage(userData);
  //         setUser(userData);

  //         // Điều hướng về trang chính sau khi có thông tin user
  //         navigate(path.home, { replace: true });
  //       })
  //       .catch(error => {
  //         console.error('Error fetching user data:', error);
  //         navigate('/register', { replace: true });
  //       });

  //   } catch (error) {
  //     console.error('Error processing OAuth token:', error);
  //     navigate('/register', { replace: true });
  //   }
  // }, [navigate, setIsAuthenticated, setRole, setUser]);

  // return <div className="text-center py-8">Đang xử lý đăng nhập...</div>;
};

export default OAuth2RedirectHandler;
