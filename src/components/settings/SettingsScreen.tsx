import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ChevronRight, Shield, Bell, HelpCircle, UserX, Trash2, Mail, ExternalLink, LogOut, ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface SettingsItemProps {
  icon: any;
  label: string;
  value?: string;
  destructive?: boolean;
  onClick?: () => void;
}

const SettingsItem = ({ icon: Icon, label, value, destructive, onClick }: SettingsItemProps) => (
  <button 
    onClick={onClick}
    className="w-full flex items-center justify-between px-6 py-4 hover:bg-zinc-900 transition-colors tap-target active:scale-[0.98]"
  >
    <div className="flex items-center gap-4">
      <div className={`p-2 rounded-xl border border-zinc-800 ${destructive ? 'bg-red-500/10 text-red-500 border-red-500/20' : 'bg-zinc-900 text-primary border-zinc-800'}`}>
        <Icon size={20} />
      </div>
      <div className="flex flex-col items-start">
        <span className={`font-bold text-sm leading-tight ${destructive ? 'text-red-500' : 'text-zinc-200'}`}>{label}</span>
        {value && <span className="text-[10px] uppercase tracking-widest font-bold text-zinc-600">{value}</span>}
      </div>
    </div>
    <ChevronRight size={18} className={destructive ? 'text-red-900' : 'text-zinc-600'} />
  </button>
);

export default function SettingsScreen({ onLogout }: { onLogout: () => void }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState('pioneer@vpulse.com');

  const groups = [
    {
      title: 'Account',
      items: [
        { icon: Mail, label: 'Email Address', value: email },
        { icon: Bell, label: 'Notifications', value: 'Pulse enabled' },
        { icon: Shield, label: 'Privacy & Security', value: 'High protection' },
      ]
    },
    {
      title: 'Support',
      items: [
        { icon: HelpCircle, label: 'Contact Support', value: 'Instant Pulse chat' },
        { icon: ExternalLink, label: 'Privacy Policy' },
      ]
    },
    {
      title: 'Danger Zone',
      items: [
        { icon: UserX, label: 'Deactivate Pulse', value: 'Temporary suspension', destructive: true },
        { icon: Trash2, label: 'Delete Account', value: 'Permanent removal', destructive: true },
      ]
    }
  ];

  const handleSupportClick = () => {
    alert("Pulse Support pinged! We'll be with you shortly.");
  };

  return (
    <div className="pb-24 pt-4 bg-black min-h-screen">
      <div className="px-6 flex items-center gap-4 mb-10">
        <button onClick={() => navigate('/')} className="tap-target -ml-2 text-primary">
          <ChevronLeft size={28} strokeWidth={3} />
        </button>
        <h1 className="text-2xl font-black italic tracking-tighter text-primary neon-text">SETTINGS</h1>
      </div>

      <div className="space-y-8">
        {groups.map((group) => (
          <div key={group.title}>
            <div className="px-6 mb-2">
              <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600">{group.title}</h2>
            </div>
            <div className="border-y border-zinc-900 bg-zinc-950/30">
              {group.items.map((item) => (
                <SettingsItem 
                  key={item.label} 
                  {...item} 
                  onClick={item.label === 'Contact Support' ? handleSupportClick : undefined}
                />
              ))}
            </div>
          </div>
        ))}
        
        <div className="px-6 pt-4">
          <button 
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-3 bg-zinc-900 border border-zinc-800 text-white font-black uppercase tracking-widest h-14 rounded-2xl active:scale-95 transition-all text-xs"
          >
            <LogOut size={18} className="text-red-500" />
            End Current Session
          </button>
          
          <p className="text-center mt-12 text-[9px] font-black text-zinc-800 uppercase tracking-[0.3em]">
            V-PULSE V1.0.4 - SYSTEM SECURE
          </p>
        </div>
      </div>
    </div>
  );
}
