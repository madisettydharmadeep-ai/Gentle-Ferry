'use client';
import { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

export function AppProvider({ children }) {
  const isHabitScheduledForDay = (task, date) => {
    if (!task.habitSchedule) return true;
    if (task.habitSchedule.type === 'daily') return true;
    
    // JS getDay() returns 0 for Sunday, 6 for Saturday
    const dow = date.getDay();
    
    if (task.habitSchedule.type === 'weekdays') return dow >= 1 && dow <= 5;
    if (task.habitSchedule.type === 'weekends') return dow === 0 || dow === 6;
    if (task.habitSchedule.type === 'custom') {
      return Array.isArray(task.habitSchedule.days) && task.habitSchedule.days.includes(dow);
    }
    return true;
  };

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [receipts, setReceipts] = useState([]);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showDriveModal, setShowDriveModal] = useState(false);
  const [showProModal, setShowProModal] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const getYYYYMMDD = (d) => `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d.getDate().toString().padStart(2, '0')}`;

  const [today, setTodayState] = useState(new Date());
  const [tasks, setTasks] = useState([]);
  const [ignoredHabits, setIgnoredHabits] = useState([]);
  const [isPremium, setIsPremium] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isProductive, setIsProductive] = useState(true);
  const [userName, setUserName] = useState('');
  const [userPic, setUserPic] = useState('');
  const [userId, setUserId] = useState(null);
  const [cloudDataFetched, setCloudDataFetched] = useState(false);
  const [hasDriveAccess, setHasDriveAccess] = useState(false);
  const [lastFetchedAt, setLastFetchedAt] = useState(0);
  const [masterHabits, setMasterHabits] = useState([]);

  const fetchVoyages = async (month, year) => {
    if (!isAuthenticated || !userId) return;
    try {
      let url = `/api/voyages?userId=${userId}`;
      if (month && year) url += `&month=${month}&year=${year}`;
      else if (year) url += `&year=${year}`;

      const res = await fetch(url);
      const data = await res.json();
      if (data.success && data.data.length > 0) {
        setReceipts(prev => {
          const localIds = new Set(prev.map(r => r.id));
          const newFromCloud = data.data.filter(r => !localIds.has(r.id));
          const merged = [...newFromCloud, ...prev];
          localStorage.setItem('gentle_ferry_receipts', JSON.stringify(merged));
          return merged;
        });
      }
    } catch (err) {
      console.error("Fetch voyages failed", err);
    }
  };

  useEffect(() => {
    const isPrem = localStorage.getItem('gentle_ferry_premium') === 'true';
    const isDark = localStorage.getItem('gentle_ferry_dark_mode') === 'true';
    const savedProd = localStorage.getItem('gentle_ferry_productive');
    const savedName = localStorage.getItem('gentle_ferry_user_name') || '';
    const savedPic = localStorage.getItem('gentle_ferry_user_pic') || '';
    const savedUserId = localStorage.getItem('gentle_ferry_user_id') || null;
    setIsPremium(isPrem);
    setIsDarkMode(isDark);
    if (savedProd !== null) setIsProductive(savedProd === 'true');
    setUserName(savedName);
    setUserPic(savedPic);
    setUserId(savedUserId);
  }, []);

  const togglePremium = async () => {
    const nextValue = !isPremium;
    setIsPremium(nextValue);
    localStorage.setItem('gentle_ferry_premium', nextValue.toString());
    
    // Immediate sync to DB to prevent race conditions
    if (isAuthenticated && userId) {
      try {
        await fetch('/api/auth/user', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId, settings: { isPremium: nextValue, isDarkMode, isProductive } })
        });
      } catch (e) {
        console.error("Immediate premium sync failed", e);
      }
    }
  };

  const toggleDarkMode = () => {
    setIsDarkMode(prev => {
       const next = !prev;
       localStorage.setItem('gentle_ferry_dark_mode', next.toString());
       return next;
    });
  };

  const toggleProductive = () => {
    setIsProductive(prev => {
       const next = !prev;
       localStorage.setItem('gentle_ferry_productive', next.toString());
       return next;
    });
  };

  useEffect(() => {
    const auth = localStorage.getItem('gentle_ferry_auth');
    const logs = localStorage.getItem('gentle_ferry_receipts');
    const savedToday = localStorage.getItem('gentle_ferry_today');
    const savedTasks = localStorage.getItem('gentle_ferry_tasks');
    const savedIgnored = localStorage.getItem('gentle_ferry_ignored_habits');
    
    if (auth === 'true') setIsAuthenticated(true);
    if (logs) {
       try {
          setReceipts(JSON.parse(logs));
       } catch (e) {}
    }
    if (savedIgnored) {
       try {
          setIgnoredHabits(JSON.parse(savedIgnored));
       } catch (e) {}
    }

    const currentActualDate = new Date();
    let initialDate = currentActualDate;

    if (savedToday) {
      initialDate = new Date(savedToday);
      setTodayState(initialDate);
    } else {
      localStorage.setItem('gentle_ferry_today', currentActualDate.toISOString());
    }

    if (savedTasks) {
       try {
          let parsedTasks = JSON.parse(savedTasks).filter(t => typeof t.text === 'string');
          
          if (initialDate.toDateString() !== currentActualDate.toDateString()) {
             const ignoredList = savedIgnored ? JSON.parse(savedIgnored) : [];
             parsedTasks = parsedTasks
               .filter(t => (t.isHabit && !ignoredList.includes(t.text)) || !t.checked)
               .map(t => ({ ...t, checked: false, updatedAt: new Date() }));
             
             localStorage.setItem('gentle_ferry_tasks', JSON.stringify(parsedTasks));
             localStorage.setItem('gentle_ferry_today', currentActualDate.toISOString());
             setTodayState(currentActualDate);
          }
          
          setTasks(parsedTasks);
       } catch (e) {}
    }
    setLoaded(true);
  }, []);

  // Fetch from cloud on login or date change
  useEffect(() => {
    if (isAuthenticated && userId && loaded) {
      setCloudDataFetched(false); // Reset while fetching
      
      // 0. Fetch Master Habits
      fetch(`/api/habits?userId=${userId}`)
        .then(res => res.json())
        .then(res => {
          if (res.success) {
            setMasterHabits(res.data);
          }
        });

      // 1. Initial Voyages Fetch (Optimized for current month)
      const currentMonth = today.toLocaleDateString('en-US', { month: 'long' });
      const currentYear = today.getFullYear();
      fetchVoyages(currentMonth, currentYear);

      // 2. Fetch Tasks for the current date
      const dateStr = getYYYYMMDD(today);
      fetch(`/api/tasks?userId=${userId}&date=${dateStr}`)
        .then(res => res.json())
        .then(res => {
          if (res.success && res.data && res.data.length > 0) {
            // Filter out ignored habits from the cloud response
            const filteredTasks = res.data.filter(t => !t.isHabit || !ignoredHabits.includes(t.text));
            setTasks(filteredTasks);
            localStorage.setItem('gentle_ferry_tasks', JSON.stringify(filteredTasks));
          }
          setLastFetchedAt(Date.now());
          setCloudDataFetched(true); 
        })
        .catch(err => {
          console.error("Cloud tasks fetch failed", err);
          setCloudDataFetched(true); 
        });
    } else if (!isAuthenticated) {
      setCloudDataFetched(false);
    }
  }, [isAuthenticated, userId, loaded, today]);

  // Sync tasks to localStorage AND cloud whenever they change
  useEffect(() => {
    if (loaded) {
      localStorage.setItem('gentle_ferry_tasks', JSON.stringify(tasks));

      if (isAuthenticated && userId && cloudDataFetched) {
        const dateStr = getYYYYMMDD(today);
        fetch('/api/tasks', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId, date: dateStr, tasks, lastSync: lastFetchedAt })
        })
        .then(res => res.json())
        .then(res => {
          if (res.success && res.data) {
            // Filter out ignored habits from the sync response
            const filteredTasks = res.data.filter(t => !t.isHabit || !ignoredHabits.includes(t.text));
            const cloudTasksStr = JSON.stringify(filteredTasks);
            const localTasksStr = JSON.stringify(tasks);
            if (cloudTasksStr !== localTasksStr) {
               setTasks(filteredTasks);
            }
          }
        })
        .catch(err => console.error("Cloud task sync failed", err));
      }
    }
  }, [tasks, loaded, isAuthenticated, userId, today, cloudDataFetched]);

  const setToday = (input) => {
    let newDate;
    if (typeof input === 'string') {
      const [y, m, d] = input.split('-').map(Number);
      newDate = new Date(y, m - 1, d);
    } else {
      newDate = new Date(input);
    }
    
    const oldDate = new Date(today);
    setTodayState(newDate);
    localStorage.setItem('gentle_ferry_today', newDate.toISOString());

    if (newDate.toDateString() !== oldDate.toDateString()) {
      setTasks(prev => {
        const carries = prev
          .filter(t => (t.isHabit && !ignoredHabits.includes(t.text)) || !t.checked)
          .map(t => ({ ...t, checked: false, updatedAt: new Date() }));
        
        // Inject master habits that might be missing locally
        const injected = [...carries];
        masterHabits.forEach(h => {
          if (isHabitScheduledForDay(h, newDate) && !injected.some(t => t.text === h.text)) {
            injected.push({
              id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
              text: h.text,
              checked: false,
              iconName: h.iconName,
              isHabit: true,
              habitSchedule: h.habitSchedule,
              updatedAt: new Date()
            });
          }
        });
        return injected;
      });
    }
  };

  // Sync settings and ignored habits to cloud
  useEffect(() => {
    if (isAuthenticated && userId && loaded) {
      fetch(`/api/auth/user?userId=${userId}`)
        .then(res => res.json())
        .then(res => {
          if (res.success) {
            if (res.settings) {
              setIsPremium(res.settings.isPremium);
              setIsDarkMode(res.settings.isDarkMode);
              if (res.settings.isProductive !== undefined) {
                 setIsProductive(res.settings.isProductive);
                 localStorage.setItem('gentle_ferry_productive', res.settings.isProductive.toString());
              }
              localStorage.setItem('gentle_ferry_premium', res.settings.isPremium.toString());
              localStorage.setItem('gentle_ferry_dark_mode', res.settings.isDarkMode.toString());
            }
            if (res.ignoredHabits) {
              setIgnoredHabits(res.ignoredHabits);
              localStorage.setItem('gentle_ferry_ignored_habits', JSON.stringify(res.ignoredHabits));
            }
            if (res.hasDriveAccess !== undefined) {
              setHasDriveAccess(res.hasDriveAccess);
            }
          }
        })
        .catch(err => console.error("Cloud user settings fetch failed", err));
    }
  }, [isAuthenticated, userId, loaded]);

  useEffect(() => {
    if (isAuthenticated && userId && loaded) {
      fetch('/api/auth/user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          userId, 
          settings: { isPremium, isDarkMode, isProductive },
          ignoredHabits 
        })
      }).catch(err => console.error("Cloud user settings sync failed", err));
    }
  }, [isPremium, isDarkMode, isProductive, ignoredHabits, isAuthenticated, userId, loaded]);

  const login = async (code) => {
    try {
      const res = await fetch('/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code })
      });
      const data = await res.json();
      
      if (data.success) {
        setIsAuthenticated(true);
        setShowLoginModal(false);
        setUserName(data.user.name);
        setUserPic(data.user.image);
        setUserId(data.user.id);
        
        localStorage.setItem('gentle_ferry_auth', 'true');
        localStorage.setItem('gentle_ferry_user_name', data.user.name);
        localStorage.setItem('gentle_ferry_user_pic', data.user.image);
        localStorage.setItem('gentle_ferry_user_id', data.user.id);
      }
    } catch (err) {
      console.error("Login verification failed", err);
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUserName('');
    setUserPic('');
    setUserId(null);
    localStorage.setItem('gentle_ferry_auth', 'false');
    localStorage.removeItem('gentle_ferry_user_name');
    localStorage.removeItem('gentle_ferry_user_pic');
    localStorage.removeItem('gentle_ferry_user_id');
    // Optional: Clear local state on logout to prevent "leftover" data from showing for next user
    setReceipts([]);
    setTasks([]);
    setIgnoredHabits([]);
  };

  const addReceipt = async (receipt) => {
     setReceipts(prev => {
        const newReceipts = [receipt, ...prev];
        localStorage.setItem('gentle_ferry_receipts', JSON.stringify(newReceipts));
        return newReceipts;
     });

     // Sync to cloud if logged in
     if (isAuthenticated && userId) {
       try {
         await fetch('/api/voyages', {
           method: 'POST',
           headers: { 'Content-Type': 'application/json' },
           body: JSON.stringify({ userId, voyage: receipt })
         });
       } catch (e) {
         console.error("Cloud sync failed for voyage", e);
       }
     }
  };

  const clearReceipts = () => {
    setReceipts([]);
    localStorage.removeItem('gentle_ferry_receipts');
  };

  return (
    <AppContext.Provider value={{ 
      isAuthenticated, login, logout, 
      userName, userPic, userId,
      receipts, addReceipt, clearReceipts, fetchVoyages,
      showLoginModal, setShowLoginModal,
      showProModal, setShowProModal,
      loaded,
      today, setToday,
      tasks, setTasks,
      ignoredHabits, 
      isPremium, togglePremium,
      isDarkMode, toggleDarkMode,
      isProductive, toggleProductive, setIsProductive,
      isHabitScheduledForDay,
      masterHabits,
      syncHabit: async (habit) => {
        setMasterHabits(prev => {
           const existingIdx = prev.findIndex(h => h.text === habit.text);
           if (existingIdx >= 0) {
              const next = [...prev];
              next[existingIdx] = habit;
              return next;
           }
           return [...prev, habit];
        });
        if (isAuthenticated && userId) {
           await fetch('/api/habits', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ userId, habit })
           });
        }
      },
      ignoreHabit: async (name) => {
        setIgnoredHabits(prev => {
          const next = [...new Set([...prev, name])];
          localStorage.setItem('gentle_ferry_ignored_habits', JSON.stringify(next));
          return next;
        });
        setTasks(prev => prev.filter(t => !t.isHabit || t.text !== name));
        setMasterHabits(prev => prev.filter(h => h.text !== name));
        
        if (isAuthenticated && userId) {
          await fetch('/api/habits', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId, text: name })
          });
        }
      },
      unignoreHabit: (name) => setIgnoredHabits(prev => {
        const next = prev.filter(h => h !== name);
        localStorage.setItem('gentle_ferry_ignored_habits', JSON.stringify(next));
        return next;
      }),
      hasDriveAccess, 
      setHasDriveAccess,
      showDriveModal,
      setShowDriveModal,
      requestDrivePermission: async (code) => {
        try {
          const res = await fetch('/api/auth/google', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ code })
          });
          const data = await res.json();
          if (data.success) {
            if (data.hasRefreshToken) {
              setHasDriveAccess(true);
              setIsPremium(true);
              localStorage.setItem('gentle_ferry_premium', 'true');
              setShowDriveModal(false);
            } else {
              alert("Google did not grant storage permission. Please ensure you check the Drive access box on the consent screen.");
              setHasDriveAccess(false);
            }
          }
        } catch (e) {
          console.error('Drive permission sync failed', e);
        }
      }
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  return useContext(AppContext);
}
