import React, { useState, useEffect } from 'react';
import { Comment } from './types';
import { INITIAL_COMMENTS } from './data';
import LivePlayer from './components/LivePlayer';
import CommentsSection from './components/CommentsSection';
import { Trophy, Download, CheckCircle, Smartphone, Share2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [comments, setComments] = useState<Comment[]>(() => {
    const saved = localStorage.getItem('koralive_comments_items');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
         return INITIAL_COMMENTS;
      }
    }
    return INITIAL_COMMENTS;
  });

  const [showPwaPrompt, setShowPwaPrompt] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  // Sync state values with local storage
  useEffect(() => {
    localStorage.setItem('koralive_comments_items', JSON.stringify(comments));
  }, [comments]);

  // Check and suggest PWA installation on startup & track beforeinstallprompt
  useEffect(() => {
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      // Automatically prompt to show user helper PWA modal as well
      setShowPwaPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone;
    if (!isStandalone) {
      const timer = setTimeout(() => {
        setShowPwaPrompt(true);
      }, 5000);
      return () => {
        clearTimeout(timer);
        window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      };
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      // Just close modal or show standard instructions
      setShowPwaPrompt(false);
      return;
    }
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      console.log('User accepted the PWA install prompt');
    }
    setDeferredPrompt(null);
    setShowPwaPrompt(false);
  };

  const handleAddComment = (text: string) => {
    const newComment: Comment = {
      id: `c-${Date.now()}`,
      matchId: 1,
      username: 'عاشق_المونديال',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
      text: text,
      timestamp: 'الآن',
      likes: 0,
      isLiked: false
    };
    setComments((prev) => [newComment, ...prev]);
  };

  const handleLikeComment = (commentId: string) => {
    setComments((prev) =>
      prev.map((c) =>
        c.id === commentId ? { ...c, isLiked: !c.isLiked, likes: c.isLiked ? c.likes - 1 : c.likes + 1 } : c
      )
    );
  };

  return (
    <div className="min-h-screen bg-[#000000] text-neutral-100 flex flex-col justify-between selection:bg-rose-500 pb-12 relative font-sans leading-relaxed">
      
      {/* 1. Ultra-thin Minimalist Header */}
      <header className="sticky top-0 z-50 bg-[#000000] border-b border-neutral-900/60 px-4 py-1.5 backdrop-blur-md flex justify-between items-center select-none h-10 shrink-0">
        <button
          id="pwa-guide-trigger"
          onClick={() => setShowPwaPrompt(true)}
          className="flex items-center gap-1 px-2.5 py-1 bg-rose-500/10 text-rose-400 border border-rose-500/20 rounded-full text-[9px] font-black hover:bg-rose-500/20 active:scale-95 transition focus:outline-none"
        >
          <Download className="w-3 h-3" />
          <span>تثبيت PWA</span>
        </button>

        <div className="flex items-center gap-1.5">
          <span className="text-[10px] text-neutral-400 font-medium font-sans">مباشر الآن</span>
          <span className="w-1.5 h-1.5 bg-rose-500 rounded-full animate-ping shrink-0" />
        </div>

        <div className="flex items-center gap-1.5">
          <Trophy className="w-3.5 h-3.5 text-rose-500 shrink-0" />
          <span className="text-xs font-black tracking-tight text-neutral-200">
            كأس العالم في جيبك
          </span>
        </div>
      </header>

      {/* 2. Main Area: One Live video container and comments directly below it, maximized for vertical screen */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-0 md:px-4 py-0 md:py-6 flex flex-col justify-start">
        <div className="w-full flex flex-col gap-0 md:gap-4">
          
          {/* Stream Iframe Container */}
          <LivePlayer />

          {/* Connected Live Chat Area */}
          <CommentsSection
            comments={comments}
            onAddComment={handleAddComment}
            onLikeComment={handleLikeComment}
          />

        </div>
      </main>

      {/* 3. Streamlined App Footer */}
      <footer className="w-full py-8 px-4 border-t border-neutral-900 text-center text-neutral-500 text-xs bg-[#000000] mt-12 select-none">
        <p className="font-bold text-neutral-400 font-display">كأس العالم في جيبك</p>
        <p className="mt-1">دليلك الشامل لمتابعة بطولة كأس العالم وكل ما يتعلق بعالم كرة القدم لحظة بلحظة وببساطة</p>
        <div className="flex items-center justify-center gap-1.5 mt-3 text-neutral-600 font-medium font-sans">
          <CheckCircle className="w-3.5 h-3.5 text-emerald-500/80 shrink-0" />
          <span>تطبيق ويب تقدمي (PWA) مع تخزين محلي غير محدود للتعليقات</span>
        </div>
        <p className="mt-4 text-[10px] text-neutral-700">© 2026 كأس العالم في جيبك. جميع الحقوق محفوظة.</p>
      </footer>

      {/* 4. Custom PWA Install assistance guide popup */}
      <AnimatePresence>
        {showPwaPrompt && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-neutral-900 border border-neutral-800 p-6 rounded-3xl max-w-sm w-full shadow-2xl relative text-right"
            >
              <button
                id="close-pwa-prompt"
                onClick={() => setShowPwaPrompt(false)}
                className="absolute top-4 left-4 w-7 h-7 rounded-full bg-neutral-800 hover:bg-neutral-700 flex items-center justify-center text-zinc-300 focus:outline-none"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex justify-center mb-4 select-none">
                <div className="w-16 h-16 rounded-3xl custom-insta-ring p-[3px] shadow-lg shadow-rose-500/20">
                  <div className="w-full h-full bg-[#000000] rounded-2xl flex items-center justify-center font-black text-rose-500 text-xs">
                    جيبك
                  </div>
                </div>
              </div>

              <h3 className="text-base font-extrabold text-white text-center mb-1.5">تثبيت تطبيق كأس العالم في جيبك PWA</h3>
              <p className="text-xs text-neutral-300 text-center leading-relaxed mb-6 font-sans">
                احصل على التطبيق مباشرة على شاشتك الرئيسية لمطالعة البث ومشاركة آرائك مباشرة مع لقطات الأهداف وجماهير المونديال!
              </p>

              <div className="space-y-3.5 border-t border-neutral-850 pt-4">
                <div className="flex gap-3 justify-end items-start text-xs text-neutral-350 font-sans font-medium">
                  <div className="flex-1">
                    <h4 className="font-bold text-neutral-200">لهواتف أندرويد ومتصفح كروم</h4>
                    <p className="text-[10px] text-neutral-400 mt-0.5">انقر على النقاط الثلاث بالأعلى ثم اختر "تثبيت التطبيق" أو "إضافة لشاشة الهاتف".</p>
                  </div>
                  <Smartphone className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                </div>

                <div className="flex gap-3 justify-end items-start text-xs text-neutral-355 font-sans font-medium">
                  <div className="flex-1">
                    <h4 className="font-bold text-neutral-200">لهواتف آيفون ومتصفح سفاري iPhone</h4>
                    <p className="text-[10px] text-neutral-400 mt-0.5">انقر على زر "مشاركة" (Share) ثم اختر "إضافة إلى الشاشة الرئيسية" (Add to Home Screen).</p>
                  </div>
                  <Share2 className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                </div>
              </div>

              {deferredPrompt ? (
                <button
                  id="direct-pwa-install-btn"
                  onClick={handleInstallClick}
                  className="w-full bg-gradient-to-r from-yellow-500 via-rose-500 to-indigo-500 text-white font-extrabold text-xs py-3 rounded-xl mt-6 transition hover:brightness-110 active:scale-95 shadow-lg shadow-rose-500/20 focus:outline-none font-sans"
                >
                  حـمّـلـه الآن وتـثـبـيـت تـلـقـائـي ⚡🏆
                </button>
              ) : (
                <button
                  id="accept-pwa-prompt"
                  onClick={() => setShowPwaPrompt(false)}
                  className="w-full bg-gradient-to-r from-yellow-500 via-rose-500 to-indigo-500 text-white font-bold text-xs py-3 rounded-xl mt-6 transition hover:brightness-110 active:scale-95 shadow-md shadow-rose-500/10 focus:outline-none font-sans"
                >
                  حـسـنـاً، مـفـهـوم 👌
                </button>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}

function X({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}
