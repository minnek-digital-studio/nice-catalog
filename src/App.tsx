import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './lib/auth/AuthProvider';
import Landing from './pages/Landing';
import Login from './pages/admin/Login';
import SignUp from './pages/auth/SignUp';
import Products from './pages/admin/Products';
import Catalogs from './pages/admin/Catalogs';
import Settings from './pages/admin/Settings';
import PublicCatalog from './pages/catalogs/PublicCatalog';
import AuthGuard from './components/auth/AuthGuard';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/admin" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route
            path="/admin/catalogs"
            element={
              <AuthGuard>
                <Catalogs />
              </AuthGuard>
            }
          />
          <Route
            path="/admin/catalogs/:catalogId/products"
            element={
              <AuthGuard>
                <Products />
              </AuthGuard>
            }
          />
          <Route
            path="/admin/settings"
            element={
              <AuthGuard>
                <Settings />
              </AuthGuard>
            }
          />
          <Route path="/:username/:slug" element={<PublicCatalog />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <Toaster position="top-right" />
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;