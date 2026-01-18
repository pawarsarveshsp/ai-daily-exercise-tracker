
import React, { useMemo } from 'react';
import { Flame, Clock, Dumbbell, Trophy } from 'lucide-react';
import { AppState } from '../types';

interface DashboardProps {
  state: AppState;
}

const Dashboard: React.FC<DashboardProps> = ({ state }) => {
  const today = new Date().toISOString().split('T')[0];
  
  const todayWorkouts = useMemo(() => {
    return state.workouts.filter(w => w.date.startsWith(today));
  }, [state.workouts, today]);

  const stats = useMemo(() => {
    const totalTime = todayWorkouts.reduce((acc, w) => acc + w.duration, 0);
    const totalCals = todayWorkouts.reduce((acc, w) => acc + w.calories, 0);
    const completed = todayWorkouts.length;
    
    return { totalTime, totalCals, completed };
  }, [todayWorkouts]);

  const timeProgress = Math.min((stats.totalTime / state.profile.dailyGoalMinutes) * 100, 100);
  const calProgress = Math.min((stats.totalCals / state.profile.dailyGoalCalories) * 100, 100);

  return (
    <div className="p-6 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="space-y-1">
        <h1 className="text-2xl font-bold text-gray-900">Hello, {state.profile.name}!</h1>
        <p className="text-gray-500">Track your progress and stay healthy.</p>
      </header>

      {/* Daily Progress Cards */}
      <div className="grid grid-cols-2 gap-4">
        <StatCard 
          icon={<Clock className="text-blue-500" size={20} />}
          label="Active Time"
          value={`${stats.totalTime}m`}
          subtext={`Goal: ${state.profile.dailyGoalMinutes}m`}
          progress={timeProgress}
          color="bg-blue-500"
        />
        <StatCard 
          icon={<Flame className="text-orange-500" size={20} />}
          label="Calories"
          value={stats.totalCals}
          subtext={`Goal: ${state.profile.dailyGoalCalories}`}
          progress={calProgress}
          color="bg-orange-500"
        />
      </div>

      {/* Main summary ring or indicator */}
      <div className="bg-indigo-600 rounded-3xl p-6 text-white shadow-xl flex items-center justify-between overflow-hidden relative">
        <div className="z-10">
          <p className="text-indigo-100 text-sm font-medium">Daily Completion</p>
          <h2 className="text-4xl font-black mt-1">
            {Math.round((timeProgress + calProgress) / 2)}%
          </h2>
          <p className="text-indigo-100 text-xs mt-2 italic">Keep it up! Consistency is key.</p>
        </div>
        <div className="bg-indigo-500/30 p-4 rounded-full z-10">
          <Trophy size={48} className="text-yellow-300 opacity-90" />
        </div>
        <div className="absolute top-[-20%] right-[-10%] w-40 h-40 bg-indigo-500/20 rounded-full blur-2xl"></div>
      </div>

      {/* Today's Log */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-lg text-gray-800">Today's Exercises</h3>
          <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full font-bold">
            {stats.completed} Total
          </span>
        </div>
        
        {todayWorkouts.length === 0 ? (
          <div className="border-2 border-dashed border-gray-200 rounded-2xl p-10 flex flex-col items-center justify-center text-gray-400">
            <Dumbbell size={40} className="mb-2 opacity-20" />
            <p className="text-sm">No exercises logged yet.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {todayWorkouts.map((workout) => (
              <div key={workout.id} className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm flex items-center gap-4 transition-all hover:border-indigo-200">
                <div className={`p-3 rounded-lg ${getTypeColor(workout.type)}`}>
                  <Dumbbell size={20} className="text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-gray-900">{workout.name}</h4>
                  <div className="flex gap-3 text-xs text-gray-500 mt-1">
                    <span>{workout.duration} min</span>
                    {workout.type === 'strength' && <span>{workout.sets}x{workout.reps}</span>}
                    <span>{workout.calories} kcal</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

const getTypeColor = (type: string) => {
  switch (type) {
    case 'cardio': return 'bg-rose-500';
    case 'strength': return 'bg-blue-600';
    case 'flexibility': return 'bg-emerald-500';
    case 'sports': return 'bg-amber-500';
    default: return 'bg-indigo-500';
  }
};

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  subtext: string;
  progress: number;
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({ icon, label, value, subtext, progress, color }) => (
  <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col gap-3">
    <div className="flex items-center gap-2">
      {icon}
      <span className="text-xs font-bold text-gray-400 uppercase tracking-tight">{label}</span>
    </div>
    <div>
      <div className="text-xl font-black text-gray-800">{value}</div>
      <div className="text-[10px] text-gray-400 font-medium">{subtext}</div>
    </div>
    <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
      <div 
        className={`h-full ${color} transition-all duration-1000`} 
        style={{ width: `${progress}%` }}
      />
    </div>
  </div>
);

export default Dashboard;
