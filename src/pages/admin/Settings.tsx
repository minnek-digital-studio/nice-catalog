import { useStore } from '../../lib/store';
import AdminLayout from '../../components/admin/AdminLayout';
import SettingsTabs from '../../components/admin/SettingsTabs';
import TopNav from '../../components/admin/TopNav';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../lib/auth/AuthProvider';

export default function SettingsPage() {
  const user = useStore((state) => state.user);
  const navigate = useNavigate();
  const { signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
      toast.success('Signed out successfully');
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message || 'Failed to sign out');
      } else {
        toast.error('Failed to sign out');
      }
    }
  };

  if (!user) return null;

  return (
    <AdminLayout>
      <TopNav onSignOut={handleSignOut} />
      <SettingsTabs />
    </AdminLayout>
  );
}