import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

export default function AdminLogin() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const redirect = searchParams.get('redirect');
    navigate(`/login?role=admin${redirect ? `&redirect=${encodeURIComponent(redirect)}` : ''}`, { replace: true });
  }, [navigate, searchParams]);

  return null;
}
