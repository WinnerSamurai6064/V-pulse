/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Home, Search, MessageSquare, User, Settings, PlusSquare } from 'lucide-react';

// Components
import AuthScreen from './components/auth/AuthScreen';
import FeedScreen from './components/feed/FeedScreen';
import ProfileScreen from './components/profile/ProfileScreen';
import DMScreen from './components/dm/DMScreen';
import SettingsScreen from './components/settings/SettingsScreen';
import AdminPortal from './components/admin/AdminPortal';
import CreatePost from './components/feed/CreatePost';

const Navbar = ({ activeTab }: { activeTab: string }) => {
  const tabs = [
    { id: 'home', icon: Home, path: '/' },
    { id: 'dm', icon: MessageSquare, path: '/dm' },
    { id: 'create', icon: PlusSquare, path: '/create' },
    { id: 'profile', icon: User, path: '/profile' },
    { id: 'settings', icon: Settings, path: '/settings' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 glass-nav pb-safe z-50">
      <div className="flex justify-around items-center h-16 max-w-lg mx-auto">
        {tabs.map((tab) => (
          <a
            key={tab.id}
            href={tab.path}
            onClick={(e) => {
              e.preventDefault();
              window.history.pushState({}, '', tab.path);
              window.dispatchEvent(new PopStateEvent('popstate'));
            }}
            className={`tap-target transition-all duration-300 ${
              activeTab === tab.path ? 'text-primary' : 'text-zinc-500 hover:text-white'
            }`}
          >
            <tab.icon size={26} strokeWidth={activeTab === tab.path ? 2.5 : 2} />
            {activeTab === tab.path && (
              <motion.div
                layoutId="nav-dot"
                className="absolute -bottom-1 w-1 h-1 bg-primary rounded-full shadow-[0_0_8px_var(--color-primary)]"
              />
            )}
          </a>
        ))}
      </div>
    </nav>
  );
};

const ProtectedRoute = ({ children, isAuthenticated }: { children: React.ReactNode, isAuthenticated: boolean }) => {
  if (!isAuthenticated) return <Navigate to="/auth" replace />;
  return <>{children}</>;
};

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const location = useLocation();

  // Simple state for demo purposes until real auth is integrated
  useEffect(() => {
    const authStatus = localStorage.getItem('vpulse_auth');
    if (authStatus === 'true') setIsAuthenticated(true);
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
    localStorage.setItem('vpulse_auth', 'true');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('vpulse_auth');
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-primary/20">
      <AnimatePresence mode="wait">
        <Routes location={location}>
          <Route path="/auth" element={
            !isAuthenticated ? <AuthScreen onLogin={handleLogin} /> : <Navigate to="/" replace />
          } />
          
          <Route path="/" element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <FeedScreen />
            </ProtectedRoute>
          } />
          
          <Route path="/profile" element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <ProfileScreen />
            </ProtectedRoute>
          } />
          
          <Route path="/dm/*" element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <DMScreen />
            </ProtectedRoute>
          } />
          
          <Route path="/settings" element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <SettingsScreen onLogout={handleLogout} />
            </ProtectedRoute>
          } />

          <Route path="/create" element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <CreatePost />
            </ProtectedRoute>
          } />

          <Route path="/V-Pulse.html" element={<AdminPortal />} />
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AnimatePresence>

      {isAuthenticated && location.pathname !== '/V-Pulse.html' && (
        <Navbar activeTab={location.pathname} />
      )}
    </div>
  );
}

// Wrap with Router in main.tsx or here
export function AppWrapper() {
  return (
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
}
