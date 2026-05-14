import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Heart, Share2 } from 'lucide-react';
import Post from './Post';

interface StoryItemProps {
  username: string;
  avatar: string;
  isSeen?: boolean;
}

const StoryItem: React.FC<StoryItemProps> = ({ username, avatar, isSeen = false }) => (
  <div className="flex flex-col items-center gap-2 shrink-0">
    <div className={`w-20 h-20 rounded-full p-[3px] ${isSeen ? 'bg-zinc-800' : 'bg-gradient-to-tr from-primary to-orange-400 p-[3px]'}`}>
      <div className="w-full h-full bg-black rounded-full p-1">
        <img src={avatar} alt={username} className="w-full h-full object-cover rounded-full" />
      </div>
    </div>
    <span className="text-[10px] font-bold tracking-tight text-center truncate w-20 uppercase tracking-wider text-zinc-400">
      {username}
    </span>
  </div>
);

export default function FeedScreen() {
  const stories = [
    { id: 1, username: 'your story', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200' },
    { id: 2, username: 'alex_pulse', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200' },
    { id: 3, username: 'cyber_vibe', avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=200' },
    { id: 4, username: 'neon.knight', avatar: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?auto=format&fit=crop&q=80&w=200' },
    { id: 5, username: 'luna_x', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=200' },
  ];

  const posts = [
    {
      id: 1,
      username: 'cyber_vibe',
      avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=200',
      image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=800',
      caption: 'The future is neon. Living my best life in the grid. #vpulse #neon #vibes',
      likes: 1240,
      comments: 48,
      time: '2 hours ago',
      aspectRatio: '1:1' as const
    },
    {
      id: 2,
      username: 'neon.knight',
      avatar: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?auto=format&fit=crop&q=80&w=200',
      image: 'https://images.unsplash.com/photo-1614850523296-d8c1af93d400?auto=format&fit=crop&q=80&w=800',
      caption: 'Rainy nights in Neo-Tokyo hit different. 🏙️✨',
      likes: 850,
      comments: 12,
      time: '5 hours ago',
      aspectRatio: '4:5' as const
    }
  ];

  return (
    <div className="pb-24 pt-4 bg-black min-h-screen">
      {/* Top Header */}
      <div className="px-6 flex justify-between items-center mb-8 sticky top-0 bg-black/50 backdrop-blur-md py-4 z-40">
        <h1 className="text-2xl font-black italic tracking-tighter text-primary neon-text">V-PULSE</h1>
        <div className="flex gap-4">
          <button className="tap-target relative">
            <Heart size={24} />
            <div className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full shadow-[0_0_5px_var(--color-primary)]" />
          </button>
          <button className="tap-target">
            <Share2 size={24} />
          </button>
        </div>
      </div>

      {/* Stories */}
      <div className="flex gap-4 overflow-x-auto px-6 mb-8 no-scrollbar scroll-smooth pb-2">
        {stories.map(story => (
          <StoryItem key={story.id} username={story.username} avatar={story.avatar} />
        ))}
      </div>

      {/* Feed */}
      <div className="px-4 space-y-2">
        {posts.map(post => (
          <Post 
            key={post.id} 
            username={post.username} 
            avatar={post.avatar}
            image={post.image}
            caption={post.caption}
            likes={post.likes}
            comments={post.comments}
            time={post.time}
            aspectRatio={post.aspectRatio}
          />
        ))}
      </div>
    </div>
  );
}
