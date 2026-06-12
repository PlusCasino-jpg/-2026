import React, { useState, useEffect, useRef } from 'react';
import { Comment } from '../types';
import { MessageSquare, Send, Heart, Flame } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface CommentsSectionProps {
  comments: Comment[];
  onAddComment: (text: string) => void;
  onLikeComment: (commentId: string) => void;
}

// Simulated active sports chat messages to make the streaming experience feel real and engaging!
const MOCK_ARABIC_LIVE_BUBBLERS = [
  'جوووووووووووووووووول! مش طبيعي المباراة!!! 😍🔥⚽',
  'أداء خورافي الصراحة من الفريقين اليوم!',
  'الدفاع مستمر بطريقة عجيبة، اللعب رائع! 💥',
  'اللاعبين يقدمون أقصى ما لديهم في المونديال الأقوى.. 🤩',
  'يا رب تستمر المباراة على هذا الأداء والروح الرائعة!',
  'تصدي أسطوري واستثنائي من الحارس بالدقائق الأخيرة!! 🏆',
  'تشجيع حماسي ممتاز يهز المدرجات بالكامل! 🗣️👏',
  'متابعة مستمرة بدون أي تقطيع.. شكراً على البث الممتاز! ❤️📺'
];

const MOCK_USERNAMES = [
  'sports_fan99', 'youssef_dz', 'leomessi_king', 'madridista_pure',
  'abdel_egypt', 'mousa_fast', 'dalia_sports', 'nasser_tactical', 'ksa_champion'
];

