import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ChevronRight,
  Shield,
  Bell,
  HelpCircle,
  UserX,
  Trash2,
  Mail,
  ExternalLink,
  LogOut,
  ChevronLeft,
  X,
  Check,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface SettingsItemProps {
  icon: any;
  label: string;
  value?: string;
  destructive?: boolean;
  onClick?: () => void;
}

type ConfirmAction = 'deactivate' | 'delete' | null;

const SettingsItem = ({
  icon: Icon,
  label,
  value,
  destructive,
  onClick,
}: SettingsItemProps) => (
  <button
    type="button"
    onClick={onClick}
    className="tap-target flex w-full items-center justify-between px-6 py-4 transition-colors active:scale-[0.98] hover:bg-zinc-900"
  >
    <div className="flex items-center gap-4">
      <div
        className={`rounded-xl border p-2 ${
          destructive
            ? 'border-red-500/20 bg-red-500/10 text-red-500'
            : 'border-zinc-800 bg-zinc-900 text-primary'
        }`}
      >
        <Icon size={20} />
      </div>

      <div className="flex flex-col items-start">
        <span
          className={`text-sm font-bold leading-tight ${
            destructive ? 'text-red-500' : 'text-zinc-200'
          }`}
        >
          {label}
        </span>

        {value && (
          <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-600">
            {value}
          </span>
        )}
      </div>
    </div>

    <ChevronRight
      size={18}
      className={destructive ? 'text-red-900' : 'text-zinc-600'}
    />
  </button>
);

export default function SettingsScreen({ onLogout }: { onLogout: () => void }) {
  const navigate = useNavigate();

  const [email] = useState('pioneer@vpulse.com');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [confirmAction, setConfirmAction] = useState<ConfirmAction>(null);
  const [supportPinged, setSupportPinged] = useState(false);

  const handleSupportClick = () => {
    setSupportPinged(true);

    setTimeout(() => {
      setSupportPinged(false);
    }, 2200);
  };

  const handlePrivacyPolicy = () => {
    alert('Privacy Policy page is not connected yet.');
  };

  const handleDeactivate = () => {
    setConfirmAction('deactivate');
  };

  const handleDelete = () => {
    setConfirmAction('delete');
  };

  const handleConfirmDangerAction = () => {
    if (confirmAction === 'deactivate') {
      localStorage.setItem('vpulse_deactivated', 'true');
      onLogout();
      return;
    }

    if (confirmAction === 'delete') {
      localStorage.removeItem('vpulse_auth');
      localStorage.removeItem('vpulse_username');
      localStorage.removeItem('vpulse_deactivated');
      onLogout();
    }
  };

  const groups = [
    {
      title: 'Account',
      items: [
        {
          icon: Mail,
          label: 'Email Address',
          value: email,
          onClick: undefined,
        },
        {
          icon: Bell,
          label: 'Notifications',
          value: notificationsEnabled ? 'Pulse enabled' : 'Pulse muted',
          onClick: () => setNotificationsEnabled((current) => !current),
        },
        {
          icon: Shield,
          label: 'Privacy & Security',
          value: 'High protection',
          onClick: () => alert('Privacy controls will be wired after database auth.'),
        },
      ],
    },
    {
      title: 'Support',
      items: [
        {
          icon: HelpCircle,
          label: 'Contact Support',
          value: supportPinged ? 'Support ping sent' : 'Instant Pulse chat',
          onClick: handleSupportClick,
        },
        {
          icon: ExternalLink,
          label: 'Privacy Policy',
          onClick: handlePrivacyPolicy,
        },
      ],
    },
    {
      title: 'Danger Zone',
      items: [
        {
          icon: UserX,
          label: 'Deactivate Pulse',
          value: 'Temporary suspension',
          destructive: true,
          onClick: handleDeactivate,
        },
        {
          icon: Trash2,
          label: 'Delete Account',
          value: 'Permanent removal',
          destructive: true,
          onClick: handleDelete,
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-black pb-24 pt-4">
      <div className="mb-10 flex items-center gap-4 px-6">
        <button
          type="button"
          onClick={() => navigate('/')}
          className="tap-target -ml-2 text-primary"
        >
          <ChevronLeft size={28} strokeWidth={3} />
        </button>

        <h1 className="neon-text text-2xl font-black italic tracking-tighter text-primary">
          SETTINGS
        </h1>
      </div>

      <div className="space-y-8">
        {groups.map((group) => (
          <div key={group.title}>
            <div className="mb-2 px-6">
              <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600">
                {group.title}
              </h2>
            </div>

            <div className="border-y border-zinc-900 bg-zinc-950/30">
              {group.items.map((item) => (
                <SettingsItem key={item.label} {...item} />
              ))}
            </div>
          </div>
        ))}

        <div className="px-6 pt-4">
          <button
            type="button"
            onClick={onLogout}
            className="flex h-14 w-full items-center justify-center gap-3 rounded-2xl border border-zinc-800 bg-zinc-900 text-xs font-black uppercase tracking-widest text-white transition-all active:scale-95"
          >
            <LogOut size={18} className="text-red-500" />
            End Current Session
          </button>

          <p className="mt-12 text-center text-[9px] font-black uppercase tracking-[0.3em] text-zinc-800">
            V-PULSE V1.0.4 - SYSTEM SECURE
          </p>
        </div>
      </div>

      <AnimatePresence>
        {confirmAction && (
          <motion.div
            className="fixed inset-0 z-[200] flex items-end justify-center bg-black/70 px-4 pb-6 backdrop-blur-sm sm:items-center sm:pb-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ y: 40, scale: 0.96, opacity: 0 }}
              animate={{ y: 0, scale: 1, opacity: 1 }}
              exit={{ y: 40, scale: 0.96, opacity: 0 }}
              className="w-full max-w-sm rounded-3xl border border-zinc-800 bg-zinc-950 p-6 shadow-2xl"
            >
              <div className="mb-5 flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-lg font-black uppercase tracking-tight text-white">
                    {confirmAction === 'delete'
                      ? 'Delete Account?'
                      : 'Deactivate Pulse?'}
                  </h2>

                  <p className="mt-2 text-sm leading-relaxed text-zinc-500">
                    {confirmAction === 'delete'
                      ? 'This clears the local demo session on this device. Real permanent deletion needs database auth first.'
                      : 'This signs you out and marks this demo account as deactivated locally.'}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setConfirmAction(null)}
                  className="tap-target text-zinc-500 hover:text-white"
                >
                  <X size={22} />
                </button>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setConfirmAction(null)}
                  className="h-12 flex-1 rounded-2xl border border-zinc-800 bg-zinc-900 text-xs font-black uppercase tracking-widest text-white"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleConfirmDangerAction}
                  className="flex h-12 flex-1 items-center justify-center gap-2 rounded-2xl bg-red-500 text-xs font-black uppercase tracking-widest text-black"
                >
                  <Check size={16} />
                  Confirm
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
