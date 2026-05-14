import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Settings,
  Grid,
  Bookmark,
  Tag,
  Camera,
  X,
  Check,
  Link as LinkIcon,
  MapPin,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

type ProfileTab = 'posts' | 'saved' | 'tagged';

type UserProfile = {
  username: string;
  displayName: string;
  bio: string;
  location: string;
  website: string;
  followers: number;
  following: number;
  posts: number;
  avatar: string;
  cover: string;
};

const defaultAvatar =
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200';

const defaultCover =
  'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=1200';

function loadProfile(): UserProfile {
  const username = localStorage.getItem('vpulse_username') || 'pulse_pioneer';

  return {
    username,
    displayName: localStorage.getItem('vpulse_display_name') || username,
    bio:
      localStorage.getItem('vpulse_bio') ||
      'Digital explorer navigating the neon landscape. ⚡️ Creative at heart, coder by trade.',
    location: localStorage.getItem('vpulse_location') || 'Neon Grid',
    website: localStorage.getItem('vpulse_website') || 'vpulse.local',
    followers: 12400,
    following: 842,
    posts: 156,
    avatar: localStorage.getItem('vpulse_avatar') || defaultAvatar,
    cover: localStorage.getItem('vpulse_cover') || defaultCover,
  };
}

function shortNumber(value: number) {
  if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
  return value.toString();
}

