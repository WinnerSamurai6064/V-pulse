import React, { useState, useCallback } from 'react';
import Cropper, { Point, Area } from 'react-easy-crop';
import { motion, AnimatePresence } from 'motion/react';
import { X, Check, Image as ImageIcon, RotateCcw, Maximize, Crop, ArrowRight, MapPin, Link as LinkIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function CreatePost() {
  const navigate = useNavigate();
  const [image, setImage] = useState<string | null>(null);
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [aspect, setAspect] = useState<number>(1); // 1:1 or 4:5
  const [isStory, setIsStory] = useState(false);
  const [caption, setCaption] = useState('');
  const [step, setStep] = useState(1); // 1: Select, 2: Crop, 3: Finalize

  const onCropComplete = useCallback((_: Area, __: Area) => {
    // In a real app, generate the cropped image here
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setImage(ev.target?.result as string);
        setStep(2);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handlePost = () => {
    // Logic to post the image
    navigate('/');
  };

  return (
    <div className="fixed inset-0 bg-black z-[100] flex flex-col font-sans">
      {/* Header */}
      <div className="px-6 h-16 flex items-center justify-between border-b border-zinc-900 bg-black/80 backdrop-blur-md">
        <button onClick={() => navigate('/')} className="tap-target -ml-2 text-zinc-500 hover:text-white">
          <X size={24} />
        </button>
        <h1 className="text-lg font-black italic tracking-tighter text-primary neon-text uppercase">
          {isStory ? 'NEW STORY' : 'NEW POST'}
        </h1>
        {step === 2 && image ? (
          <button 
            onClick={() => setStep(3)}
            className="text-primary font-black flex items-center gap-1 active:scale-95 transition-all text-sm uppercase tracking-widest"
          >
            Next <ArrowRight size={18} strokeWidth={3} />
          </button>
        ) : step === 3 ? (
          <button 
            onClick={handlePost}
            className="text-primary font-black flex items-center gap-1 active:scale-95 transition-all text-sm uppercase tracking-widest"
          >
            Share <Check size={18} strokeWidth={3} />
          </button>
        ) : <div className="w-10" />}
      </div>

      <div className="flex-1 relative overflow-y-auto no-scrollbar pb-8">
        {step === 1 && (
          <div className="h-full flex flex-col items-center justify-center p-8">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-center"
            >
              <div className="w-24 h-24 bg-zinc-900 border-2 border-dashed border-zinc-800 rounded-3xl flex items-center justify-center mb-6 mx-auto text-primary animate-pulse">
                <ImageIcon size={40} />
              </div>
              <h2 className="text-2xl font-black mb-2 italic">SELECT MEDIA</h2>
              <p className="text-zinc-500 text-sm mb-12 max-w-xs mx-auto font-medium">Capture your pulse. Support for 1:1, 4:5 and Story formats.</p>
              
              <label className="bg-primary text-black font-black uppercase tracking-widest h-14 px-8 rounded-2xl cursor-pointer active:scale-95 transition-all inline-flex items-center shadow-[0_0_20px_rgba(255,107,0,0.3)]">
                Browse Files
                <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
              </label>
            </motion.div>
          </div>
        )}

        {step === 2 && image && (
          <div className="flex flex-col h-full bg-black">
            <div className={`relative w-full overflow-hidden transition-all duration-500 ${isStory ? 'aspect-[2/3]' : aspect === 1 ? 'aspect-square' : 'aspect-[4/5]'} max-h-[60vh] bg-zinc-950`}>
              <Cropper
                image={image}
                crop={crop}
                zoom={zoom}
                aspect={isStory ? 2/3 : aspect}
                onCropChange={setCrop}
                onCropComplete={onCropComplete}
                onZoomChange={setZoom}
                classes={{ containerClassName: 'bg-zinc-950' }}
              />
            </div>

            <div className="p-8 space-y-8">
              <div className="flex justify-around items-center bg-zinc-900/50 p-2 rounded-2xl border border-zinc-800">
                <button 
                  onClick={() => { setAspect(1); setIsStory(false); }}
                  className={`flex-1 py-3 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${!isStory && aspect === 1 ? 'bg-primary text-black' : 'text-zinc-500'}`}
                >
                  SQUARE 1:1
                </button>
                <button 
                  onClick={() => { setAspect(4/5); setIsStory(false); }}
                  className={`flex-1 py-3 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${!isStory && aspect !== 1 ? 'bg-primary text-black' : 'text-zinc-500'}`}
                >
                  PORTRAIT 4:5
                </button>
                <button 
                  onClick={() => setIsStory(true)}
                  className={`flex-1 py-3 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${isStory ? 'bg-primary text-black' : 'text-zinc-500'}`}
                >
                  STORY 2:3
                </button>
              </div>

              <div className="flex items-center gap-6">
                <div className="flex-1">
                  <p className="text-[10px] font-black uppercase tracking-widest text-zinc-600 mb-4">Zoom Level</p>
                  <input
                    type="range"
                    value={zoom}
                    min={1}
                    max={3}
                    step={0.1}
                    onChange={(e) => setZoom(Number(e.target.value))}
                    className="w-full h-1 bg-zinc-900 accent-primary rounded-lg cursor-pointer"
                  />
                </div>
                <button 
                  onClick={() => { setZoom(1); setCrop({ x:0, y:0 }); }}
                  className="tap-target bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-zinc-400 active:scale-95 transition-all"
                >
                  <RotateCcw size={20} />
                </button>
              </div>
            </div>
          </div>
        )}

        {step === 3 && image && (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="p-6 pb-24"
          >
            <div className="flex gap-4 mb-10">
              <div className={`relative w-24 overflow-hidden rounded-xl border border-zinc-800 shadow-xl ${isStory ? 'aspect-[2/3]' : 'aspect-square'}`}>
                <img src={image} alt="Preview" className="w-full h-full object-cover" />
                {isStory && <div className="absolute inset-0 ring-1 ring-primary/30 ring-inset" />}
              </div>
              <div className="flex-1 flex flex-col justify-center">
                <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-1.5 pl-1">Caption</label>
                <textarea
                  autoFocus
                  maxLength={180}
                  placeholder="Enter your pulse caption..."
                  value={caption}
                  onChange={(e) => setCaption(e.target.value.substring(0, 180))}
                  className="w-full bg-zinc-900/50 border border-zinc-900 rounded-xl p-4 text-sm outline-none focus:border-primary/50 transition-all font-medium resize-none min-h-[100px]"
                />
                <div className="flex justify-end mt-2">
                  <span className={`text-[10px] font-black ${caption.length >= 170 ? 'text-primary' : 'text-zinc-700'}`}>
                    {caption.length} / 180
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="m3-card bg-zinc-950 p-4 border-zinc-900 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-zinc-900 rounded-lg text-zinc-500">
                    <MapPin size={18} />
                  </div>
                  <span className="text-xs font-bold text-zinc-300">Add Location</span>
                </div>
                <ChevronRight size={16} className="text-zinc-800" />
              </div>
              <div className="m3-card bg-zinc-950 p-4 border-zinc-900 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-zinc-900 rounded-lg text-zinc-500">
                    <LinkIcon size={18} />
                  </div>
                  <span className="text-xs font-bold text-zinc-300">Add Link (Stories Only)</span>
                </div>
                <div className="w-8 h-4 bg-zinc-900 rounded-full relative">
                   <div className="absolute left-0 w-4 h-4 bg-zinc-700 rounded-full" />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

const ChevronRight = ({ size, className }: { size: number, className: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="m9 18 6-6-6-6"/>
  </svg>
);
