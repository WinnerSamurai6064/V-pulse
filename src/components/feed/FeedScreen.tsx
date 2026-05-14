import React, { useEffect, useState } from 'react';
import { Heart, Share2 } from 'lucide-react';
import Post from './Post';

import { realtime } from '../../lib/realtime';

interface StoryItemProps {
  username: string;
  avatar: string;
  isSeen?: boolean;
}

type FeedPost = {
  id: string | number;
  username: string;
  avatar: string;
  image: string;
  caption: string;
  likes: number;
  comments: number;
  time: string;
  aspectRatio: '1:1' | '4:5';
};

type ServerPost = {
  id: string;
  author?: string;
  avatar?: string;
  caption?: string;
  imageUrl?: string;
  likes?: number;
  createdAt?: string;
};

const StoryItem: React.FC<StoryItemProps> = ({
  username,
  avatar,
  isSeen = false,
}) => (
  <div className="flex shrink-0 flex-col items-center gap-2">
    <div
      className={`h-20 w-20 rounded-full p-[3px] ${
        isSeen ? 'bg-zinc-800' : 'bg-gradient-to-tr from-primary to-orange-400'
      }`}
    >
      <div className="h-full w-full rounded-full bg-black p-1">
        <img
          src={avatar}
          alt={username}
          className="h-full w-full rounded-full object-cover"
        />
      </div>
    </div>

    <span className="w-20 truncate text-center text-[10px] font-bold uppercase tracking-wider text-zinc-400">
      {username}
    </span>
  </div>
);

const stories = [
  {
    id: 1,
    username: 'your story',
    avatar:
      'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200',
  },
  {
    id: 2,
    username: 'alex_pulse',
    avatar:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200',
  },
  {
    id: 3,
    username: 'cyber_vibe',
    avatar:
      'https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=200',
  },
  {
    id: 4,
    username: 'neon.knight',
    avatar:
      'https://images.unsplash.com/photo-1527980965255-d3b416303d12?auto=format&fit=crop&q=80&w=200',
  },
  {
    id: 5,
    username: 'luna_x',
    avatar:
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=200',
  },
];

const fallbackAvatar =
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200';

const fallbackImage =
  'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=800';

const seedPosts: FeedPost[] = [
  {
    id: 'seed_1',
    username: 'cyber_vibe',
    avatar:
      'https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=200',
    image:
      'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=800',
    caption:
      'The future is neon. Living my best life in the grid. #vpulse #neon #vibes',
    likes: 1240,
    comments: 48,
    time: '2 hours ago',
    aspectRatio: '1:1',
  },
  {
    id: 'seed_2',
    username: 'neon.knight',
    avatar:
      'https://images.unsplash.com/photo-1527980965255-d3b416303d12?auto=format&fit=crop&q=80&w=200',
    image:
      'https://images.unsplash.com/photo-1614850523296-d8c1af93d400?auto=format&fit=crop&q=80&w=800',
    caption: 'Rainy nights in Neo-Tokyo hit different. 🏙️✨',
    likes: 850,
    comments: 12,
    time: '5 hours ago',
    aspectRatio: '4:5',
  },
];

