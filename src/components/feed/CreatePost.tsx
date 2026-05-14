import React, { useCallback, useState } from 'react';
import Cropper, { Area, Point } from 'react-easy-crop';
import { motion } from 'motion/react';
import {
  X,
  Check,
  Image as ImageIcon,
  RotateCcw,
  ArrowRight,
  MapPin,
  Link as LinkIcon,
  Loader2,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { realtime } from '../../lib/realtime';

const MAX_IMAGE_SIZE_MB = 5;

export default function CreatePost() {
  const navigate = useNavigate();

  const [image, setImage] = useState<string | null>(null);
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [aspect, setAspect] = useState<number>(1);
  const [isStory, setIsStory] = useState(false);
  const [caption, setCaption] = useState('');
  const [step, setStep] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [error, setError] = useState('');
  const [isPosting, setIsPosting] = useState(false);

  const onCropComplete = useCallback((_: Area, croppedPixels: Area) => {
    setCroppedAreaPixels(croppedPixels);
  }, []);

  const resetComposer = () => {
    setImage(null);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setAspect(1);
    setIsStory(false);
    setCaption('');
    setStep(1);
    setCroppedAreaPixels(null);
    setError('');
    setIsPosting(false);
  };

  const handleClose = () => {
    resetComposer();
    navigate('/');
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    setError('');

    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please select an image file.');
      return;
    }

    const fileSizeMb = file.size / 1024 / 1024;

    if (fileSizeMb > MAX_IMAGE_SIZE_MB) {
      setError(`Image must be under ${MAX_IMAGE_SIZE_MB}MB for this demo server.`);
      return;
    }

    const reader = new FileReader();

    reader.onload = (readerEvent) => {
      const result = readerEvent.target?.result;

      if (typeof result !== 'string') {
        setError('Could not read this image.');
        return;
      }

      setImage(result);
      setStep(2);
    };

    reader.onerror = () => {
      setError('Could not load image.');
    };

    reader.readAsDataURL(file);
  };

  const handlePost = () => {
    if (!image && !caption.trim()) {
      setError('Add an image or caption first.');
      return;
    }

    if (isPosting) return;

    setIsPosting(true);
    realtime.connect();

    realtime.send('post:create', {
      author: localStorage.getItem('vpulse_username') || 'pioneer',
      caption: caption.trim(),
      imageUrl: image || '',
      aspectRatio: isStory ? '2:3' : aspect === 1 ? '1:1' : '4:5',
      isStory,
      crop: croppedAreaPixels,
    });

    setTimeout(() => {
      setIsPosting(false);
      navigate('/');
    }, 350);
  };

  return (
    <div className="fixed inset-0 z-[100] flex flex-col bg-black font-sans">
      <div className="flex h-16 items-center justify-between border-b border-zinc-900 bg-black/80 px-6 backdrop-blur-md">
        <button
          type="button"
          onClick={handleClose}
          className="tap-target -ml-2 text-zinc-500 hover:text-white"
        >
          <X size={24} />
        </button>

        <h1 className="neon-text text-lg font-black italic uppercase tracking-tighter text-primary">
          {isStory ? 'NEW STORY' : 'NEW POST'}
        </h1>

        {step === 2 && image ? (
          <button
            type="button"
            onClick={() => setStep(3)}
            className="flex items-center gap-1 text-sm font-black uppercase tracking-widest text-primary transition-all active:scale-95"
          >
            Next <ArrowRight size={18} strokeWidth={3} />
          </button>
        ) : step === 3 ? (
          <button
            type="button"
            onClick={handlePost}
            disabled={isPosting}
            className="flex items-center gap-1 text-sm font-black uppercase tracking-widest text-primary transition-all active:scale-95 disabled:opacity-50"
          >
            {isPosting ? (
              <>
                Sharing <Loader2 size={18} className="animate-spin" />
              </>
            ) : (
              <>
                Share <Check size={18} strokeWidth={3} />
              </>
            )}
          </button>
        ) : (
          <div className="w-10" />
        )}
      </div>

      {error && (
        <div className="mx-6 mt-4 rounded-2xl border border-primary/20 bg-primary/10 px-4 py-3 text-xs font-bold uppercase tracking-widest text-primary">
          {error}
        </div>
      )}

      <div className="no-scrollbar relative flex-1 overflow-y-auto pb-8">
        {step === 1 && (
          <div className="flex h-full flex-col items-center justify-center p-8">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-center"
            >
              <div className="mx-auto mb-6 flex h-24 w-24 animate-pulse items-center justify-center rounded-3xl border-2 border-dashed border-zinc-800 bg-zinc-900 text-primary">
                <ImageIcon size={40} />
              </div>

              <h2 className="mb-2 text-2xl font-black italic">SELECT MEDIA</h2>

              <p className="mx-auto mb-12 max-w-xs text-sm font-medium text-zinc-500">
                Capture your pulse. Support for 1:1, 4:5 and Story formats.
              </p>

              <label className="inline-flex h-14 cursor-pointer items-center rounded-2xl bg-primary px-8 font-black uppercase tracking-widest text-black shadow-[0_0_20px_rgba(255,107,0,0.3)] transition-all active:scale-95">
                Browse Files
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </label>
            </motion.div>
          </div>
        )}

        {step === 2 && image && (
          <div className="flex h-full flex-col bg-black">
            <div
              className={`relative max-h-[60vh] w-full overflow-hidden bg-zinc-950 transition-all duration-500 ${
                isStory ? 'aspect-[2/3]' : aspect === 1 ? 'aspect-square' : 'aspect-[4/5]'
              }`}
            >
              <Cropper
                image={image}
                crop={crop}
                zoom={zoom}
                aspect={isStory ? 2 / 3 : aspect}
                onCropChange={setCrop}
                onCropComplete={onCropComplete}
                onZoomChange={setZoom}
                classes={{ containerClassName: 'bg-zinc-950' }}
              />
            </div>

            <div className="space-y-8 p-8">
              <div className="flex items-center justify-around rounded-2xl border border-zinc-800 bg-zinc-900/50 p-2">
                <button
                  type="button"
                  onClick={() => {
                    setAspect(1);
                    setIsStory(false);
                  }}
                  className={`flex-1 rounded-xl px-4 py-3 text-[10px] font-black uppercase tracking-widest transition-all ${
                    !isStory && aspect === 1 ? 'bg-primary text-black' : 'text-zinc-500'
                  }`}
                >
                  Square 1:1
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setAspect(4 / 5);
                    setIsStory(false);
                  }}
                  className={`flex-1 rounded-xl px-4 py-3 text-[10px] font-black uppercase tracking-widest transition-all ${
                    !isStory && aspect !== 1 ? 'bg-primary text-black' : 'text-zinc-500'
                  }`}
                >
                  Portrait 4:5
                </button>

                <button
                  type="button"
                  onClick={() => setIsStory(true)}
                  className={`flex-1 rounded-xl px-4 py-3 text-[10px] font-black uppercase tracking-widest transition-all ${
                    isStory ? 'bg-primary text-black' : 'text-zinc-500'
                  }`}
                >
                  Story 2:3
                </button>
              </div>

              <div className="flex items-center gap-6">
                <div className="flex-1">
                  <p className="mb-4 text-[10px] font-black uppercase tracking-widest text-zinc-600">
                    Zoom Level
                  </p>

                  <input
                    type="range"
                    value={zoom}
                    min={1}
                    max={3}
                    step={0.1}
                    onChange={(event) => setZoom(Number(event.target.value))}
                    className="h-1 w-full cursor-pointer rounded-lg bg-zinc-900 accent-primary"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setZoom(1);
                    setCrop({ x: 0, y: 0 });
                  }}
                  className="tap-target rounded-xl border border-zinc-800 bg-zinc-900 p-3 text-zinc-400 transition-all active:scale-95"
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
            <div className="mb-10 flex gap-4">
              <div
                className={`relative w-24 overflow-hidden rounded-xl border border-zinc-800 shadow-xl ${
                  isStory ? 'aspect-[2/3]' : aspect === 1 ? 'aspect-square' : 'aspect-[4/5]'
                }`}
              >
                <img src={image} alt="Preview" className="h-full w-full object-cover" />

                {isStory && (
                  <div className="absolute inset-0 ring-1 ring-inset ring-primary/30" />
                )}
              </div>

              <div className="flex flex-1 flex-col justify-center">
                <label className="mb-1.5 pl-1 text-[10px] font-black uppercase tracking-widest text-zinc-600">
                  Caption
                </label>

                <textarea
                  autoFocus
                  maxLength={180}
                  placeholder="Enter your pulse caption..."
                  value={caption}
                  onChange={(event) => setCaption(event.target.value.substring(0, 180))}
                  className="min-h-[100px] w-full resize-none rounded-xl border border-zinc-900 bg-zinc-900/50 p-4 text-sm font-medium outline-none transition-all focus:border-primary/50"
                />

                <div className="mt-2 flex justify-end">
                  <span
                    className={`text-[10px] font-black ${
                      caption.length >= 170 ? 'text-primary' : 'text-zinc-700'
                    }`}
                  >
                    {caption.length} / 180
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <button
                type="button"
                className="m3-card flex w-full items-center justify-between border-zinc-900 bg-zinc-950 p-4"
              >
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-zinc-900 p-2 text-zinc-500">
                    <MapPin size={18} />
                  </div>

                  <span className="text-xs font-bold text-zinc-300">Add Location</span>
                </div>

                <ChevronRight size={16} className="text-zinc-800" />
              </button>

              <button
                type="button"
                className="m3-card flex w-full items-center justify-between border-zinc-900 bg-zinc-950 p-4"
              >
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-zinc-900 p-2 text-zinc-500">
                    <LinkIcon size={18} />
                  </div>

                  <span className="text-xs font-bold text-zinc-300">
                    Add Link {isStory ? '' : '(Stories Only)'}
                  </span>
                </div>

                <div
                  className={`relative h-4 w-8 rounded-full ${
                    isStory ? 'bg-primary/30' : 'bg-zinc-900'
                  }`}
                >
                  <div
                    className={`absolute h-4 w-4 rounded-full transition-all ${
                      isStory ? 'left-4 bg-primary' : 'left-0 bg-zinc-700'
                    }`}
                  />
                </div>
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

const ChevronRight = ({
  size,
  className,
}: {
  size: number;
  className: string;
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="3"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="m9 18 6-6-6-6" />
  </svg>
);
