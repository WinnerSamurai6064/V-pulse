import React from 'react';
import { motion } from 'motion/react';
import { Share2, X } from 'lucide-react';

interface StoryShareProps {
  postImage: string;
  originalAspectRatio: number; // 1 or 0.8 (4/5)
  onClose: () => void;
}

export default function StoryShare({ postImage, originalAspectRatio, onClose }: StoryShareProps) {
  // Logic: Stories are 2/3 (0.666). 
  // If original is 1 (Square), we need to fill the top/bottom.
  // The border will be a blurred and darkened version of the image or solid color.
  
  return (
    <div className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-2xl flex flex-col items-center justify-center p-6">
      <button 
        onClick={onClose}
        className="absolute top-6 right-6 tap-target bg-zinc-900/50 rounded-full p-2 border border-white/10"
      >
        <X size={24} />
      </button>

      <div className="w-full max-w-[400px] flex flex-col items-center">
        <h2 className="text-primary font-black italic tracking-tighter text-2xl mb-8 neon-text">SHARE TO STORY</h2>
        
        {/* Story Canvas (2:3) */}
        <div className="relative w-full aspect-[2/3] bg-zinc-900 rounded-3xl overflow-hidden shadow-2xl border border-zinc-800">
          {/* Background Layer (Blurred) */}
          <div className="absolute inset-0 scale-150 blur-3xl opacity-40">
            <img src={postImage} alt="" className="w-full h-full object-cover" />
          </div>
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/60" />

          {/* Content Layer (Retaining Aspect Ratio) */}
          <div className="absolute inset-0 flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', damping: 20 }}
              className={`relative shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden rounded-2xl ring-1 ring-white/20 w-full ${
                originalAspectRatio === 1 ? 'aspect-square' : 'aspect-[4/5]'
              }`}
            >
              <img src={postImage} alt="Shared post" className="w-full h-full object-cover" />
              
              {/* Optional: Overlay current user info like Instagram */}
              <div className="absolute top-3 left-3 flex items-center gap-2 bg-black/40 backdrop-blur-md px-2 py-1 rounded-lg">
                <div className="w-5 h-5 rounded-full bg-primary" />
                <span className="text-[8px] font-black tracking-widest text-white uppercase">V-PULSE</span>
              </div>
            </motion.div>
          </div>
          
          {/* Story UI Elements */}
          <div className="absolute top-6 left-6 right-6 flex items-center gap-2">
            <div className="flex-1 h-1 bg-white/20 rounded-full overflow-hidden">
              <div className="h-full bg-white/80 w-1/4" />
            </div>
            <div className="flex-1 h-1 bg-white/20 rounded-full" />
            <div className="flex-1 h-1 bg-white/20 rounded-full" />
          </div>
        </div>

        <button 
          onClick={onClose}
          className="w-full mt-12 bg-primary text-black font-black uppercase tracking-widest h-16 rounded-2xl shadow-[0_0_30px_rgba(255,107,0,0.3)] active:scale-95 transition-all flex items-center justify-center gap-3"
        >
          <Share2 size={20} strokeWidth={3} />
          Broadcast to Story
        </button>
      </div>
    </div>
  );
}
