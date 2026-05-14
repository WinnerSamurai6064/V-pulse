import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'motion/react';
import {
  Search,
  Edit3,
  ChevronLeft,
  MoreVertical,
  Send,
  Smile,
  Camera,
} from 'lucide-react';
import { Routes, Route, useNavigate, useParams } from 'react-router-dom';

import { realtime } from '../../lib/realtime';

type Chat = {
  id: string;
  username: string;
  lastMsg: string;
  time: string;
  avatar: string;
  unread: number;
  active?: boolean;
};

type Message = {
  id: string | number;
  text: string;
  sent: boolean;
  time: string;
  from?: string;
  to?: string;
};

const seedChats: Chat[] = [
  {
    id: 'alex_pulse',
    username: 'alex_pulse',
    lastMsg: 'See you at the grid! 🤘',
    time: '12:45',
    avatar:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200',
    unread: 2,
    active: true,
  },
  {
    id: 'cyber_vibe',
    username: 'cyber_vibe',
    lastMsg: 'That new filter is fire',
    time: '10:12',
    avatar:
      'https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=200',
    unread: 0,
    active: true,
  },
  {
    id: 'neon.knight',
    username: 'neon.knight',
    lastMsg: 'Tokyo rainy nights...',
    time: 'Yesterday',
    avatar:
      'https://images.unsplash.com/photo-1527980965255-d3b416303d12?auto=format&fit=crop&q=80&w=200',
    unread: 0,
    active: false,
  },
  {
    id: 'system_pulse',
    username: 'system_pulse',
    lastMsg: 'Welcome to the future of social.',
    time: 'Monday',
    avatar:
      'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200',
    unread: 0,
    active: false,
  },
];

const seedMessages: Record<string, Message[]> = {
  alex_pulse: [
    {
      id: 1,
      text: 'Hey! Are you coming to the neon party tonight? 🌌',
      sent: false,
      time: '12:40',
      from: 'alex_pulse',
    },
    {
      id: 2,
      text: 'Absolutely! Just finishing some code for the V-PULSE update.',
      sent: true,
      time: '12:42',
      to: 'alex_pulse',
    },
    {
      id: 3,
      text: 'Sick. Bring that high-pulse energy!',
      sent: false,
      time: '12:43',
      from: 'alex_pulse',
    },
    {
      id: 4,
      text: 'You know it. Ready to drop the bass and the bytes. See you at the grid! 🤘',
      sent: true,
      time: '12:45',
      to: 'alex_pulse',
    },
  ],
  cyber_vibe: [
    {
      id: 5,
      text: 'That new filter is fire',
      sent: false,
      time: '10:12',
      from: 'cyber_vibe',
    },
  ],
  'neon.knight': [
    {
      id: 6,
      text: 'Tokyo rainy nights...',
      sent: false,
      time: 'Yesterday',
      from: 'neon.knight',
    },
  ],
  system_pulse: [
    {
      id: 7,
      text: 'Welcome to the future of social.',
      sent: false,
      time: 'Monday',
      from: 'system_pulse',
    },
  ],
};

function getTimeLabel(value?: string) {
  if (!value) return 'Now';

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return 'Now';
  }

  return date.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });
}

function getChatById(chatId?: string) {
  return seedChats.find((chat) => chat.id === chatId) || seedChats[0];
}

