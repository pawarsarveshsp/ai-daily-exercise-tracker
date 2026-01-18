
import React, { useState, useEffect, useMemo } from 'react';
import { HashRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { 
  Home, 
  Calendar, 
  BarChart2, 
  User, 
  Plus, 
  ChevronLeft,
  Settings,
  Flame,
  Clock,
  Dumbbell,
  Target
} from 'lucide-react';
import { loadData, saveData } from './db';
import { AppState, Exercise, UserProfile } from './types';
import Dashboard from './components/Dashboard';
import LogWorkout from './components/LogWorkout';
import History from './components/History';
import Insights from './components/Insights';
import Profile from './components/Profile';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>(loadData());

  useEffect(() => {
    saveData(state);
  }, [state]);

  const addWorkout = (workout: Exercise) => {
    setState(prev => ({
      ...prev,
      workouts: [workout, ...prev.workouts],
      recentExercises: Array.from(new Set([workout.name, ...prev.recentExercises])).slice(0, 20)
    }));
  };

  const updateProfile = (profile: UserProfile) => {
    setState(prev => ({ ...prev, profile }));
  };

  const deleteWorkout = (id: string) => {
    setState(prev => ({
      ...prev,
      workouts: prev.workouts.filter(w => w.id !== id)
    }));
  };

  return (
    <HashRouter>
      <div className="flex flex-col min-h-screen max-w-md mx-auto bg-white shadow-xl relative">
        <main className="flex-1 overflow-y-auto pb-24 no-scrollbar">
          <Routes>
            <Route path="/" element={<Dashboard state={state} />} />
            <Route path="/history" element={<History workouts={state.workouts} onDelete={deleteWorkout} />} />
            <Route path="/insights" element={<Insights workouts={state.workouts} profile={state.profile} />} />
            <Route path="/profile" element={<Profile profile={state.profile} onUpdate={updateProfile} workouts={state.workouts} />} />
            <Route path="/log" element={<LogWorkout onSave={addWorkout} profile={state.profile} recentNames={state.recentExercises} />} />
          </Routes>
        </main>
        
        <BottomNav />
        <FloatingActionButton />
      </div>
    </HashRouter>
  );
};

const BottomNav: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/history', icon: Calendar, label: 'History' },
    { path: '/insights', icon: BarChart2, label: 'Insights' },
    { path: '/profile', icon: User, label: 'Profile' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white border-t border-gray-200 flex justify-around py-3 px-2 z-50">
      {navItems.map(({ path, icon: Icon, label }) => {
        const isActive = location.pathname === path;
        return (
          <button
            key={path}
            onClick={() => navigate(path)}
            className={`flex flex-col items-center gap-1 transition-colors ${isActive ? 'text-indigo-600 font-bold' : 'text-gray-400'}`}
          >
            <Icon size={22} />
            <span className="text-[10px] uppercase tracking-wider">{label}</span>
          </button>
        );
      })}
    </nav>
  );
};

const FloatingActionButton: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  if (location.pathname === '/log') return null;

  return (
    <button
      onClick={() => navigate('/log')}
      className="fixed bottom-20 right-4 bg-indigo-600 text-white p-4 rounded-full shadow-lg active:scale-95 transition-transform z-50 hover:bg-indigo-700"
    >
      <Plus size={28} />
    </button>
  );
};

export default App;
