import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Heart,
  MessageCircle,
  Share2,
  MoreHorizontal,
  Bookmark,
} from 'lucide-react';
import StoryShare from './StoryShare';

import { realtime } from '../../lib/realtime';

interface PostProps {
  id?: string | number;
  username: string;
  avatar: string;
  image: string;
  caption: string;
  likes: number;
  comments: number;
  time: string;
  aspectRatio: '1:1' | '4:5';
}

const Post: React.FC<PostProps> = ({
  id,
  username,
  avatar,
  image,
  caption,
  likes,
  comments,
  time,
  aspectRatio,
}) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [localLikes, setLocalLikes] = useState(likes);
  const [localComments, setLocalComments] = useState(comments);
  const [commentText, setCommentText] = useState('');
  const [showComments, setShowComments] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const postId = String(id || `${username}_${caption.slice(0, 16)}`);

  const handleLike = () => {
    const nextLiked = !isLiked;

    setIsLiked(nextLiked);
    setLocalLikes((current) => (nextLiked ? current + 1 : Math.max(0, current - 1)));

    realtime.send('post:like', {
      postId,
    });
  };

  const handleBookmark = () => {
    const nextBookmarked = !isBookmarked;

    setIsBookmarked(nextBookmarked);

    realtime.send('post:bookmark', {
      postId,
    });
  };

  const handleComment = () => {
    const cleanComment = commentText.trim();

    if (!cleanComment) return;

    setLocalComments((current) => current + 1);
    setCommentText('');
    setShowComments(true);
  };

  const handleNativeShare = async () => {
    setIsSharing(true);

    if (!navigator.share) return;

    try {
      await navigator.share({
        title: `V-PULSE post by ${username}`,
        text: caption,
        url: window.location.href,
      });
    } catch {
      // User cancelled native share.
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        className="m3-card mx-auto mb-10 w-full max-w-lg border-zinc-900 bg-zinc-950 shadow-[0_10px_30px_rgba(0,0,0,0.5)]"
      >
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 overflow-hidden rounded-full border-2 border-primary/30 p-0.5">
              <img
                src={avatar}
                alt={username}
                className="h-full w-full rounded-full object-cover"
              />
            </div>

            <div>
              <h3 className="text-sm font-black uppercase tracking-tighter">
                {username}
              </h3>

              <p className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-600">
                {time}
              </p>
            </div>
          </div>

          <div className="relative">
            <button
              type="button"
              onClick={() => setMenuOpen((current) => !current)}
              className="tap-target text-zinc-700 transition-colors hover:text-white"
            >
              <MoreHorizontal size={20} />
            </button>

            <AnimatePresence>
              {menuOpen && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: -6 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -6 }}
                  className="absolute right-0 top-10 z-20 w-40 rounded-2xl border border-zinc-800 bg-zinc-950 p-2 shadow-2xl"
                >
                  <button
                    type="button"
                    onClick={() => {
                      setMenuOpen(false);
                      handleNativeShare();
                    }}
                    className="w-full rounded-xl px-3 py-2 text-left text-xs font-black uppercase tracking-widest text-zinc-400 hover:bg-zinc-900 hover:text-primary"
                  >
                    Share post
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setMenuOpen(false);
                      handleBookmark();
                    }}
                    className="w-full rounded-xl px-3 py-2 text-left text-xs font-black uppercase tracking-widest text-zinc-400 hover:bg-zinc-900 hover:text-primary"
                  >
                    {isBookmarked ? 'Saved' : 'Save'}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div
          className={`group relative overflow-hidden bg-zinc-950 ${
            aspectRatio === '4:5' ? 'aspect-[4/5]' : 'aspect-square'
          }`}
        >
          <img
            src={image}
            alt="Post content"
            className="h-full w-full object-cover transition-transform duration-[2s] group-hover:scale-105"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />

          <AnimatePresence>
            {isLiked && (
              <motion.div
                initial={{ opacity: 0, scale: 0.4 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.4 }}
                className="pointer-events-none absolute inset-0 flex items-center justify-center"
              >
                <Heart
                  size={96}
                  className="text-primary drop-shadow-[0_0_25px_var(--color-primary)]"
                  fill="currentColor"
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="p-5">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-6">
              <motion.button
                type="button"
                whileTap={{ scale: 0.8 }}
                onClick={handleLike}
                className={`tap-target transition-all duration-300 ${
                  isLiked ? 'text-primary' : 'text-zinc-200'
                }`}
              >
                <Heart
                  size={28}
                  fill={isLiked ? 'currentColor' : 'none'}
                  strokeWidth={2.5}
                />
              </motion.button>

              <button
                type="button"
                onClick={() => setShowComments((current) => !current)}
                className="tap-target text-zinc-200 transition-colors hover:text-primary"
              >
                <MessageCircle size={28} strokeWidth={2.5} />
              </button>

              <button
                type="button"
                onClick={handleNativeShare}
                className="tap-target text-zinc-200 transition-colors hover:text-primary"
              >
                <Share2 size={28} strokeWidth={2.5} />
              </button>
            </div>

            <button
              type="button"
              onClick={handleBookmark}
              className={`tap-target transition-colors ${
                isBookmarked ? 'text-primary' : 'text-zinc-200 hover:text-primary'
              }`}
            >
              <Bookmark
                size={28}
                strokeWidth={2.5}
                fill={isBookmarked ? 'currentColor' : 'none'}
              />
            </button>
          </div>

          <div className="mb-2">
            <p className="text-sm font-black tracking-tight">
              {localLikes.toLocaleString()} PULSES
            </p>
          </div>

          <div className="mb-3">
            <p className="text-sm leading-relaxed text-zinc-300">
              <span className="mr-2 font-black uppercase tracking-tighter text-white">
                {username}
              </span>
              {caption}
            </p>
          </div>

          {localComments > 0 && (
            <button
              type="button"
              onClick={() => setShowComments((current) => !current)}
              className="mb-5 text-xs font-bold text-zinc-600 transition-colors hover:text-primary"
            >
              View {localComments.toLocaleString()} comments
            </button>
          )}

          <AnimatePresence>
            {showComments && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-5 overflow-hidden rounded-2xl border border-zinc-900 bg-black/40 p-4"
              >
                <p className="text-xs font-bold uppercase tracking-widest text-zinc-600">
                  Comments are wired locally for now.
                </p>

                <p className="mt-2 text-xs text-zinc-400">
                  Backend comment storage can be added after the main post and DM
                  controls are stable.
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="relative mt-2 border-t border-zinc-900/40 pt-5">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 shrink-0 overflow-hidden rounded-lg bg-zinc-800">
                <img
                  src={avatar}
                  alt="Me"
                  className="h-full w-full object-cover opacity-50"
                />
              </div>

              <input
                type="text"
                maxLength={120}
                placeholder="Join the pulse..."
                value={commentText}
                onChange={(event) =>
                  setCommentText(event.target.value.substring(0, 120))
                }
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    handleComment();
                  }
                }}
                className="flex-1 bg-transparent text-xs font-bold uppercase tracking-widest text-zinc-400 outline-none placeholder:text-zinc-800 focus:text-white"
              />

              <AnimatePresence>
                {commentText.trim() && (
                  <motion.button
                    type="button"
                    onClick={handleComment}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="rounded-lg bg-primary/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-primary"
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
