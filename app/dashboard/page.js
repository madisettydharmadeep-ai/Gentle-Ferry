'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppContext } from '../context/AppContext';
import PhaseTasks from '../../components/PhaseTasks';
import Navbar from '../../components/Navbar';
import WeeklyCanvas from '../../components/WeeklyCanvas';
import { motion } from 'framer-motion';
import { HardDrive, ArrowRight } from 'lucide-react';

export default function DashboardPage() {
  const { 
    isAuthenticated, setShowLoginModal, addReceipt, loaded, tasks, 
    setTasks, isDarkMode, isPremium, hasDriveAccess, setShowDriveModal 
  } = useAppContext();
  const router = useRouter();

  useEffect(() => {
    if (loaded && !isAuthenticated) {
      router.push('/');
    }
  }, [loaded, isAuthenticated, router]);

  if (!loaded || !isAuthenticated) return null; 

  return (
    <div className="min-h-screen relative overflow-x-hidden flex flex-col items-center pt-24 md:pt-28">
      
      {/* COZY BACKGROUND */}
      <div 
        className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat transition-all duration-1000"
        style={{ backgroundImage: `url("/eggs.jpg")` }} 
      />
      <div className={`fixed inset-0 z-0 backdrop-blur-[5px] transition-colors duration-500 pointer-events-none text-transparent ${isDarkMode ? 'bg-black/60' : 'bg-[#2b2b2b]/10'}`} />

      {/* NAVBAR */}
      <Navbar />
      <WeeklyCanvas />



      {/* MAIN CONTAINER */}
      <main className="relative z-10 w-full max-w-[1200px] px-4 md:px-8 pb-32">
        <PhaseTasks 
          tasks={tasks} 
          setTasks={setTasks} 
          isAuthenticated={isAuthenticated}
          onRequireLogin={() => setShowLoginModal(true)} 
          onSaveReceipt={addReceipt}
        />
      </main>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Marcellus&family=Nunito:wght@400;500;600;700&display=swap');
        
        :root {
          --font-sans: 'Nunito', sans-serif;
          --font-serif: 'Marcellus', serif;
        }

        body {
          font-family: var(--font-sans);
          background-color: #2b2b2b;
        }

        .font-sans { font-family: var(--font-sans); }
        .font-serif { font-family: var(--font-serif); }
      `}</style>
    </div>
  );
}
