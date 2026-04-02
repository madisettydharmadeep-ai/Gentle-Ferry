'use client';

import { motion } from 'framer-motion';

import { Ship, LogIn, User, Moon, Lock } from 'lucide-react';

import { useRouter } from 'next/navigation';

import { playTapSound } from '../utils/sound';

import CozyNews from './CozyNews';

import AlmanacModal from './AlmanacModal';

import { useAppContext } from '../app/context/AppContext';

import { navbarThemes } from '../utils/navbarThemes';

import Logo from './Logo';



export default function Navbar() {

  const router = useRouter();

  const {

    isAuthenticated, setShowLoginModal, isDarkMode, toggleDarkMode,

    userName, userPic, isPremium, setShowProModal

  } = useAppContext();

  const theme = isDarkMode ? navbarThemes.dark : navbarThemes.light;

  return (

    <nav className={`fixed top-5 left-6 right-6 lg:left-1/2 lg:-translate-x-1/2 lg:w-full lg:max-w-6xl z-[100] h-14 md:h-16 px-4 md:px-8 flex items-center justify-between border-[4px] shadow-sm backdrop-blur-xl transition-all duration-500 ${theme.background} ${theme.border} ${theme.shadow} rounded-xl`}>

     

      {/* Brand */}

      <div

        className="flex items-center gap-3 group cursor-pointer flex-1"

        onClick={() => { playTapSound(); router.push('/dashboard'); }}

      >

        <Logo size="sm" isDarkMode={isDarkMode} className="group-hover:-rotate-12 transition-transform" />

        <div className="flex flex-col">

          <span className={`font-serif font-black text-lg md:text-xl uppercase tracking-tighter leading-none mt-1 ${theme.brandText}`}>GENTLE FERRY</span>

        </div>

      </div>



      {/* Auth Control & Actions */}

      <div className="flex items-center gap-3 md:gap-4">

        <motion.button

          whileHover={{ scale: 1.05 }}

          whileTap={{ scale: 0.95 }}

          onClick={() => {

            playTapSound();

            if (isPremium) {

              toggleDarkMode();

            } else {

              setShowProModal(true);

            }

          }}

          className={`flex items-center justify-center p-2 md:p-2.5 rounded-xl border-[3px] hover:-translate-y-1 hover:-translate-x-1 active:translate-y-1 active:translate-x-1 active:shadow-none transition-all relative ${theme.buttonBg} ${theme.buttonBorder} ${theme.buttonShadow}`}

        >

          {!isPremium && (

            <div className="absolute -top-1.5 -right-1.5 bg-[#ffcf54] border-[2px] border-[#2c2a25] rounded-md px-1 py-0.5 flex items-center justify-center shadow-sm">

              <Lock size={8} strokeWidth={4} className="text-[#2c2a25]" />

            </div>

          )}

          <Moon size={18} strokeWidth={3} color={theme.iconColor} className="md:w-5 md:h-5" />

        </motion.button>

        <AlmanacModal />

        <CozyNews />



        {!isAuthenticated ? (

          <motion.button

            whileHover={{ scale: 1.05 }}

            whileTap={{ scale: 0.95 }}

            onClick={() => { playTapSound(); setShowLoginModal(true); }}

            className={`flex items-center justify-center p-2 md:p-2.5 rounded-xl border-[3px] hover:-translate-y-1 hover:-translate-x-1 active:translate-y-1 active:translate-x-1 active:shadow-none transition-all ${theme.buttonBg} ${theme.buttonBorder} ${theme.buttonShadow}`}

          >

            <LogIn size={18} strokeWidth={3} className="text-[#ff6b6b] md:w-5 md:h-5" />

          </motion.button>

        ) : (

          <motion.button

            whileHover={{ scale: 1.02, y: -2 }}

            whileTap={{ scale: 0.98 }}

            onClick={() => { playTapSound(); router.push('/profile'); }}

            className={`flex items-center justify-center gap-2 md:gap-2.5 px-2 py-1 md:px-1.5 md:py-[5px] md:pr-4 rounded-xl border-[3px] ${

              isDarkMode

                ? 'bg-[#1a2e26] border-[#2c3e36] shadow-[4px_4px_0_#00000050]'

                : 'bg-[#a8e6cf] border-[#2c2a25] shadow-[4px_4px_0_#2c2a25]'

            }`}

          >

            <div className={`shrink-0 w-[24px] h-[24px] md:w-[28px] md:h-[28px] rounded-md border-[1.5px] md:border-[2px] overflow-hidden flex items-center justify-center transition-transform group-hover:rotate-3 ${

              isDarkMode ? 'bg-[#2c3e36] border-[#3d4f47]' : 'bg-[#c65f4b] border-[#2c2a25]'

            }`}>

              <span className={`font-serif font-black text-[12px] md:text-[14px] uppercase ${isDarkMode ? 'text-[#a8e6cf]' : 'text-white'}`}>

                {userName ? userName.charAt(0) : 'T'}

              </span>

            </div>

            <span className={`hidden md:block font-sans font-black text-[10px] uppercase tracking-widest ${isDarkMode ? 'text-[#a8e6cf]' : 'text-[#2c2a25]'} truncate max-w-[60px]`}>

              {userName ? `${userName.substring(0, 4)}...` : 'TRV...'}

            </span>

          </motion.button>

        )}

      </div>

    </nav>

  );

}