import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const OAuth2RedirectHandler = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    const error = params.get('error');
    const userInfo = params.get('user');

    if (token) {
      localStorage.setItem('accessToken', token);
      console.log('Stored Token:', localStorage.getItem('accessToken'));

      if (userInfo) {
        localStorage.setItem('user', decodeURIComponent(userInfo));
      }

      navigate('/home'); // Điều hướng đến trang chính
    } else {
      navigate('/login', { state: { error } });
    }
  }, [navigate]);

  return <div>Redirecting...</div>;
};

export default OAuth2RedirectHandler;
