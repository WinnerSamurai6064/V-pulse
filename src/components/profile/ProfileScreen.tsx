import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Settings, Grid, Bookmark, Tag, Image as ImageIcon, MapPin, Link as LinkIcon, Camera } from 'lucide-react';

export default function ProfileScreen() {
  const [activeTab, setActiveTab] = useState('posts');
  
  const user = {
    username: 'pulse_pioneer',
    bio: 'Digital explorer navigating the neon landscape. ⚡️ Creative at heart, coder by trade.',
    followers: 12400,
    following: 842,
    posts: 156,
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200',
    cover: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=1200'
  };

  const tabs = [
    { id: 'posts', icon: Grid },
    { id: 'saved', icon: Bookmark },
    { id: 'tagged', icon: Tag },
  ];

  const mockPosts = Array.from({ length: 9 }).map((_, i) => ({
    id: i,
    image: `https://picsum.photos/seed/${i + 50}/800/800`
  }));

  return (
    <div className="pb-24 bg-black min-h-screen">
      {/* Cover Backdrop */}
      <div className="relative h-64 w-full bg-zinc-900 group">
        <img src={user.cover} alt="Cover" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/20" />
        <button className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-md p-3 rounded-full border border-white/20 tap-target text-white/80 active:scale-95 transition-all">
          <Camera size={20} />
        </button>
      </div>

      {/* Profile Header */}
      <div className="px-6 -mt-16 relative z-10">
        <div className="flex justify-between items-end mb-6">
          <div className="relative group">
            <div className="w-32 h-32 rounded-3xl border-4 border-black p-1 bg-gradient-to-tr from-primary to-orange-500 overflow-hidden shadow-2xl">
              <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover rounded-2xl" />
            </div>
            <button className="absolute -bottom-2 -right-2 bg-primary text-black p-2 rounded-xl shadow-lg tap-target border-2 border-black active:scale-95 transition-all">
              <Camera size={16} strokeWidth={3} />
            </button>
          </div>
          <div className="flex gap-3 pb-2">
            <button className="bg-zinc-900 border border-zinc-800 text-white font-bold h-10 px-6 rounded-xl text-sm active:scale-95 transition-all">
              Edit Profile
            </button>
            <button className="bg-zinc-900 border border-zinc-800 text-white p-2 rounded-xl tap-target active:scale-95 transition-all">
              <Settings size={20} />
            </button>
          </div>
        </div>

        <div>
          <h1 className="text-2xl font-black tracking-tight mb-1">{user.username}</h1>
          <p className="text-zinc-400 text-sm leading-relaxed mb-6 max-w-xs">{user.bio}</p>
        </div>

        {/* Stats */}
        <div className="flex gap-8 mb-8 py-4 border-y border-zinc-900">
          <div className="flex flex-col">
            <span className="text-lg font-black">{user.posts}</span>
            <span className="text-[10px] uppercase tracking-widest font-bold text-zinc-500 text-center">Posts</span>
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-black">{(user.followers / 1000).toFixed(1)}K</span>
            <span className="text-[10px] uppercase tracking-widest font-bold text-zinc-500 text-center">Followers</span>
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-black">{user.following}</span>
            <span className="text-[10px] uppercase tracking-widest font-bold text-zinc-500 text-center">Following</span>
          </div>
        </div>
      </div>

      {/* Content Tabs */}
      <div className="flex justify-around border-b border-zinc-900 mb-0.5">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`tap-target flex-1 relative transition-colors ${
              activeTab === tab.id ? 'text-primary' : 'text-zinc-500'
            }`}
          >
            <tab.icon size={22} />
            {activeTab === tab.id && (
              <motion.div
                layoutId="profile-tab"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary shadow-[0_0_8px_#FF6B00]"
              />
            )}
          </button>
        ))}
      </div>

      {/* Grid */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="grid grid-cols-3 gap-[2px]"
        >
          {mockPosts.map((post) => (
            <div key={post.id} className="aspect-square bg-zinc-900 group relative cursor-pointer active:scale-95 transition-transform overflow-hidden">
              <img src={post.image} alt="Post" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
