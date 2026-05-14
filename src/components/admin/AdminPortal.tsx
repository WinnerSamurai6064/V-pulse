import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, Activity, Users, Database, Lock, Terminal, AlertTriangle, RefreshCw } from 'lucide-react';

export default function AdminPortal() {
  const [authorized, setAuthorized] = useState(false);
  const [accessCode, setAccessCode] = useState('');

  const stats = [
    { label: 'Network Pulse', value: '98.4%', icon: Activity, color: 'text-primary' },
    { label: 'Active Particles', value: '14.2K', icon: Users, color: 'text-blue-400' },
    { label: 'Grid Latency', value: '12ms', icon: RefreshCw, color: 'text-green-400' },
    { label: 'Sync Errors', value: '0', icon: AlertTriangle, color: 'text-zinc-600' },
  ];

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (accessCode === 'SYSTEM_PULSE_2026') {
      setAuthorized(true);
    } else {
      alert('ACCESS DENIED: SECURE PROTOCOL BREACH');
      setAccessCode('');
    }
  };

  if (!authorized) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-6 border-4 border-red-950/20">
        <div className="w-full max-w-sm text-center">
          <div className="inline-block p-4 rounded-full bg-red-500/10 text-red-500 mb-8 border border-red-500/20 shadow-[0_0_20px_rgba(239,68,68,0.2)]">
            <Lock size={48} strokeWidth={2.5} />
          </div>
          <h1 className="text-4xl font-black italic tracking-tighter text-red-500 neon-text mb-2">V-PULSE CORE</h1>
          <p className="text-zinc-500 font-bold uppercase tracking-[0.2em] text-[10px] mb-12">Authorized Personnel Only</p>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="relative">
              <Terminal className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" size={18} />
              <input
                type="password"
                placeholder="EXEC_OVERRIDE_CODE"
                value={accessCode}
                onChange={(e) => setAccessCode(e.target.value)}
                className="w-full h-14 bg-zinc-950 border border-red-900/30 rounded-xl pl-12 focus:border-red-500 font-mono text-sm uppercase transition-all tracking-widest text-red-500 placeholder:text-red-900/50 outline-none"
              />
            </div>
            <button className="w-full bg-red-600 text-white font-black h-14 rounded-xl active:scale-95 transition-all shadow-lg shadow-red-900/20">
              INITIATE OVERRIDE
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black p-8 font-mono">
      <div className="max-w-6xl mx-auto">
        <header className="flex justify-between items-center mb-12 pb-8 border-b border-zinc-800">
          <div className="flex items-center gap-4">
            <div className="bg-primary p-2 rounded-lg text-black">
              <ShieldCheck size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-primary tracking-tight">V-PULSE COMMAND</h1>
              <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Core Infrastructure v4.2.0-Alpha</p>
            </div>
          </div>
          <div className="hidden md:flex gap-4">
            <span className="text-[10px] bg-zinc-900 border border-zinc-800 rounded px-3 py-1 flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              SYSTEMS OPTIMAL
            </span>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-zinc-900/30 border border-zinc-800/50 p-6 rounded-3xl">
              <div className="flex justify-between items-start mb-4">
                <div className={`p-2 rounded-xl bg-zinc-950 border border-zinc-800 ${stat.color}`}>
                  <stat.icon size={20} />
                </div>
                <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-wider">Live</span>
              </div>
              <h3 className="text-zinc-400 text-xs font-bold uppercase tracking-widest mb-1">{stat.label}</h3>
              <p className="text-3xl font-black text-white">{stat.value}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 m3-card bg-zinc-950 border-zinc-800 p-8">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-lg font-black text-white flex items-center gap-2 italic uppercase tracking-tighter">
                <Activity size={20} className="text-primary" />
                Network Throughput
              </h2>
              <div className="flex gap-2">
                <button className="bg-zinc-900 border border-zinc-800 text-[10px] px-3 py-1 rounded-lg">1H</button>
                <button className="bg-primary text-black text-[10px] px-3 py-1 rounded-lg font-bold">24H</button>
              </div>
            </div>
            <div className="h-64 flex items-end gap-2 overflow-hidden px-2">
              {Array.from({ length: 48 }).map((_, i) => (
                <div 
                  key={i} 
                  className="flex-1 bg-primary/20 rounded-t-sm hover:bg-primary transition-all cursor-crosshair group relative"
                  style={{ height: `${Math.random() * 80 + 20}%` }}
                >
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-white text-black text-[8px] font-black px-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    {Math.floor(Math.random() * 1000)} REQ
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="m3-card bg-zinc-950 border-zinc-800 p-8">
            <h2 className="text-lg font-black text-white flex items-center gap-2 italic uppercase tracking-tighter mb-8">
              <Terminal size={20} className="text-primary" />
              Exec Log
            </h2>
            <div className="space-y-4 font-mono text-[10px] text-zinc-500 overflow-y-auto max-h-[300px] no-scrollbar">
              <p><span className="text-green-500">[OK]</span> DB_SYNC_SUCCESS - 12:45:01</p>
              <p><span className="text-primary">[INFO]</span> REQ_PARTICLE_LOAD - 12:45:03</p>
              <p><span className="text-zinc-700">[LOG]</span> AUTH_TICKET_STORED - 12:45:08</p>
              <p><span className="text-green-500">[OK]</span> CDN_CACHE_FLUSHED - 12:45:12</p>
              <p><span className="text-primary">[INFO]</span> HEARTBEAT_EMIT - 12:45:15</p>
              <p><span className="text-zinc-700">[LOG]</span> POST_IMAGE_CROP_V2 - 12:45:22</p>
              <p><span className="text-green-500">[OK]</span> ASSET_LOAD_PROTO - 12:45:28</p>
              <p><span className="text-zinc-700">[LOG]</span> SESSION_ALIVE_CHK - 12:45:33</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
