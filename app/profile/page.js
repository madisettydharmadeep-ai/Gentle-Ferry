"use client";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  LogOut,
  Bookmark,
  FileText,
  MoveLeft,
  X,
  Star,
  Calendar as CalendarIcon,
  Target,
  Share2,
  Download,
  Frown,
  Meh,
  Smile,
  SunMoon,
} from "lucide-react";
import Navbar from "../../components/Navbar";
import { useAppContext } from "../context/AppContext";
import { navbarThemes } from "../../utils/navbarThemes";
import { useRouter } from "next/navigation";
import { playTapSound, playSwooshSound } from "../../utils/sound";
import ReceiptCard from "../../components/ReceiptCard";
import { createPortal } from "react-dom";
import HabitTracker from "../../components/HabitTracker";
import ModeToggle from "../../components/ModeToggle";



export default function ProfilePage() {
  const router = useRouter();
  const {
    receipts,
    logout,
    loaded,
    isAuthenticated,
    today,
    isDarkMode,
    tasks,
  } = useAppContext();
  const theme = isDarkMode ? navbarThemes.dark : navbarThemes.light;

  const [currentDate, setCurrentDate] = useState(today);
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState("calendar");
  const [selectedDateStr, setSelectedDateStr] = useState("");
  const receiptCardRef = useRef(null);

  useEffect(() => {
    setMounted(true);
    if (loaded && !isAuthenticated) {
      router.push("/");
    }
  }, [loaded, isAuthenticated, router]);

  if (!loaded || !isAuthenticated || !mounted) return null;

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfWeek = new Date(year, month, 1).getDay();
  const monthName = currentDate.toLocaleDateString("en-US", { month: "long" });

  const generateGrid = () => {
    let days = [];
    for (let i = 0; i < firstDayOfWeek; i++) {
      days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      const dateStr = new Date(year, month, i).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      });
      let receipt = receipts.find((r) => r.date === dateStr);



      days.push({ day: i, dateStr, hasReceipt: !!receipt, receipt });
    }
    return days;
  };

  const handleDayClick = (dayObj) => {
    if (!dayObj) return;
    playTapSound?.();
    setSelectedDateStr(dayObj.dateStr);
    setSelectedReceipt(dayObj.receipt || "empty");
    setIsModalOpen(true);
  };

  const closeModal = () => {
    playSwooshSound?.();
    setIsModalOpen(false);
    setTimeout(() => setSelectedReceipt(null), 300);
  };

  const ReceiptModal = () => {
    if (!isModalOpen) return null;

    return createPortal(
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            key="receipt-modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={`fixed inset-0 z-[10000] ${isDarkMode ? "bg-black/80" : "bg-[#1a1815]/40"} backdrop-blur-md p-4 sm:p-6 flex items-center justify-center`}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 30 }}
              className="w-full max-w-5xl relative"
            >
              <button 
                onClick={closeModal}
                className={`absolute top-8 right-8 z-50 p-2 rounded-full hover:bg-black/5 transition-all ${isDarkMode ? 'text-stone-500 hover:text-stone-300' : 'text-stone-400 hover:text-stone-800'}`}
              >
                <X size={24} strokeWidth={2.5} />
              </button>

              {selectedReceipt !== "empty" ? (
                <ReceiptCard
                  ref={receiptCardRef}
                  receipt={selectedReceipt}
                  isDarkMode={isDarkMode}
                  theme={theme}
                  className="w-full h-full"
                />
              ) : (
                <div
                  className={`w-full ${isDarkMode ? 'bg-[#1a1815]' : 'bg-[#fffcf8]'} border-[3px] ${theme.taskCardBorder} ${isDarkMode ? "shadow-[0_40px_100px_-20px_rgba(0,0,0,0.8)]" : "shadow-[0_40px_100px_-30px_rgba(44,42,37,0.25)]"} p-12 rounded-[4px] flex flex-col items-center text-center`}
                >
                  <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: `url('https://www.transparenttextures.com/patterns/natural-paper.png')`, backgroundBlendMode: isDarkMode ? 'hard-light' : 'multiply', opacity: isDarkMode ? 0.7 : 1 }} />
                  <div
                    className={`relative z-10 w-14 h-14 ${theme.taskCardBg} border-[2.5px] ${theme.taskCardBorder} rounded-xl flex items-center justify-center mb-5 shadow-[2px_2px_0_#00000010]`}
                  >
                    <FileText
                      size={28}
                      className={isDarkMode ? "text-[#fdf8ea]/20" : "text-[#2c2a25]/20"}
                      strokeWidth={2.5}
                    />
                  </div>
                  <h3 className={`relative z-10 font-serif font-black text-2xl ${isDarkMode ? "text-[#fdf8ea]" : "text-[#2c2a25]"} tracking-tighter uppercase mb-2`}>
                    Silent Records
                  </h3>
                  <div className="relative z-10 w-10 h-1 bg-[#ffcf54] rounded-full mb-5" />
                  <p className={`relative z-10 font-sans font-black text-[9px] uppercase tracking-[0.2em] ${isDarkMode ? "text-[#fdf8ea]/30" : "text-[#2c2a25]/30"} max-w-[180px] leading-loose`}>
                    The ink of time has not yet touched this day.
                  </p>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>,
      document.body,
    );
  };

  return (
    <div className="min-h-screen relative flex flex-col bg-[#2b2b2b]">
      <div
        className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat transition-all duration-1000"
        style={{ backgroundImage: `url("/eggs.jpg")` }}
      />
      <div
        className={`fixed inset-0 z-0 backdrop-blur-[5px] ${isDarkMode ? "bg-black/60" : "bg-[#2b2b2b]/10"} pointer-events-none text-transparent`}
      />

      <Navbar />

      <main className="relative z-10 flex-1 w-full max-w-4xl mx-auto px-2 md:px-6 pt-24 pb-16 flex flex-col gap-6">
        <div
          className={`${theme.taskCardBg} bg-[url('https://www.transparenttextures.com/patterns/lined-paper-2.png')] border-[3px] ${theme.taskCardBorder} p-5 md:p-6 rounded-xl ${isDarkMode ? "shadow-[10px_10px_0_#00000060]" : "shadow-[10px_10px_0_#2c2a2505]"} flex flex-col md:flex-row items-center justify-between relative overflow-hidden group gap-4`}
        >
          {/* Texture overlay - extra subtle */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/lined-paper-2.png')]" />

          <div className="flex items-center gap-5 relative z-10">
            <div
              className={`w-16 h-16 md:w-20 md:h-20 ${isDarkMode ? "bg-[#3d2f1f]" : "bg-[#ffcf54]"} border-[3px] ${theme.taskCardBorder} rounded-xl ${isDarkMode ? "shadow-[5px_5px_0_#00000040]" : "shadow-[5px_5px_0_#2c2a25]"} flex items-center justify-center -rotate-2 group-hover:rotate-0 transition-all duration-500`}
            >
              <User
                size={30}
                className={`${isDarkMode ? "text-[#ffcf54]" : "text-[#2c2a25]"} md:w-10 md:h-10`}
                strokeWidth={3}
              />
            </div>

            <div className="flex flex-col">
              <span
                className={`font-sans font-black ${isDarkMode ? "text-[#ff8a8a]" : "text-[#ff6b6b]"} text-[8px] md:text-[9px] uppercase tracking-[0.4em] mb-1`}
              >
                Registered Wanderer
              </span>
              <h1
                className={`font-serif font-black text-2xl md:text-4xl ${isDarkMode ? "text-[#fdf8ea]" : "text-[#2c2a25]"} uppercase tracking-tighter leading-none mb-2`}
              >
                {localStorage.getItem("gentle_ferry_user_name") || "Traveler"}
              </h1>
              <div className="flex items-center gap-2">
                <div
                  className={`flex items-center gap-1.5 ${theme.modalInputBg} px-3 py-1 rounded-full border-[2px] ${theme.taskCardBorder} ${isDarkMode ? "shadow-[2px_2px_0_#00000040]" : "shadow-[2px_2px_0_#2c2a2505]"}`}
                >
                  <Bookmark
                    size={12}
                    className={isDarkMode ? "text-[#a8e6cf]" : "text-[#5ba882]"}
                    strokeWidth={4}
                  />
                  <span
                    className={`font-sans font-black ${isDarkMode ? "text-[#fdf8ea]" : "text-[#2c2a25]"} text-[9px] uppercase tracking-widest whitespace-nowrap`}
                  >
                    {receipts.length} Records
                  </span>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              playSwooshSound?.();
              logout();
            }}
            className={`flex items-center justify-center gap-3 px-5 py-3 ${theme.modalInputBg} border-[2.5px] ${theme.taskCardBorder} rounded-xl ${isDarkMode ? "shadow-[5px_5px_0_#00000060]" : "shadow-[5px_5px_0_#2c2a25]"} hover:-translate-y-0.5 hover:shadow-[7px_7px_0_#2c2a25] active:translate-y-0.5 active:shadow-none transition-all group/logout relative z-10`}
          >
            <LogOut
              size={16}
              strokeWidth={3}
              className={`${isDarkMode ? "text-[#fdf8ea]" : "text-[#2c2a25]"} group-hover:text-[#ff6b6b] transition-colors`}
            />
            <span
              className={`font-sans font-black text-[10px] uppercase tracking-widest ${isDarkMode ? "text-[#fdf8ea]" : "text-[#2c2a25]"}`}
            >
              Depart Ferry
            </span>
          </button>
        </div>

        <div className="flex justify-center">
          <div
            className={`p-2 rounded-lg flex items-center gap-2 border-[3px] ${theme.taskCardBorder} ${isDarkMode ? "shadow-[6px_6px_0_#00000060]" : "shadow-[6px_6px_0_#2c2a2505]"} ${isDarkMode ? "bg-[#1a1815]/80" : "bg-white/40"} backdrop-blur-md`}
          >
            <button
              onClick={() => {
                playTapSound?.();
                setActiveTab("calendar");
              }}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-md transition-all duration-300 font-sans font-black uppercase tracking-[0.2em] text-[10px] border-[2.5px] ${
                activeTab === "calendar"
                  ? isDarkMode
                    ? "bg-[#ffcf54] text-[#2c2a25] border-[#ffcf54]"
                    : "bg-[#2c2a25] text-[#ffcf54] border-[#2c2a25] shadow-[3px_3px_0_#ffcf5415]"
                  : `${isDarkMode ? "bg-transparent text-[#fdf8ea]/40 hover:text-[#fdf8ea]" : "bg-white/60 text-[#2c2a25]/40 hover:text-[#2c2a25]"} border-transparent hover:border-current/10`
              }`}
            >
              <CalendarIcon size={14} strokeWidth={3} />
              <span>Chronicle</span>
            </button>

            <button
              onClick={() => {
                playTapSound?.();
                setActiveTab("stats");
              }}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-md transition-all duration-300 font-sans font-black uppercase tracking-[0.2em] text-[10px] border-[2.5px] ${
                activeTab === "stats"
                  ? isDarkMode
                    ? "bg-[#ffcf54] text-[#2c2a25] border-[#ffcf54]"
                    : "bg-[#2c2a25] text-[#ffcf54] border-[#2c2a25] shadow-[3px_3px_0_#ffcf5415]"
                  : `${isDarkMode ? "bg-transparent text-[#fdf8ea]/40 hover:text-[#fdf8ea]" : "bg-white/60 text-[#2c2a25]/40 hover:text-[#2c2a25]"} border-transparent hover:border-current/10`
              }`}
            >
              <Target size={14} strokeWidth={3} />
              <span>Habits</span>
            </button>
            <button
              onClick={() => {
                playTapSound?.();
                setActiveTab("mode");
              }}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-md transition-all duration-300 font-sans font-black uppercase tracking-[0.2em] text-[10px] border-[2.5px] ${
                activeTab === "mode"
                  ? isDarkMode
                    ? "bg-[#ffcf54] text-[#2c2a25] border-[#ffcf54]"
                    : "bg-[#2c2a25] text-[#ffcf54] border-[#2c2a25] shadow-[3px_3px_0_#ffcf5415]"
                  : `${isDarkMode ? "bg-transparent text-[#fdf8ea]/40 hover:text-[#fdf8ea]" : "bg-white/60 text-[#2c2a25]/40 hover:text-[#2c2a25]"} border-transparent hover:border-current/10`
              }`}
            >
              <SunMoon size={14} strokeWidth={3} />
              <span>Mode</span>
            </button>
          </div>
        </div>

        <div
          className={`border-[3px] ${theme.taskCardBorder} rounded-xl ${isDarkMode ? "shadow-[10px_10px_0_#00000060]" : "shadow-[10px_10px_0_#2c2a2505]"} overflow-hidden relative min-h-[450px]`}
        >
          {activeTab === "calendar" && (
            <div
              className={`flex flex-col h-full ${theme.taskCardBg} bg-[url('https://www.transparenttextures.com/patterns/lined-paper-2.png')] relative`}
            >
              <div
                className={`absolute top-0 left-0 right-0 h-5 bg-[#c65f4b] border-b-[2.5px] ${theme.taskCardBorder} flex items-center justify-evenly px-12 z-20`}
              >
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div
                    key={i}
                    className={`w-2 h-3 ${isDarkMode ? "bg-[#1b1a17]" : "bg-[#f8f5ee]"} border-[1.5px] ${theme.taskCardBorder} rounded-full`}
                  />
                ))}
              </div>

              <div className="relative z-10 px-2 pt-12 pb-6 md:px-10 md:pt-8 md:pb-0 flex flex-col items-center gap-4">
                <div className="flex items-center justify-between w-full max-w-lg">
                  <button
                    onClick={() => {
                      playSwooshSound?.();
                      setCurrentDate(new Date(year, month - 1, 1));
                    }}
                    className={`w-10 h-10 ${theme.modalInputBg} border-[2.5px] ${theme.taskCardBorder} ${isDarkMode ? "text-[#fdf8ea]" : "text-[#2c2a25]"} rounded-xl ${isDarkMode ? "shadow-[3px_3px_0_#00000040]" : "shadow-[3px_3px_0_#2c2a25]"} hover:-translate-y-0.5 active:translate-y-0.5 active:shadow-none transition-all flex items-center justify-center group`}
                  >
                    <MoveLeft size={18} strokeWidth={3} />
                  </button>

                  <div className="flex flex-col items-center">
                    <span
                      className={`font-sans font-black ${isDarkMode ? "text-[#ff8a8a]" : "text-[#ff6b6b]"} text-[8px] uppercase tracking-[0.4em] mb-1.5 leading-none`}
                    >
                      Archival Phase
                    </span>
                    <h2
                      className={`font-serif font-black uppercase tracking-tighter text-3xl md:text-5xl ${isDarkMode ? "text-[#fdf8ea]" : "text-[#2c2a25]"} text-center leading-none`}
                    >
                      {monthName}
                    </h2>
                    <div className="flex items-center gap-3 mt-3">
                      <div
                        className={`h-[1.5px] w-8 ${isDarkMode ? "bg-[#ffcf54]" : "bg-[#2c2a25]"} opacity-10`}
                      />
                      <span
                        className={`font-serif italic font-black text-lg ${isDarkMode ? "text-[#fdf8ea]/40" : "text-[#2c2a25]/40"}`}
                      >
                        {year}
                      </span>
                      <div
                        className={`h-[1.5px] w-8 ${isDarkMode ? "bg-[#ffcf54]" : "bg-[#2c2a25]"} opacity-10`}
                      />
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      playSwooshSound?.();
                      setCurrentDate(new Date(year, month + 1, 1));
                    }}
                    className={`w-10 h-10 ${theme.modalInputBg} border-[2.5px] ${theme.taskCardBorder} ${isDarkMode ? "text-[#fdf8ea]" : "text-[#2c2a25]"} rounded-xl ${isDarkMode ? "shadow-[3px_3px_0_#00000040]" : "shadow-[3px_3px_0_#2c2a25]"} hover:-translate-y-0.5 active:translate-y-0.5 active:shadow-none transition-all flex items-center justify-center group`}
                  >
                    <MoveLeft
                      size={18}
                      strokeWidth={3}
                      className="rotate-180"
                    />
                  </button>
                </div>
              </div>

              <div className="relative z-10 p-2 md:p-8 flex-1">
                <div className="max-w-3xl mx-auto">
                  <div className="grid grid-cols-7 gap-1 md:gap-3 mb-4">
                    {["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"].map(
                      (d) => (
                        <div
                          key={d}
                          className="flex flex-col items-center gap-1.5"
                        >
                          <span
                            className={`font-sans font-black ${isDarkMode ? "text-[#fdf8ea]/40" : "text-[#2c2a25]/40"} text-[8px] uppercase tracking-[0.3em]`}
                          >
                            {d}
                          </span>
                          <div
                            className={`w-0.5 h-0.5 rounded-full ${isDarkMode ? "bg-[#ffcf54]/10" : "bg-[#2c2a25]/10"}`}
                          />
                        </div>
                      ),
                    )}
                  </div>

                  <div className="grid grid-cols-7 gap-1 md:gap-3">
                    {generateGrid().map((dayObj, index) => {
                      if (!dayObj)
                        return (
                          <div
                            key={`empty-${index}`}
                            className="aspect-square"
                          />
                        );
                      const isToday =
                        dayObj.dateStr ===
                        today.toLocaleDateString("en-US", {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        });

                      return (
                        <motion.button
                          key={index}
                          whileHover={{ y: -3, x: -1 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleDayClick(dayObj)}
                          className={`aspect-square flex flex-col items-center justify-center relative group rounded-xl transition-all duration-300 border-[2.5px] ${theme.taskCardBorder} overflow-hidden ${
                            dayObj.hasReceipt
                              ? `${theme.modalInputBg} ${isDarkMode ? "shadow-[4px_4px_0_#00000040]" : "shadow-[4px_4px_0_#2c2a2510]"}`
                              : `${isDarkMode ? "bg-black/20" : "bg-[#fffcf2]/40"} hover:${theme.modalInputBg} ${isDarkMode ? "hover:shadow-[3px_3px_0_#00000040]" : "hover:shadow-[3px_3px_0_#2c2a2508]"}`
                          }`}
                        >
                          {dayObj.hasReceipt && dayObj.receipt?.photo && (
                            <div className="absolute inset-0 z-0">
                              <img
                                src={dayObj.receipt.photo}
                                alt=""
                                className="w-full h-full object-cover saturate-[0.8] opacity-80 group-hover:opacity-100 group-hover:saturate-100 transition-all duration-700"
                              />
                              <div
                                className={`absolute inset-0 ${isDarkMode ? "bg-black/20" : "bg-[#2c2a25]/05"} group-hover:bg-transparent transition-colors`}
                              />
                            </div>
                          )}

                          {isToday && (
                            <div
                              className={`absolute top-1.5 right-1.5 w-2 h-2 ${isDarkMode ? "bg-[#ff8a8a]" : "bg-[#ff6b6b]"} border-[1.5px] ${theme.taskCardBorder} shadow-sm rounded-full z-20`}
                            />
                          )}

                          <span
                            className={`relative z-10 font-serif font-black text-xl md:text-2xl tracking-tighter transition-all duration-500 ${
                              dayObj.hasReceipt
                                ? `${isDarkMode ? "text-[#fdf8ea]" : "text-[#2c2a25]"} group-hover:text-white group-hover:drop-shadow-[0_1px_3px_rgba(44,42,37,0.8)]`
                                : `${isDarkMode ? "text-[#fdf8ea]/15" : "text-[#2c2a25]/15"} group-hover:text-current/60`
                            }`}
                          >
                            {dayObj.day}
                          </span>

                          {dayObj.hasReceipt && (
                            <div className="absolute bottom-1.5 right-1.5 z-20">
                              <Bookmark
                                size={8}
                                className={`${dayObj.receipt?.photo ? "text-white/80 group-hover:text-white" : isDarkMode ? "text-[#a8e6cf]" : "text-[#ffcf54]"}`}
                                strokeWidth={4}
                              />
                            </div>
                          )}
                        </motion.button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "stats" && (
            <div
              className={`p-6 md:p-8 ${theme.taskCardBg} bg-[url('https://www.transparenttextures.com/patterns/lined-paper-2.png')] h-full`}
            >
              <HabitTracker
                receipts={receipts}
                tasks={tasks}
                isDarkMode={isDarkMode}
                theme={theme}
              />
            </div>
          )}

          {activeTab === "mode" && (
            <div
              className={`flex flex-col items-center justify-center p-6 md:p-12 ${theme.taskCardBg} bg-[url('https://www.transparenttextures.com/patterns/lined-paper-2.png')] h-full min-h-[450px]`}
            >
              <ModeToggle variant="massive" />
            </div>
          )}
        </div>
      </main>

      <ReceiptModal />
    </div>
  );
}
