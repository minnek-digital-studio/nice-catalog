import React from 'react';
import { useStore } from '../../lib/store';

interface Props {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: Props) {
  const user = useStore((state) => state.user);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600">Please sign in to access the admin panel.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-full">
        {/* Navigation is full width */}
        {children}
      </div>
    </div>
  );
}