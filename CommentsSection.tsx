import React, { useState, useEffect } from 'react';
import { Tv, Shield, Trophy, Gift, Sparkles, Download, Smartphone, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function LivePlayer() {
  const [activeServer, setActiveServer] = useState<1 | 2 | 3>(1);
  const [showSponsor, setShowSponsor] = useState(true); // true initially to let user preview it
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    // Hide the initial preview after 15 seconds
    const initialTimer = setTimeout(() => {
      setShowSponsor(false);
    }, 15000);

    // Interval to trigger showing every 2 minutes (120000ms)
    const interval = setInterval(() => {
      setShowSponsor(true);
      // Keep it visible for 30 seconds
      setTimeout(() => {
        setShowSponsor(false);
      }, 30000);
    }, 120000);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(interval);
    };
  }, []);

  const getServerUrl = (server: number) => {
    if (server === 1) return 'https://k2.sansa-yaman.net/albaplayer/b1/';
    return `https://k2.sansa-yaman.net/albaplayer/b1/?serv=${server}`;
  };

  const handleApkDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowToast(true);
    
    // Simulate natural apk download trigger
    const link = document.createElement('a');
    link.href = '#';
    link.setAttribute('download', 'spinbetter-205918.apk');
    // In real app we would have the actual apk url, we trigger simulated download feel
    setTimeout(() => {
      setShowToast(false);
    }, 5000);
  };

  return (
    <div id="live-player-section" className="w-full flex flex-col bg-black border-y border-neutral-900 md:border md:border-neutral-900 md:rounded-2xl overflow-hidden shadow-2xl">
      {/* Embedded Live Iframe Cropped to hide the internal top navigation bar */}
      <div className="relative w-full bg-[#000000] h-[320px] xs:h-[360px] sm:h-[480px] overflow-hidden">
        {/* Solid elegant top bar to completely cover the third-party logo and watermark link at the top */}
        <div className="absolute top-0 left-0 right-0 h-14 bg-black border-b border-neutral-900/60 flex items-center justify-between px-4 z-10 select-none pointer-events-none font-sans">
          <div className="flex items-center gap-1.5 text-rose-400 font-black text-xs sm:text-sm">
            <span className="w-2 h-2 bg-rose-500 rounded-full animate-ping shrink-0" />
            <span>كأس العالم في جيبك 🏆</span>
          </div>
          <div className="text-neutral-400 text-[10px] sm:text-xs font-bold">بث مباشر فوري ومحمّي ⚽</div>
        </div>

        {/* Sponsor Banner - Slides in with custom gold neon border and glows */}
        <AnimatePresence>
          {showSponsor && (
            <motion.div
              initial={{ opacity: 0, y: 40, x: '-50%' }}
              animate={{ opacity: 1, y: 0, x: '-50%' }}
              exit={{ opacity: 0, y: 30, x: '-50%', scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 120, damping: 14 }}
              className="absolute bottom-6 left-1/2 bg-neutral-950/95 border border-yellow-500/50 text-yellow-400 font-sans py-3.5 px-5 rounded-2xl shadow-[0_0_35px_rgba(234,179,8,0.35)] flex flex-col sm:flex-row items-center gap-3.5 z-25 select-none font-bold text-center w-auto max-w-[92%] sm:min-w-[360px] pointer-events-auto"
            >
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-yellow-400 to-amber-600 flex items-center justify-center text-neutral-950 shrink-0 shadow-lg shadow-yellow-500/20">
                  <Sparkles className="w-5 h-5 animate-pulse" />
                </div>
                <div className="text-right flex-1 min-w-0">
                  <p className="text-[9px] text-yellow-400/85 tracking-wide uppercase font-black">الراعي الرسمي للبث المباشر</p>
                  <p className="text-xs sm:text-sm font-black text-white shrink-0">
                    <span className="text-yellow-400 font-extrabold">SpinBetter</span> 🎰🔥
                  </p>
                </div>
              </div>

              <div className="h-px w-full bg-neutral-800 sm:hidden" />

              <div className="flex flex-col items-center sm:items-end justify-center gap-1.5 w-full sm:w-auto sm:border-r sm:border-neutral-800 sm:pr-4 sm:mr-1">
                <button
                  onClick={handleApkDownload}
                  className="flex items-center justify-center gap-1.5 bg-gradient-to-r from-yellow-500 to-amber-600 text-neutral-950 px-3.5 py-1.5 rounded-xl text-[10px] font-black hover:brightness-110 active:scale-95 transition shadow-lg shadow-yellow-500/10"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>تحميل تطبيق spinbetter-205918.apk 📥</span>
                </button>
                <div className="flex items-center gap-1.5 text-[9px] text-zinc-300 font-medium whitespace-nowrap">
                  <span className="bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded font-black animate-pulse">مكافأة 100% 💸</span>
                  <span className="font-extrabold text-yellow-500 hover:text-yellow-400 transition underline cursor-pointer">اضغط للرهان على المباراة ⚽🏆</span>
                </div>
              </div>

              <div className="w-1.5 h-1.5 bg-yellow-450 rounded-full animate-ping shrink-0 hidden sm:block" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Dynamic Download Toast popup indicating file state */}
        <AnimatePresence>
          {showToast && (
            <motion.div
              initial={{ opacity: 0, y: -20, x: '-50%' }}
              animate={{ opacity: 1, y: 0, x: '-50%' }}
              exit={{ opacity: 0, y: -20, x: '-50%' }}
              className="absolute top-16 left-1/2 bg-neutral-950/95 border border-emerald-500/40 text-emerald-400 font-sans py-3 px-5 rounded-xl shadow-2xl flex items-center gap-3 z-30 select-none font-black text-xs min-w-[280px] max-w-[90%] pointer-events-none"
            >
              <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 animate-bounce" />
              <div className="text-right flex-1">
                <p className="text-white text-[11px]">جاري بدء تنزيل التطبيق...</p>
                <p className="text-[9px] text-zinc-400 mt-0.5 font-mono">spinbetter-205918.apk (24.8 MB)</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <iframe
          src={getServerUrl(activeServer)}
          allowFullScreen={true}
          frameBorder="0"
          scrolling="no"
          className="absolute top-0 left-0 w-full h-full bg-black border-0 block"
        />
      </div>

      {/* Modern, clean server selector icons/buttons right under the broadcast player */}
      <div className="flex flex-col gap-2 p-3 bg-neutral-950 border-t border-neutral-900">
        <div className="flex items-center justify-between px-1">
          <span className="text-[10px] text-neutral-400 font-bold font-sans">اختر سيرفر البث المفضل:</span>
          <span className="text-[9px] text-neutral-550 font-sans">تغيير السيرفر يحل مشكلة تقطيع الصوت أو الصورة فورتً</span>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {[1, 2, 3].map((serverNum) => (
            <button
              key={serverNum}
              onClick={() => setActiveServer(serverNum as 1 | 2 | 3)}
              className={`flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl border text-xs font-bold transition duration-200 active:scale-95 ${
                activeServer === serverNum
                  ? 'bg-rose-500/10 border-rose-500 text-rose-450 shadow-[0_0_12px_rgba(244,63,94,0.15)] animate-pulse'
                  : 'bg-neutral-900 border-neutral-850 text-neutral-400 hover:border-neutral-800 hover:text-neutral-200'
              }`}
            >
              <Tv className="w-3.5 h-3.5 shrink-0" />
              <span>سيرفر {serverNum}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Secondary micro features */}
      <div className="flex justify-between items-center py-2.5 px-4 bg-[#000000] border-t border-neutral-900 text-[10px] text-neutral-450">
        <div className="flex items-center gap-1 text-rose-500/80 font-bold select-none">
          <Shield className="w-3 h-3 shrink-0" />
          <span>حماية وتغطية آمنة 100%</span>
        </div>
        <span className="font-sans font-medium text-neutral-550">منصة كأس العالم في جيبك الرسمية</span>
      </div>
    </div>
  );
}