const ChatList = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [chats, setChats] = useState<Chat[]>(seedChats);

  useEffect(() => {
    realtime.connect();
    realtime.send('state:get');

    const offMessage = realtime.on('message:new', (data) => {
      const incoming = data.message;

      if (!incoming?.text) return;

      const chatKey =
        incoming.fromUsername && incoming.fromUsername !== 'pioneer'
          ? incoming.fromUsername
          : incoming.to;

      setChats((current) =>
        current.map((chat) => {
          if (chat.id !== chatKey) return chat;

          return {
            ...chat,
            lastMsg: incoming.text,
            time: getTimeLabel(incoming.createdAt),
            unread: chat.unread + 1,
          };
        })
      );
    });

    const offPresence = realtime.on('presence:update', (data) => {
      const onlineNames = new Set(
        Array.isArray(data.users)
          ? data.users.map((user: any) => user.username)
          : []
      );

      setChats((current) =>
        current.map((chat) => ({
          ...chat,
          active: onlineNames.has(chat.username) || chat.active,
        }))
      );
    });

    return () => {
      offMessage();
      offPresence();
    };
  }, []);

  const filteredChats = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return chats;

    return chats.filter(
      (chat) =>
        chat.username.toLowerCase().includes(query) ||
        chat.lastMsg.toLowerCase().includes(query)
    );
  }, [search, chats]);

  return (
    <div className="min-h-screen bg-black pb-24 pt-4">
      <div className="mb-6 flex items-center justify-between px-6">
        <h1 className="neon-text flex items-center gap-2 text-2xl font-black italic tracking-tighter text-primary">
          MESSAGES
        </h1>

        <button className="tap-target rounded-xl border border-zinc-800 bg-zinc-900 p-2 transition-all active:scale-95">
          <Edit3 size={20} />
        </button>
      </div>

      <div className="mb-8 px-6">
        <div className="relative">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500"
            size={18}
          />

          <input
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search PULSE connections..."
            className="h-12 w-full rounded-2xl border border-zinc-800 bg-zinc-900/50 pl-12 pr-4 text-sm font-medium outline-none transition-all placeholder:text-zinc-600 focus:border-primary/50"
          />
        </div>
      </div>

      <div className="space-y-1">
        {filteredChats.map((chat) => (
          <motion.div
            key={chat.id}
            whileHover={{ backgroundColor: 'rgba(24, 24, 27, 0.4)' }}
            onClick={() => navigate(`/dm/${chat.id}`)}
            className="flex cursor-pointer items-center gap-4 border-l-4 border-transparent px-6 py-4 transition-all active:scale-[0.98] hover:border-primary"
          >
            <div className="relative">
              <div className="h-14 w-14 overflow-hidden rounded-2xl border border-zinc-800 shadow-[0_0_15px_rgba(0,0,0,0.5)]">
                <img
                  src={chat.avatar}
                  alt={chat.username}
                  className="h-full w-full object-cover"
                />
              </div>

              {chat.active && (
                <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-black bg-primary shadow-[0_0_8px_#FF6B00]" />
              )}

              {chat.unread > 0 && (
                <div className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-lg border-2 border-black bg-primary text-[10px] font-black text-black">
                  {chat.unread}
                </div>
              )}
            </div>

            <div className="min-w-0 flex-1">
              <div className="mb-1 flex items-baseline justify-between">
                <h3 className="truncate text-sm font-bold tracking-tight">
                  {chat.username}
                </h3>

                <span className="text-[10px] font-bold uppercase text-zinc-500">
                  {chat.time}
                </span>
              </div>

              <p
                className={`truncate text-xs ${
                  chat.unread > 0
                    ? 'font-bold text-white'
                    : 'font-medium text-zinc-500'
                }`}
              >
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
  const chat = getChatById(chatId);

  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>(
    seedMessages[chat.id] || []
  );
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    setMessages(seedMessages[chat.id] || []);
  }, [chat.id]);

  useEffect(() => {
    realtime.connect();

    const offMessage = realtime.on('message:new', (data) => {
      const incoming = data.message;

      if (!incoming?.text) return;

      const belongsToCurrentChat =
        incoming.fromUsername === chat.username || incoming.to === chat.username;

      if (!belongsToCurrentChat) return;

      setMessages((current) => [
        ...current,
        {
          id: incoming.id,
          text: incoming.text,
          sent: incoming.fromUsername !== chat.username,
          time: getTimeLabel(incoming.createdAt),
          from: incoming.fromUsername,
          to: incoming.to,
        },
      ]);
    });

    const offTypingStart = realtime.on('typing:start', (data) => {
      if (data.fromUsername === chat.username) {
        setIsTyping(true);
      }
    });

    const offTypingStop = realtime.on('typing:stop', (data) => {
      if (data.fromUsername === chat.username) {
        setIsTyping(false);
      }
    });

    return () => {
      offMessage();
      offTypingStart();
      offTypingStop();
    };
  }, [chat.username]);

  const handleSend = (event: React.FormEvent) => {
    event.preventDefault();

    const cleanMessage = message.trim();

    if (!cleanMessage) return;

    const optimisticMessage: Message = {
      id: `local_${Date.now()}`,
      text: cleanMessage,
      sent: true,
      time: 'Now',
      to: chat.username,
    };

    setMessages((current) => [...current, optimisticMessage]);

    realtime.send('message:send', {
      to: chat.username,
      text: cleanMessage,
    });

    realtime.send('typing:stop', {
      to: chat.username,
    });

    setMessage('');
  };

  const handleChangeMessage = (value: string) => {
    const nextValue = value.substring(0, 500);

    setMessage(nextValue);

    if (nextValue.trim()) {
      realtime.send('typing:start', {
        to: chat.username,
      });
    } else {
      realtime.send('typing:stop', {
        to: chat.username,
      });
    }
  };

  return (
    <div className="flex h-screen flex-col bg-black">
      <div className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-zinc-900 bg-black/80 px-6 backdrop-blur-md">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/dm')}
            className="tap-target -ml-2 text-primary transition-colors hover:text-white"
          >
            <ChevronLeft size={28} strokeWidth={3} />
          </button>

          <div className="flex items-center gap-3">
            <div className="h-10 w-10 overflow-hidden rounded-xl border border-zinc-800 shadow-lg">
              <img
                src={chat.avatar}
                alt={chat.username}
                className="h-full w-full object-cover"
              />
            </div>

            <div>
              <h3 className="text-sm font-bold tracking-tight">{chat.username}</h3>

              <div className="flex items-center gap-1.5">
                <div className="h-1.5 w-1.5 rounded-full bg-primary shadow-[0_0_5px_#FF6B00]" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-primary">
                  {isTyping ? 'Typing...' : chat.active ? 'Active now' : 'Pulse ready'}
                </span>
              </div>
            </div>
          </div>
        </div>

        <button className="tap-target text-zinc-500 transition-colors hover:text-white">
          <MoreVertical size={20} />
        </button>
      </div>

      <div className="no-scrollbar flex flex-1 flex-col space-y-6 overflow-y-auto p-6">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex w-full ${msg.sent ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`relative max-w-[80%] rounded-2xl px-4 py-3 text-sm font-medium leading-relaxed ${
                msg.sent
                  ? 'rounded-tr-none bg-primary text-black shadow-[0_4px_15px_rgba(255,107,0,0.2)]'
                  : 'rounded-tl-none border border-zinc-800 bg-zinc-900 text-white'
              }`}
            >
              {msg.text}

              <span
                className={`absolute -bottom-5 text-[9px] font-black uppercase tracking-tighter ${
                  msg.sent ? 'right-0 text-zinc-600' : 'left-0 text-zinc-600'
                }`}
              >
                {msg.time}
              </span>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex w-full justify-start">
            <div className="rounded-2xl rounded-tl-none border border-zinc-800 bg-zinc-900 px-4 py-3 text-xs font-bold uppercase tracking-widest text-zinc-500">
              Typing...
            </div>
          </div>
        )}
      </div>

      <div className="border-t border-zinc-900 bg-black p-4 pb-8">
        <form
          onSubmit={handleSend}
          className="mx-auto flex max-w-lg items-center rounded-2xl border border-zinc-800 bg-zinc-900/50 p-1 transition-all focus-within:border-primary/50"
        >
          <button
            type="button"
            className="tap-target text-zinc-500 transition-colors hover:text-primary"
          >
            <Camera size={20} />
          </button>

          <input
            type="text"
            value={message}
            onChange={(event) => handleChangeMessage(event.target.value)}
            placeholder="Pulse a message..."
            className="flex-1 bg-transparent px-3 py-2 text-sm font-medium outline-none placeholder:text-zinc-700"
          />

          <div className="flex gap-1 pr-1">
            <button
              type="button"
              className="tap-target text-zinc-500 transition-colors hover:text-primary"
            >
              <Smile size={20} />
            </button>

            <motion.button
              type="submit"
              whileTap={{ scale: 0.9 }}
              disabled={!message.trim()}
              className={`tap-target rounded-xl p-2 transition-all ${
                message.trim()
                  ? 'bg-primary text-black shadow-lg shadow-primary/20'
                  : 'bg-transparent text-zinc-700'
              }`}
            >
              <Send size={20} fill={message.trim() ? 'currentColor' : 'none'} />
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
