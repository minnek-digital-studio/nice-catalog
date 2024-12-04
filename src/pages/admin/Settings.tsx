import React from 'react';
import { useStore } from '../../lib/store';
import AdminLayout from '../../components/admin/AdminLayout';
import SettingsTabs from '../../components/admin/SettingsTabs';
import TopNav from '../../components/admin/TopNav';
import { toast } from 'react-hot-toast';
import { signOut } from '../../lib/auth';

export default function SettingsPage() {
  const user = useStore((state) => state.user);

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success('Signed out successfully');
    } catch (error) {
      toast.error('Failed to sign out');
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