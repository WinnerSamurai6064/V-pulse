import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  LogIn,
  User,
  AlertCircle,
  Sparkles,
} from 'lucide-react';

type AuthScreenProps = {
  onLogin: (username?: string) => void;
};

const takenUsernames = ['admin', 'system_pulse', 'vpulse', 'v-pulse'];

function sanitizeUsername(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9._-]/g, '')
    .slice(0, 24);
}

function sanitizeEmail(value: string) {
  return value.trim().toLowerCase().replace(/[<>"'%;()&+/]/g, '');
}

function isStrongDemoPassword(value: string) {
  return /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@#$!%*?&._-]).{8,}$/.test(value);
}

export default function AuthScreen({ onLogin }: AuthScreenProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  const [username, setUsername] = useState('pioneer');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [error, setError] = useState('');

  const cleanUsername = sanitizeUsername(username);
  const cleanEmail = sanitizeEmail(email);

  const usernameUnavailable = takenUsernames.includes(cleanUsername);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setError('');

    if (!cleanEmail) {
      setError('Enter a valid email address.');
      return;
    }

    if (!isLogin && !cleanUsername) {
      setError('Choose a username.');
      return;
    }

    if (!isLogin && usernameUnavailable) {
      setError('That username is already unavailable.');
      return;
    }

    if (!password.trim()) {
      setError('Enter your password.');
      return;
    }

    if (!isStrongDemoPassword(password)) {
      setError('Password must look like Goldengates@27.');
      return;
    }

    const finalUsername = isLogin
      ? cleanEmail.split('@')[0] || 'pioneer'
      : cleanUsername;

    localStorage.setItem('vpulse_email', cleanEmail);
    localStorage.setItem('vpulse_username', finalUsername);

    onLogin(finalUsername);
  };

  const handleGuestLogin = () => {
    const guestName = `guest_${Math.floor(Math.random() * 9999)}`;

    localStorage.setItem('vpulse_email', 'guest@vpulse.local');
    localStorage.setItem('vpulse_username', guestName);

    onLogin(guestName);
  };

  const handleGoogleDemoLogin = () => {
    const googleDemoName = 'google_pulse';

    localStorage.setItem('vpulse_email', 'google.demo@vpulse.local');
    localStorage.setItem('vpulse_username', googleDemoName);

    onLogin(googleDemoName);
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-black p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm"
      >
        <div className="mb-12 text-center">
          <h1 className="neon-text mb-2 text-5xl font-black italic tracking-tighter text-primary">
            V-PULSE
          </h1>

          <p className="font-medium text-zinc-500">Elevate your pulse.</p>
        </div>

        <div className="mb-8 space-y-4">
          <button
            type="button"
            onClick={handleGoogleDemoLogin}
            className="flex h-14 w-full items-center justify-center gap-3 rounded-2xl bg-white font-bold text-black transition-transform active:scale-95"
          >
            <LogIn size={20} />
            Continue with Google
          </button>

          <button
            type="button"
            onClick={handleGuestLogin}
            className="flex h-14 w-full items-center justify-center gap-3 rounded-2xl border border-zinc-800 bg-zinc-900 font-black uppercase tracking-widest text-white transition-transform active:scale-95"
          >
            <Sparkles size={20} className="text-primary" />
            Continue as Guest
          </button>
        </div>

        <div className="mb-8 flex items-center gap-4">
          <div className="h-px flex-1 bg-zinc-800" />
          <span className="text-xs font-bold uppercase tracking-widest text-zinc-600">
            or
          </span>
          <div className="h-px flex-1 bg-zinc-800" />
        </div>

        {error && (
          <div className="mb-4 flex items-start gap-3 rounded-2xl border border-primary/20 bg-primary/10 p-4 text-xs font-bold uppercase tracking-widest text-primary">
            <AlertCircle size={18} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div className="relative">
              <User
                className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500"
                size={20}
              />

              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                className={`h-14 w-full rounded-2xl border bg-zinc-900 pl-12 pr-4 outline-none transition-all ${
                  usernameUnavailable
                    ? 'border-red-500 focus:border-red-500'
                    : 'border-zinc-800 focus:border-primary focus:ring-1 focus:ring-primary'
                }`}
                required
              />

              {usernameUnavailable && (
                <p className="mt-2 pl-2 text-[10px] font-black uppercase tracking-widest text-red-500">
                  Username unavailable
                </p>
              )}
            </div>
          )}

          <div className="relative">
            <Mail
              className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500"
              size={20}
            />

            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="h-14 w-full rounded-2xl border border-zinc-800 bg-zinc-900 pl-12 pr-4 outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary"
              required
            />
          </div>

          <div className="relative">
            <Lock
              className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500"
              size={20}
            />

            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password e.g. Goldengates@27"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="h-14 w-full rounded-2xl border border-zinc-800 bg-zinc-900 pl-12 pr-12 font-mono outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary"
              required
            />

            <button
              type="button"
              onClick={() => setShowPassword((current) => !current)}
              className="tap-target absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <button
            type="submit"
            className="mt-4 h-14 w-full rounded-2xl bg-primary font-black uppercase tracking-widest text-black shadow-[0_0_20px_rgba(255,92,0,0.4)] transition-all active:scale-95"
          >
            {isLogin ? 'Sign In' : 'Sign Up'}
          </button>
        </form>

        <p className="mt-8 text-center font-medium text-zinc-500">
          {isLogin ? 'New here?' : 'Joined before?'}{' '}
          <button
            type="button"
            onClick={() => {
              setIsLogin((current) => !current);
              setError('');
            }}
            className="font-bold text-primary hover:underline"
          >
            {isLogin ? 'Create Pulse' : 'Login Now'}
          </button>
        </p>
      </motion.div>
    </div>
  );
}
