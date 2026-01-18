
import React, { useMemo } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { TrendingUp, Award, Zap, Calendar } from 'lucide-react';
import { Exercise, UserProfile } from '../types';

interface InsightsProps {
  workouts: Exercise[];
  profile: UserProfile;
}

const COLORS = ['#4f46e5', '#f43f5e', '#10b981', '#f59e0b'];

const Insights: React.FC<InsightsProps> = ({ workouts, profile }) => {
  // Weekly calories data
  const last7DaysData = useMemo(() => {
    const data = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const calories = workouts
        .filter(w => w.date.startsWith(dateStr))
        .reduce((sum, w) => sum + w.calories, 0);
      
      data.push({
        name: d.toLocaleDateString('en-US', { weekday: 'short' }),
        calories
      });
    }
    return data;
  }, [workouts]);

  // Exercise type breakdown
  const typeBreakdown = useMemo(() => {
    const counts: Record<string, number> = { cardio: 0, strength: 0, flexibility: 0, sports: 0 };
    workouts.forEach(w => counts[w.type]++);
    return Object.entries(counts).map(([name, value]) => ({ name, value })).filter(i => i.value > 0);
  }, [workouts]);

  const totalCalsAllTime = useMemo(() => workouts.reduce((s, w) => s + w.calories, 0), [workouts]);
  const streak = useMemo(() => {
    if (workouts.length === 0) return 0;
    // Fix: Ensure 'dates' is typed as a string array so loop variable 'd' is not 'unknown'
    const dates: string[] = Array.from(new Set(workouts.map(w => w.date.split('T')[0]))).sort().reverse();
    let current = 0;
    let checkDate = new Date();
    
    // Simplistic streak logic
    for (const d of dates) {
      const date = new Date(d);
      const diff = Math.floor((checkDate.getTime() - date.getTime()) / (1000 * 3600 * 24));
      if (diff <= 1) {
        current++;
        checkDate = date;
      } else {
        break;
      }
    }
    return current;
  }, [workouts]);

  return (
    <div className="p-6 pb-24 space-y-8">
      <header>
        <h1 className="text-2xl font-bold text-gray-900">Health Insights</h1>
        <p className="text-gray-500">Visualize your achievements.</p>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
          <div className="bg-indigo-50 w-8 h-8 rounded-lg flex items-center justify-center mb-2">
            <Zap size={16} className="text-indigo-600" />
          </div>
          <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Current Streak</p>
          <p className="text-xl font-black text-gray-900">{streak} Days</p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
          <div className="bg-rose-50 w-8 h-8 rounded-lg flex items-center justify-center mb-2">
            <Award size={16} className="text-rose-600" />
          </div>
          <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Total Burned</p>
          <p className="text-xl font-black text-gray-900">{totalCalsAllTime} kcal</p>
        </div>
      </div>

      {/* Calories Chart */}
      <section className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-4">
        <div className="flex items-center gap-2">
          <TrendingUp size={20} className="text-indigo-600" />
          <h3 className="font-bold text-gray-800">Weekly Activity</h3>
        </div>
        <div className="h-48 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={last7DaysData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} hide />
              <Tooltip 
                cursor={{ fill: '#f8fafc' }}
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Bar dataKey="calories" fill="#4f46e5" radius={[4, 4, 0, 0]} barSize={24} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* Type Distribution */}
      <section className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-4">
        <div className="flex items-center gap-2">
          <Calendar size={20} className="text-rose-600" />
          <h3 className="font-bold text-gray-800">Exercise Mix</h3>
        </div>
        <div className="flex items-center">
          <div className="h-40 w-1/2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={typeBreakdown}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={60}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {typeBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="w-1/2 space-y-2">
            {typeBreakdown.map((item, index) => (
              <div key={item.name} className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                <span className="text-xs font-bold text-gray-600 capitalize">{item.name}</span>
                <span className="text-[10px] text-gray-400 ml-auto">{item.value}x</span>
              </div>
            ))}
            {typeBreakdown.length === 0 && <p className="text-xs text-gray-400 italic">No data yet</p>}
          </div>
        </div>
      </section>

      {/* Motivational Quote or AI Insight Placeholder */}
      <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-2xl p-6 text-white text-center">
        <p className="text-indigo-100 text-sm mb-2 italic">“The only bad workout is the one that didn't happen.”</p>
        <p className="font-bold text-indigo-200">— FlexTrack Community</p>
      </div>
    </div>
  );
};

export default Insights;