export default function CommentsSection({ comments, onAddComment, onLikeComment }: CommentsSectionProps) {
  const [activeTab, setActiveTab] = useState<'chat' | 'comments'>('chat');
  const [inputText, setInputText] = useState('');
  const [simulatedLiveChat, setSimulatedLiveChat] = useState<Comment[]>([]);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  // Initialize and populate initial messages from the main state
  useEffect(() => {
    const initialSeed = comments.map(c => ({
      ...c,
      id: `seed-${c.id}-${Math.random()}`
    }));
    setSimulatedLiveChat(initialSeed);
  }, []);

  // Append new simulated live chats periodically to keep the chat vibrant and interactive
  useEffect(() => {
    const interval = setInterval(() => {
      const randomMsg = MOCK_ARABIC_LIVE_BUBBLERS[Math.floor(Math.random() * MOCK_ARABIC_LIVE_BUBBLERS.length)];
      const randomUser = MOCK_USERNAMES[Math.floor(Math.random() * MOCK_USERNAMES.length)];
      
      const newChat: Comment = {
        id: `sim-${Date.now()}`,
        matchId: 1,
        username: randomUser,
        avatar: `https://images.unsplash.com/photo-${1500000000000 + Math.floor(Math.random() * 900000)}?w=100&auto=format&fit=crop&q=80`,
        text: randomMsg,
        timestamp: 'الآن',
        likes: Math.floor(Math.random() * 8),
        isLiked: false
      };

      setSimulatedLiveChat((prev) => [...prev, newChat].slice(-40)); // keep last 40 comments
    }, 4500); // every 4.5 seconds

    return () => clearInterval(interval);
  }, []);

  // Autoscroll chat to the bottom as discussions flow
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [simulatedLiveChat, comments, activeTab]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    onAddComment(inputText);
    
    // Also append the user chat directly into the live display
    const userChat: Comment = {
      id: `user-chat-${Date.now()}`,
      matchId: 1,
      username: 'عاشق_المونديال',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
      text: inputText,
      timestamp: 'الآن',
      likes: 0,
      isLiked: false
    };

    setSimulatedLiveChat((prev) => [...prev, userChat]);
    setInputText('');
  };

  const handleQuickEmoji = (emoji: string) => {
    setInputText((prev) => prev + emoji);
  };

  return (
    <div className="w-full bg-[#000000] border-y border-neutral-900 md:border md:rounded-2xl md:shadow-xl mt-0 md:mt-4 max-w-full overflow-hidden last:mb-20">
      {/* Chat header/Tab selector */}
      <div className="flex border-b border-neutral-900 select-none">
        <button
          id="chat-tab-btn"
          onClick={() => setActiveTab('chat')}
          className={`flex-1 py-3 text-xs font-bold transition-all relative ${
            activeTab === 'chat' ? 'text-rose-500' : 'text-neutral-400 hover:text-neutral-200'
          }`}
        >
          الدردشة الحية والتعليقات المباشرة 💬
          <span className="absolute top-2.5 right-4 w-2 h-2 bg-red-500 rounded-full animate-ping" />
          {activeTab === 'chat' && <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-rose-500" />}
        </button>
        <button
          id="comments-tab-btn"
          onClick={() => setActiveTab('comments')}
          className={`flex-1 py-3 text-xs font-bold transition-all relative ${
            activeTab === 'comments' ? 'text-rose-500' : 'text-neutral-400 hover:text-neutral-200'
          }`}
        >
          التعليقات المفضلة ({comments.length}) ⭐
          {activeTab === 'comments' && <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-rose-500" />}
        </button>
      </div>

      {/* Chat Messages Log view */}
      <div 
        ref={scrollRef}
        className="h-[340px] overflow-y-auto px-4 py-4 space-y-3.5 bg-[#000000]/40 relative scroll-smooth"
      >
        <AnimatePresence initial={false}>
          {activeTab === 'chat' ? (
            simulatedLiveChat.length > 0 ? (
              simulatedLiveChat.map((comment) => (
                <motion.div
                  key={comment.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-3 justify-start items-start text-right"
                >
                  <img
                    src={comment.avatar}
                    referrerPolicy="no-referrer"
                    alt={comment.username}
                    className="w-8 h-8 rounded-full bg-neutral-800 border border-neutral-900 object-cover shrink-0 mt-0.5"
                  />
                  <div className="flex-1 bg-neutral-900/60 p-2.5 rounded-2xl border border-neutral-900/50">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-[10px] text-neutral-500 font-mono">{comment.timestamp}</span>
                      <span className="text-xs font-bold text-neutral-300 font-mono">@{comment.username}</span>
                    </div>
                    <p className="text-xs text-neutral-100 leading-relaxed font-sans">{comment.text}</p>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center py-8">
                <Flame className="w-8 h-8 text-neutral-600 mb-2 animate-bounce" />
                <p className="text-xs text-neutral-500 font-sans">لا يوجد دردشة لهذا اللقاء حالياً. كن أول من يكتب!</p>
              </div>
            )
          ) : (
            comments.length > 0 ? (
              comments.map((comment) => (
                <motion.div
                  key={comment.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex gap-3 justify-start items-start text-right"
                >
                  <img
                    src={comment.avatar}
                    referrerPolicy="no-referrer"
                    alt={comment.username}
                    className="w-8.5 h-8.5 rounded-full bg-neutral-800 border border-neutral-900 object-cover shrink-0 mt-0.5"
                  />
                  <div className="flex-1 bg-neutral-900/90 p-3 rounded-2xl border border-neutral-800/60 shadow-sm relative">
                    <div className="flex justify-between items-center mb-1">
                      <div className="flex items-center gap-1.5">
                        <button
                          id={`comment-like-btn-${comment.id}`}
                          onClick={() => onLikeComment(comment.id)}
                          className={`flex items-center gap-1 text-[10px] focus:outline-none px-1.5 py-0.5 rounded-full ${
                            comment.isLiked ? 'bg-rose-500/10 text-rose-400' : 'bg-neutral-805 text-neutral-450'
                          }`}
                        >
                          <Heart className={`w-3.5 h-3.5 ${comment.isLiked ? 'fill-rose-500 text-rose-500' : 'text-neutral-400'}`} />
                          <span>{comment.likes}</span>
                        </button>
                      </div>
                      <span className="text-xs font-bold text-neutral-300 font-mono">@{comment.username}</span>
                    </div>
                    <p className="text-xs text-neutral-100 leading-relaxed font-sans">{comment.text}</p>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center py-8">
                <MessageSquare className="w-8 h-8 text-neutral-600 mb-2" />
                <p className="text-xs text-neutral-500 font-sans">لا توجد تعليقات مثبتة بعد. شارك رأيك بالأسفل!</p>
              </div>
            )
          )}
        </AnimatePresence>
      </div>

      {/* Quick Emojis reaction bar */}
      <div className="px-4 py-2 border-t border-neutral-900 bg-[#000000] flex gap-2 items-center overflow-x-auto scrollbar-none shrink-0 select-none font-sans">
        <span className="text-[10px] text-neutral-500 shrink-0 font-bold">تفاعلات سريعة:</span>
        {['🔥', '⚽', '🏆', '❤️', '🤩', '🗣️', '👏', '💥', '💪'].map((emoji) => (
          <button
            key={emoji}
            onClick={() => handleQuickEmoji(emoji)}
            className="text-sm px-2 py-1 rounded-lg bg-neutral-900 border border-neutral-800 hover:border-neutral-700 active:scale-95 transition"
          >
            {emoji}
          </button>
        ))}
      </div>

      {/* Chat sender input form */}
      <form onSubmit={handleSubmit} className="p-3 border-t border-neutral-900 bg-[#000000] flex gap-2 items-center">
        <input
          id="comment-input"
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="تفاعل واكتب تعليقك هنا مباشرة..."
          className="flex-1 bg-neutral-900 text-xs text-right text-neutral-100 placeholder-neutral-500 py-2.5 px-4 rounded-xl border border-neutral-800 focus:border-rose-500 focus:outline-none transition font-sans"
        />
        <button
          id="comment-submit-btn"
          type="submit"
          className="bg-rose-500 text-white w-9 h-9 rounded-xl flex items-center justify-center hover:bg-rose-600 transition active:scale-95 shrink-0 shadow-lg shadow-rose-500/10 focus:outline-none"
        >
          <Send className="w-4 h-4 -rotate-12" />
        </button>
      </form>
    </div>
  );
}
