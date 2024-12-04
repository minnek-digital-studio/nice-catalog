import React from 'react';
import { Link } from 'react-router-dom';
import { LogIn } from 'lucide-react';

export default function LoginButton() {
  return (
    <Link
      to="/admin"
      className="inline-flex items-center px-3 sm:px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#ed1c24]"
    >
      <LogIn className="w-4 h-4 sm:mr-2" />
      <span className="hidden sm:inline">Admin Login</span>
    </Link>
  );
}