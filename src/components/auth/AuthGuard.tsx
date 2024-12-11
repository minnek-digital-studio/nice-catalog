import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../lib/auth/AuthProvider';
import LoadingScreen from '../common/LoadingScreen';

interface Props {
    children: React.ReactNode;
    requireAuth?: boolean;
    requireAdmin?: boolean;
}

export default function AuthGuard({ children, requireAuth = true, requireAdmin = false }: Props) {
    const { user, profile, loading } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (!loading) {
            if (requireAuth && !user) {
                // Redirect to login with return path
                navigate('/admin', {
                    state: { from: location.pathname },
                    replace: true
                });
            } else if (requireAdmin && !profile?.is_admin) {
                // Redirect non-admin users
                navigate('/', { replace: true });
            }
        }
    }, [loading, user, profile, requireAuth, requireAdmin, navigate, location]);

    if (loading) {
        return <LoadingScreen />;
    }

    if (requireAuth && !user) {
        return null;
    }

    if (requireAdmin && !profile?.is_admin) {
        return null;
    }

    return <>{children}</>;
}
