import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, MessageCircle, Share2, MoreHorizontal, Bookmark } from 'lucide-react';
import StoryShare from './StoryShare';

interface PostProps {
  username: string;
  avatar: string;
  image: string;
  caption: string;
  likes: number;
  comments: number;
  time: string;
  aspectRatio: '1:1' | '4:5';
}

const Post: React.FC<PostProps> = ({ username, avatar, image, caption, likes, comments, time, aspectRatio }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [isSharing, setIsSharing] = useState(false);

  return (
    <>
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        className="m3-card mb-10 w-full max-w-lg mx-auto bg-zinc-950 border-zinc-900 shadow-[0_10px_30px_rgba(0,0,0,0.5)]"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full border-2 border-primary/30 p-0.5 overflow-hidden">
              <img src={avatar} alt={username} className="w-full h-full object-cover rounded-full" />
            </div>
            <div>
              <h3 className="font-black text-sm tracking-tighter uppercase">{username}</h3>
              <p className="text-[9px] text-zinc-600 font-black uppercase tracking-[0.2em]">{time}</p>
            </div>
          </div>
          <button className="text-zinc-700 hover:text-white tap-target transition-colors">
            <MoreHorizontal size={20} />
          </button>
        </div>

        {/* Media */}
        <div className={`relative bg-zinc-950 ${aspectRatio === '4:5' ? 'aspect-[4/5]' : 'aspect-square'} overflow-hidden group`}>
          <img src={image} alt="Post content" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[2s]" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />
        </div>

        {/* Interactions */}
        <div className="p-5">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-6">
              <motion.button 
                whileTap={{ scale: 0.8 }}
                onClick={() => setIsLiked(!isLiked)}
                className={`tap-target transition-all duration-300 ${isLiked ? 'text-primary' : 'text-zinc-200'}`}
              >
                <Heart size={28} fill={isLiked ? "currentColor" : "none"} strokeWidth={2.5} />
              </motion.button>
              <button className="tap-target text-zinc-200 hover:text-primary transition-colors">
                <MessageCircle size={28} strokeWidth={2.5} />
              </button>
              <button 
                onClick={() => setIsSharing(true)}
                className="tap-target text-zinc-200 hover:text-primary transition-colors"
              >
                <Share2 size={28} strokeWidth={2.5} />
              </button>
            </div>
            <button className="tap-target text-zinc-200 hover:text-primary transition-colors">
              <Bookmark size={28} strokeWidth={2.5} />
            </button>
          </div>

          <div className="mb-2">
            <p className="font-black text-sm tracking-tight">{likes.toLocaleString()} PULSES</p>
          </div>

          <div className="mb-6">
            <p className="text-sm leading-relaxed text-zinc-300">
              <span className="font-black text-white mr-2 uppercase tracking-tighter">{username}</span>
              {caption}
            </p>
          </div>

          {/* Comment Box */}
          <div className="relative mt-2 pt-5 border-t border-zinc-900/40">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-zinc-800 overflow-hidden shrink-0">
                <img src={avatar} alt="Me" className="w-full h-full object-cover opacity-50" />
              </div>
              <input
                type="text"
                maxLength={120}
                placeholder="Join the pulse..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value.substring(0, 120))}
                className="flex-1 bg-transparent text-xs text-zinc-400 focus:text-white outline-none placeholder:text-zinc-800 font-bold uppercase tracking-widest"
              />
              <AnimatePresence>
                {commentText && (
                  <motion.button 
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="text-primary font-black text-[10px] uppercase tracking-[0.2em] px-3 py-1 bg-primary/10 rounded-lg"
                  >
                    Post
                  </motion.button>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {isSharing && (
          <StoryShare 
            postImage={image} 
            originalAspectRatio={aspectRatio === '1:1' ? 1 : 0.8} 
            onClose={() => setIsSharing(false)} 
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default Post;