function getTimeAgo(value?: string) {
  if (!value) return 'Just now';

  const created = new Date(value);
  const seconds = Math.floor((Date.now() - created.getTime()) / 1000);

  if (Number.isNaN(seconds) || seconds < 60) return 'Just now';

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} minutes ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hours ago`;

  const days = Math.floor(hours / 24);
  return `${days} days ago`;
}

function normalizeServerPost(post: ServerPost): FeedPost {
  return {
    id: post.id,
    username: post.author || 'guest_pulse',
    avatar: post.avatar || fallbackAvatar,
    image: post.imageUrl || fallbackImage,
    caption: post.caption || '',
    likes: post.likes || 0,
    comments: 0,
    time: getTimeAgo(post.createdAt),
    aspectRatio: '1:1',
  };
}

export default function FeedScreen() {
  const [posts, setPosts] = useState<FeedPost[]>(seedPosts);
  const [isLive, setIsLive] = useState(false);

  useEffect(() => {
    realtime.connect();
    realtime.send('state:get');

    fetch('/api/state')
      .then((response) => response.json())
      .then((data) => {
        if (!Array.isArray(data.posts)) return;

        const serverPosts = data.posts.map(normalizeServerPost);

        if (serverPosts.length > 0) {
          setPosts([...serverPosts, ...seedPosts]);
        }
      })
      .catch(() => {
        // Frontend dev server may not have /api/state.
        // WebSocket will still work after build + server.
      });

    const offOpen = realtime.on('socket:open', () => {
      setIsLive(true);
      realtime.send('state:get');
    });

    const offClose = realtime.on('socket:close', () => {
      setIsLive(false);
    });

    const offState = realtime.on('state:update', (data) => {
      if (!Array.isArray(data.state?.posts)) return;

      const serverPosts = data.state.posts.map(normalizeServerPost);
      setPosts([...serverPosts, ...seedPosts]);
    });

    const offNewPost = realtime.on('post:new', (data) => {
      if (!data.post) return;

      const nextPost = normalizeServerPost(data.post);

      setPosts((current) => {
        const exists = current.some((post) => post.id === nextPost.id);

        if (exists) return current;

        return [nextPost, ...current];
      });
    });

    const offLiked = realtime.on('post:liked', (data) => {
      if (!data.postId) return;

      setPosts((current) =>
        current.map((post) =>
          post.id === data.postId
            ? {
                ...post,
                likes: typeof data.likes === 'number' ? data.likes : post.likes,
              }
            : post
        )
      );
    });

    const offEdited = realtime.on('post:edited', (data) => {
      if (!data.post) return;

      const editedPost = normalizeServerPost(data.post);

      setPosts((current) =>
        current.map((post) => (post.id === editedPost.id ? editedPost : post))
      );
    });

    const offDeleted = realtime.on('post:deleted', (data) => {
      if (!data.postId) return;

      setPosts((current) => current.filter((post) => post.id !== data.postId));
    });

    return () => {
      offOpen();
      offClose();
      offState();
      offNewPost();
      offLiked();
      offEdited();
      offDeleted();
    };
  }, []);

  return (
    <div className="min-h-screen bg-black pb-24 pt-4">
      <div className="sticky top-0 z-40 mb-8 flex items-center justify-between bg-black/50 px-6 py-4 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <h1 className="neon-text text-2xl font-black italic tracking-tighter text-primary">
            V-PULSE
          </h1>

          <div
            className={`h-2 w-2 rounded-full ${
              isLive
                ? 'bg-primary shadow-[0_0_8px_var(--color-primary)]'
                : 'bg-zinc-700'
            }`}
            title={isLive ? 'Realtime connected' : 'Realtime offline'}
          />
        </div>

        <div className="flex gap-4">
          <button className="tap-target relative">
            <Heart size={24} />
            <div className="absolute right-2 top-2 h-2 w-2 rounded-full bg-primary shadow-[0_0_5px_var(--color-primary)]" />
          </button>

          <button
            className="tap-target"
            onClick={() => {
              if (navigator.share) {
                navigator.share({
                  title: 'V-PULSE',
                  text: 'Join me on V-PULSE.',
                  url: window.location.origin,
                });
              }
            }}
          >
            <Share2 size={24} />
          </button>
        </div>
      </div>

      <div className="no-scrollbar mb-8 flex gap-4 overflow-x-auto scroll-smooth px-6 pb-2">
        {stories.map((story) => (
          <StoryItem
            key={story.id}
            username={story.username}
            avatar={story.avatar}
          />
        ))}
      </div>

      <div className="space-y-2 px-4">
        {posts.map((post) => (
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
