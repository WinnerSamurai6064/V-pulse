import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, Lock, Eye, EyeOff, Github, LogIn } from 'lucide-react';

export default function AuthScreen({ onLogin }: { onLogin: () => void }) {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const sanitizeStr = (str: string) => str.replace(/[<>\"\'\%;\(\)\&\+\/]/g, "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = sanitizeStr(email);
    const cleanPass = sanitizeStr(password);
    
    if (cleanEmail && cleanPass) {
      // Mock validation success
      onLogin();
    }
  };

  return (
    <div className="flex flex-col min-h-screen items-center justify-center p-6 bg-black">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm"
      >
        <div className="text-center mb-12">
          <h1 className="text-5xl font-black italic tracking-tighter text-primary neon-text mb-2">V-PULSE</h1>
          <p className="text-zinc-500 font-medium">Elevate your pulse.</p>
        </div>

        <div className="space-y-4 mb-8">
          <button className="w-full flex items-center justify-center gap-3 bg-white text-black font-bold h-14 rounded-2xl active:scale-95 transition-transform">
            <LogIn size={20} />
            Continue with Google
          </button>
        </div>

        <div className="flex items-center gap-4 mb-8">
          <div className="h-px flex-1 bg-zinc-800" />
          <span className="text-xs font-bold text-zinc-600 uppercase tracking-widest">or</span>
          <div className="h-px flex-1 bg-zinc-800" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={20} />
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-14 bg-zinc-900 border border-zinc-800 rounded-2xl pl-12 pr-4 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
              required
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={20} />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full h-14 bg-zinc-900 border border-zinc-800 rounded-2xl pl-12 pr-12 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all font-mono"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white tap-target"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <button
            type="submit"
            className="w-full bg-primary text-black font-black uppercase tracking-widest h-14 rounded-2xl shadow-[0_0_20px_rgba(255,92,0,0.4)] active:scale-95 transition-all mt-4"
          >
            {isLogin ? "Sign In" : "Sign Up"}
          </button>
        </form>

        <p className="text-center mt-8 text-zinc-500 font-medium">
          {isLogin ? "New here?" : "Joined before?"}{" "}
          <button 
            onClick={() => setIsLogin(!isLogin)}
            className="text-primary font-bold hover:underline"
          >
            {isLogin ? "Create Pulse" : "Login Now"}
          </button>
        </p>
      </motion.div>
    </div>
  );
}
