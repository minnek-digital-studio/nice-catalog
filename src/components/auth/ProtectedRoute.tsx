import React, { useEffect } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useStore } from '../../lib/store';
import AdminLayout from '../admin/AdminLayout';
import { supabase } from '../../lib/supabase';

interface Props {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: Props) {
  const user = useStore((state) => state.user);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate('/admin', { 
          state: { from: location },
          replace: true 
        });
      }
    };

    checkAuth();
  }, [location, navigate]);

  if (!user) {
    return <Navigate to="/admin" state={{ from: location }} replace />;
  }

  return <AdminLayout>{children}</AdminLayout>;
}