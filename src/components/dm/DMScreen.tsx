import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Edit3, ChevronLeft, MoreVertical, Send, Smile, Camera, Image as ImageIcon } from 'lucide-react';
import { Routes, Route, useNavigate, useParams } from 'react-router-dom';

const ChatList = () => {
  const navigate = useNavigate();
  const chats = [
    { id: '1', username: 'alex_pulse', lastMsg: 'See you at the grid! 🤘', time: '12:45', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200', unread: 2 },
    { id: '2', username: 'cyber_vibe', lastMsg: 'That new filter is fire', time: '10:12', avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=200', unread: 0 },
    { id: '3', username: 'neon.knight', lastMsg: ' Tokyo rainy nights...', time: 'Yesterday', avatar: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?auto=format&fit=crop&q=80&w=200', unread: 0 },
    { id: '4', username: 'system_pulse', lastMsg: 'Welcome to the future of social.', time: 'Monday', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200', unread: 0 },
  ];

  return (
    <div className="pb-24 pt-4 bg-black min-h-screen">
      <div className="px-6 flex justify-between items-center mb-6">
        <h1 className="text-2xl font-black italic tracking-tighter text-primary neon-text flex items-center gap-2">
          MESSAGES
        </h1>
        <button className="tap-target bg-zinc-900 border border-zinc-800 rounded-xl p-2 active:scale-95 transition-all">
          <Edit3 size={20} />
        </button>
      </div>

      <div className="px-6 mb-8">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
          <input
            type="text"
            placeholder="Search PULSE connections..."
            className="w-full h-12 bg-zinc-900/50 border border-zinc-800 rounded-2xl pl-12 pr-4 focus:border-primary/50 outline-none transition-all placeholder:text-zinc-600 font-medium text-sm"
          />
        </div>
      </div>

      <div className="space-y-1">
        {chats.map((chat) => (
          <motion.div
            key={chat.id}
            whileHover={{ backgroundColor: 'rgba(24, 24, 27, 0.4)' }}
            onClick={() => navigate(`/dm/${chat.id}`)}
            className="px-6 py-4 flex items-center gap-4 cursor-pointer active:scale-[0.98] transition-all border-l-4 border-transparent hover:border-primary"
          >
            <div className="relative">
              <div className="w-14 h-14 rounded-2xl overflow-hidden border border-zinc-800 shadow-[0_0_15px_rgba(0,0,0,0.5)]">
                <img src={chat.avatar} alt={chat.username} className="w-full h-full object-cover" />
              </div>
              {chat.unread > 0 && (
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-black font-black text-[10px] rounded-lg flex items-center justify-center border-2 border-black">
                  {chat.unread}
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-baseline mb-1">
                <h3 className="font-bold text-sm tracking-tight truncate">{chat.username}</h3>
                <span className="text-[10px] font-bold text-zinc-500 uppercase">{chat.time}</span>
              </div>
              <p className={`text-xs truncate ${chat.unread > 0 ? 'text-white font-bold' : 'text-zinc-500 font-medium'}`}>
                {chat.lastMsg}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

const ChatWindow = () => {
  const navigate = useNavigate();
  const { chatId } = useParams();
  const [message, setMessage] = useState('');
  
  const messages = [
    { id: 1, text: 'Hey! Are you coming to the neon party tonight? 🌌', sent: false, time: '12:40' },
    { id: 2, text: 'Absolutely! Just finishing some code for the V-PULSE update.', sent: true, time: '12:42' },
    { id: 3, text: 'Sick. Bring that high-pulse energy!', sent: false, time: '12:43' },
    { id: 4, text: 'You know it. Ready to drop the bass and the bytes. See you at the grid! 🤘', sent: true, time: '12:45' },
  ];

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    setMessage('');
  };

  return (
    <div className="flex flex-col h-screen bg-black">
      {/* Header */}
      <div className="px-6 h-16 flex items-center justify-between border-b border-zinc-900 bg-black/80 backdrop-blur-md sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/dm')} className="tap-target -ml-2 text-primary hover:text-white transition-colors">
            <ChevronLeft size={28} strokeWidth={3} />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl overflow-hidden border border-zinc-800 shadow-lg">
              <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200" alt="Avatar" className="w-full h-full object-cover" />
            </div>
            <div>
              <h3 className="font-bold text-sm tracking-tight">alex_pulse</h3>
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 bg-primary rounded-full shadow-[0_0_5px_#FF6B00]" />
                <span className="text-[10px] text-primary font-bold uppercase tracking-widest">Active now</span>
              </div>
            </div>
          </div>
        </div>
        <button className="tap-target text-zinc-500 hover:text-white transition-colors">
          <MoreVertical size={20} />
        </button>
      </div>

      {/* Messages View */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 flex flex-col no-scrollbar">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.sent ? 'justify-end' : 'justify-start'} w-full`}>
            <div className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm font-medium leading-relaxed relative ${
              msg.sent 
              ? 'bg-primary text-black rounded-tr-none shadow-[0_4px_15px_rgba(255,107,0,0.2)]' 
              : 'bg-zinc-900 text-white rounded-tl-none border border-zinc-800'
            }`}>
              {msg.text}
              <span className={`text-[9px] font-black absolute -bottom-5 ${msg.sent ? 'right-0 text-zinc-600' : 'left-0 text-zinc-600'} uppercase tracking-tighter`}>
                {msg.time}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Input */}
      <div className="p-4 bg-black border-t border-zinc-900 pb-8">
        <form onSubmit={handleSend} className="max-w-lg mx-auto bg-zinc-900/50 rounded-2xl p-1 flex items-center border border-zinc-800 focus-within:border-primary/50 transition-all">
          <button type="button" className="tap-target text-zinc-500 hover:text-primary transition-colors">
            <Camera size={20} />
          </button>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value.substring(0, 500))}
            placeholder="Pulse a message..."
            className="flex-1 bg-transparent px-3 py-2 outline-none text-sm font-medium placeholder:text-zinc-700"
          />
          <div className="flex gap-1 pr-1">
            <button type="button" className="tap-target text-zinc-500 hover:text-primary transition-colors">
              <Smile size={20} />
            </button>
            <motion.button 
              whileTap={{ scale: 0.9 }}
              disabled={!message.trim()}
              className={`tap-target rounded-xl p-2 transition-all ${
                message.trim() ? 'bg-primary text-black shadow-lg shadow-primary/20' : 'bg-transparent text-zinc-700'
              }`}
            >
              <Send size={20} fill={message.trim() ? "currentColor" : "none"} />
            </motion.button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default function DMScreen() {
  return (
    <Routes>
      <Route path="/" element={<ChatList />} />
      <Route path="/:chatId" element={<ChatWindow />} />
    </Routes>
  );
}