export default function ProfileScreen() {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<ProfileTab>('posts');
  const [user, setUser] = useState<UserProfile>(() => loadProfile());
  const [isEditing, setIsEditing] = useState(false);

  const [draftDisplayName, setDraftDisplayName] = useState(user.displayName);
  const [draftBio, setDraftBio] = useState(user.bio);
  const [draftLocation, setDraftLocation] = useState(user.location);
  const [draftWebsite, setDraftWebsite] = useState(user.website);

  const tabs = [
    { id: 'posts' as const, icon: Grid },
    { id: 'saved' as const, icon: Bookmark },
    { id: 'tagged' as const, icon: Tag },
  ];

  const mockPosts = useMemo(
    () =>
      Array.from({ length: 9 }).map((_, index) => ({
        id: index,
        image: `https://picsum.photos/seed/${activeTab}_${index + 50}/800/800`,
      })),
    [activeTab]
  );

  const handleSaveProfile = () => {
    const nextProfile = {
      ...user,
      displayName: draftDisplayName.trim() || user.username,
      bio: draftBio.trim(),
      location: draftLocation.trim(),
      website: draftWebsite.trim(),
    };

    localStorage.setItem('vpulse_display_name', nextProfile.displayName);
    localStorage.setItem('vpulse_bio', nextProfile.bio);
    localStorage.setItem('vpulse_location', nextProfile.location);
    localStorage.setItem('vpulse_website', nextProfile.website);

    setUser(nextProfile);
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setDraftDisplayName(user.displayName);
    setDraftBio(user.bio);
    setDraftLocation(user.location);
    setDraftWebsite(user.website);
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-black pb-24">
      <div className="group relative h-64 w-full bg-zinc-900">
        <img src={user.cover} alt="Cover" className="h-full w-full object-cover" />

        <div className="absolute inset-0 bg-black/20" />

        <button
          type="button"
          className="tap-target absolute bottom-4 right-4 rounded-full border border-white/20 bg-black/60 p-3 text-white/80 backdrop-blur-md transition-all active:scale-95"
          onClick={() => alert('Cover upload will connect after storage is added.')}
        >
          <Camera size={20} />
        </button>
      </div>

      <div className="relative z-10 -mt-16 px-6">
        <div className="mb-6 flex items-end justify-between">
          <div className="group relative">
            <div className="h-32 w-32 overflow-hidden rounded-3xl border-4 border-black bg-gradient-to-tr from-primary to-orange-500 p-1 shadow-2xl">
              <img
                src={user.avatar}
                alt={user.username}
                className="h-full w-full rounded-2xl object-cover"
              />
            </div>

            <button
              type="button"
              onClick={() => alert('Avatar upload will connect after storage is added.')}
              className="tap-target absolute -bottom-2 -right-2 rounded-xl border-2 border-black bg-primary p-2 text-black shadow-lg transition-all active:scale-95"
            >
              <Camera size={16} strokeWidth={3} />
            </button>
          </div>

          <div className="flex gap-3 pb-2">
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="h-10 rounded-xl border border-zinc-800 bg-zinc-900 px-6 text-sm font-bold text-white transition-all active:scale-95"
            >
              Edit Profile
            </button>

            <button
              type="button"
              onClick={() => navigate('/settings')}
              className="tap-target rounded-xl border border-zinc-800 bg-zinc-900 p-2 text-white transition-all active:scale-95"
            >
              <Settings size={20} />
            </button>
          </div>
        </div>

        <div>
          <h1 className="mb-1 text-2xl font-black tracking-tight">
            {user.displayName}
          </h1>

          <p className="mb-3 text-xs font-black uppercase tracking-[0.2em] text-primary">
            @{user.username}
          </p>

          <p className="mb-4 max-w-xs text-sm leading-relaxed text-zinc-400">
            {user.bio}
          </p>

          <div className="mb-6 flex flex-wrap gap-3 text-xs font-bold text-zinc-500">
            {user.location && (
              <span className="flex items-center gap-1">
                <MapPin size={14} className="text-primary" />
                {user.location}
              </span>
            )}

            {user.website && (
              <span className="flex items-center gap-1">
                <LinkIcon size={14} className="text-primary" />
                {user.website}
              </span>
            )}
          </div>
        </div>

        <div className="mb-8 flex gap-8 border-y border-zinc-900 py-4">
          <div className="flex flex-col">
            <span className="text-lg font-black">{user.posts}</span>
            <span className="text-center text-[10px] font-bold uppercase tracking-widest text-zinc-500">
              Posts
            </span>
          </div>

          <div className="flex flex-col">
            <span className="text-lg font-black">{shortNumber(user.followers)}</span>
            <span className="text-center text-[10px] font-bold uppercase tracking-widest text-zinc-500">
              Followers
            </span>
          </div>

          <div className="flex flex-col">
            <span className="text-lg font-black">{user.following}</span>
            <span className="text-center text-[10px] font-bold uppercase tracking-widest text-zinc-500">
              Following
            </span>
          </div>
        </div>
      </div>

      <div className="mb-0.5 flex justify-around border-b border-zinc-900">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`tap-target relative flex-1 transition-colors ${
                isActive ? 'text-primary' : 'text-zinc-500'
              }`}
            >
              <Icon size={22} />

              {isActive && (
                <motion.div
                  layoutId="profile-tab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary shadow-[0_0_8px_#FF6B00]"
                />
              )}
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="grid grid-cols-3 gap-[2px]"
        >
          {mockPosts.map((post) => (
            <div
              key={post.id}
              className="group relative aspect-square cursor-pointer overflow-hidden bg-zinc-900 transition-transform active:scale-95"
            >
              <img
                src={post.image}
                alt="Post"
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
              />

              <div className="absolute inset-0 bg-primary/20 opacity-0 transition-opacity group-hover:opacity-100" />
            </div>
          ))}
        </motion.div>
      </AnimatePresence>

      <AnimatePresence>
        {isEditing && (
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
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-lg font-black uppercase tracking-tight text-white">
                  Edit Profile
                </h2>

                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="tap-target text-zinc-500 hover:text-white"
                >
                  <X size={22} />
                </button>
              </div>

              <div className="space-y-4">
                <label className="block">
                  <span className="mb-2 block text-[10px] font-black uppercase tracking-widest text-zinc-600">
                    Display Name
                  </span>

                  <input
                    value={draftDisplayName}
                    onChange={(event) =>
                      setDraftDisplayName(event.target.value.substring(0, 40))
                    }
                    className="h-12 w-full rounded-2xl border border-zinc-800 bg-zinc-900 px-4 text-sm font-bold outline-none focus:border-primary"
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-[10px] font-black uppercase tracking-widest text-zinc-600">
                    Bio
                  </span>

                  <textarea
                    value={draftBio}
                    onChange={(event) =>
                      setDraftBio(event.target.value.substring(0, 140))
                    }
                    className="min-h-24 w-full resize-none rounded-2xl border border-zinc-800 bg-zinc-900 p-4 text-sm outline-none focus:border-primary"
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-[10px] font-black uppercase tracking-widest text-zinc-600">
                    Location
                  </span>

                  <input
                    value={draftLocation}
                    onChange={(event) =>
                      setDraftLocation(event.target.value.substring(0, 40))
                    }
                    className="h-12 w-full rounded-2xl border border-zinc-800 bg-zinc-900 px-4 text-sm font-bold outline-none focus:border-primary"
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-[10px] font-black uppercase tracking-widest text-zinc-600">
                    Website
                  </span>

                  <input
                    value={draftWebsite}
                    onChange={(event) =>
                      setDraftWebsite(event.target.value.substring(0, 60))
                    }
                    className="h-12 w-full rounded-2xl border border-zinc-800 bg-zinc-900 px-4 text-sm font-bold outline-none focus:border-primary"
                  />
                </label>
              </div>

              <div className="mt-6 flex gap-3">
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="h-12 flex-1 rounded-2xl border border-zinc-800 bg-zinc-900 text-xs font-black uppercase tracking-widest text-white"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleSaveProfile}
                  className="flex h-12 flex-1 items-center justify-center gap-2 rounded-2xl bg-primary text-xs font-black uppercase tracking-widest text-black"
                >
                  <Check size={16} />
                  Save
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
