import React, { useEffect, useState } from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
  useNavigate,
} from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  Home,
  MessageSquare,
  User,
  Settings,
  PlusSquare,
} from 'lucide-react';

// Components
import AuthScreen from './components/auth/AuthScreen';
import FeedScreen from './components/feed/FeedScreen';
import ProfileScreen from './components/profile/ProfileScreen';
import DMScreen from './components/dm/DMScreen';
import SettingsScreen from './components/settings/SettingsScreen';
import AdminPortal from './components/admin/AdminPortal';
import CreatePost from './components/feed/CreatePost';

// Realtime websocket helper
import { realtime } from './lib/realtime';

type NavbarProps = {
  activePath: string;
};

const getActiveTab = (path: string) => {
  if (path === '/') return 'home';
  if (path.startsWith('/dm')) return 'dm';
  if (path.startsWith('/create')) return 'create';
  if (path.startsWith('/profile')) return 'profile';
  if (path.startsWith('/settings')) return 'settings';
  return '';
};

const Navbar = ({ activePath }: NavbarProps) => {
  const navigate = useNavigate();
  const activeTab = getActiveTab(activePath);

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
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => navigate(tab.path)}
              className={`relative tap-target transition-all duration-300 ${
                isActive ? 'text-primary' : 'text-zinc-500 hover:text-white'
              }`}
              aria-label={`Go to ${tab.id}`}
            >
              <Icon size={26} strokeWidth={isActive ? 2.5 : 2} />

              {isActive && (
                <motion.div
                  layoutId="nav-dot"
                  className="absolute -bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-primary shadow-[0_0_8px_var(--color-primary)]"
                />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};

type ProtectedRouteProps = {
  children: React.ReactNode;
  isAuthenticated: boolean;
};

const ProtectedRoute = ({ children, isAuthenticated }: ProtectedRouteProps) => {
  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
};

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const authStatus = localStorage.getItem('vpulse_auth');

    if (authStatus === 'true') {
      setIsAuthenticated(true);
    }

    setAuthChecked(true);
  }, []);

  useEffect(() => {
    if (!isAuthenticated) return;

    realtime.connect();

    realtime.send('auth:login', {
      username: localStorage.getItem('vpulse_username') || 'pioneer',
    });
  }, [isAuthenticated]);

  const handleLogin = (username = 'pioneer') => {
    localStorage.setItem('vpulse_auth', 'true');
    localStorage.setItem('vpulse_username', username);

    setIsAuthenticated(true);

    realtime.connect();
    realtime.send('auth:login', {
      username,
    });
  };

  const handleLogout = () => {
    realtime.send('session:end');

    localStorage.removeItem('vpulse_auth');
    localStorage.removeItem('vpulse_username');

    setIsAuthenticated(false);
  };

  const hideNavbar =
    !isAuthenticated ||
    location.pathname === '/auth' ||
    location.pathname === '/V-Pulse.html';

  if (!authChecked) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-primary font-black tracking-[0.3em] animate-pulse">
          V-PULSE
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-primary/20">
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route
            path="/auth"
            element={
              !isAuthenticated ? (
                <AuthScreen onLogin={handleLogin} />
              ) : (
                <Navigate to="/" replace />
              )
            }
          />

          <Route
            path="/"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <FeedScreen />
              </ProtectedRoute>
            }
          />

          <Route
            path="/profile/*"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <ProfileScreen />
              </ProtectedRoute>
            }
          />

          <Route
            path="/dm/*"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <DMScreen />
              </ProtectedRoute>
            }
          />

          <Route
            path="/settings/*"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <SettingsScreen onLogout={handleLogout} />
              </ProtectedRoute>
            }
          />

          <Route
            path="/create"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <CreatePost />
              </ProtectedRoute>
            }
          />

          <Route path="/V-Pulse.html" element={<AdminPortal />} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AnimatePresence>

      {!hideNavbar && <Navbar activePath={location.pathname} />}
    </div>
  );
}

export function AppWrapper() {
  return (
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
}

export default AppWrapper;
