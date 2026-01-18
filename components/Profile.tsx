
import React, { useState } from 'react';
import { User, Weight, Ruler, Target, Download, LogOut, ChevronRight } from 'lucide-react';
import { UserProfile, Exercise } from '../types';

interface ProfileProps {
  profile: UserProfile;
  onUpdate: (profile: UserProfile) => void;
  workouts: Exercise[];
}

const Profile: React.FC<ProfileProps> = ({ profile, onUpdate, workouts }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(profile);

  const handleSave = () => {
    onUpdate(formData);
    setIsEditing(false);
  };

  const exportCSV = () => {
    if (workouts.length === 0) return alert('No data to export');
    
    const headers = ['Date', 'Name', 'Type', 'Duration(min)', 'Calories', 'Sets', 'Reps', 'Weight(kg)', 'Distance(km)', 'Notes'];
    const rows = workouts.map(w => [
      w.date,
      `"${w.name.replace(/"/g, '""')}"`,
      w.type,
      w.duration,
      w.calories,
      w.sets || 0,
      w.reps || 0,
      w.weight || 0,
      w.distance || 0,
      `"${(w.notes || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `flextrack_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-6 pb-24 space-y-8 animate-in fade-in duration-500">
      <header className="flex flex-col items-center gap-4 text-center">
        <div className="w-24 h-24 bg-indigo-100 rounded-full flex items-center justify-center border-4 border-white shadow-lg">
          <User size={48} className="text-indigo-600" />
        </div>
        <div>
          <h1 className="text-2xl font-black text-gray-900">{profile.name}</h1>
          <p className="text-sm text-gray-500 font-medium">FlexTrack Member</p>
        </div>
      </header>

      {isEditing ? (
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-4">
          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Display Name</label>
              <input 
                type="text" 
                value={formData.name} 
                onChange={e => setFormData({...formData, name: e.target.value})}
                className="w-full p-3 rounded-xl border border-gray-200 bg-gray-50 font-bold"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Weight (kg)</label>
                <input 
                  type="number" 
                  value={formData.weight} 
                  onChange={e => setFormData({...formData, weight: Number(e.target.value)})}
                  className="w-full p-3 rounded-xl border border-gray-200 bg-gray-50"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Height (cm)</label>
                <input 
                  type="number" 
                  value={formData.height} 
                  onChange={e => setFormData({...formData, height: Number(e.target.value)})}
                  className="w-full p-3 rounded-xl border border-gray-200 bg-gray-50"
                />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Daily Minutes Goal</label>
              <input 
                type="number" 
                value={formData.dailyGoalMinutes} 
                onChange={e => setFormData({...formData, dailyGoalMinutes: Number(e.target.value)})}
                className="w-full p-3 rounded-xl border border-gray-200 bg-gray-50 font-bold text-indigo-600"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Daily Calories Goal</label>
              <input 
                type="number" 
                value={formData.dailyGoalCalories} 
                onChange={e => setFormData({...formData, dailyGoalCalories: Number(e.target.value)})}
                className="w-full p-3 rounded-xl border border-gray-200 bg-gray-50 font-bold text-rose-600"
              />
            </div>
          </div>
          <div className="flex gap-2 pt-4">
            <button onClick={() => setIsEditing(false)} className="flex-1 py-3 text-gray-500 font-bold hover:bg-gray-50 rounded-xl transition-colors">Cancel</button>
            <button onClick={handleSave} className="flex-1 py-3 bg-indigo-600 text-white font-bold rounded-xl shadow-lg hover:bg-indigo-700 transition-colors">Save Changes</button>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <section className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-5 flex items-center justify-between border-b border-gray-50">
              <h3 className="font-black text-gray-800 uppercase tracking-tight text-sm">Vital Stats</h3>
              <button onClick={() => setIsEditing(true)} className="text-xs font-bold text-indigo-600">Edit</button>
            </div>
            <div className="grid grid-cols-2 divide-x divide-gray-50">
              <div className="p-5 flex items-center gap-3">
                <div className="p-2 bg-amber-50 text-amber-600 rounded-lg"><Weight size={18} /></div>
                <div>
                  <p className="text-[10px] text-gray-400 font-black uppercase">Weight</p>
                  <p className="font-bold text-gray-800">{profile.weight} kg</p>
                </div>
              </div>
              <div className="p-5 flex items-center gap-3">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><Ruler size={18} /></div>
                <div>
                  <p className="text-[10px] text-gray-400 font-black uppercase">Height</p>
                  <p className="font-bold text-gray-800">{profile.height} cm</p>
                </div>
              </div>
            </div>
          </section>

          <section className="bg-white rounded-3xl border border-gray-100 shadow-sm">
            <div className="p-5 border-b border-gray-50">
              <h3 className="font-black text-gray-800 uppercase tracking-tight text-sm">Daily Goals</h3>
            </div>
            <div className="p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg"><Target size={18} /></div>
                  <span className="font-bold text-gray-700">Exercise Duration</span>
                </div>
                <span className="font-black text-indigo-600">{profile.dailyGoalMinutes} min</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-rose-50 text-rose-600 rounded-lg"><Target size={18} /></div>
                  <span className="font-bold text-gray-700">Calorie Burn</span>
                </div>
                <span className="font-black text-rose-600">{profile.dailyGoalCalories} kcal</span>
              </div>
            </div>
          </section>

          <section className="space-y-3">
            <button 
              onClick={exportCSV}
              className="w-full p-4 bg-white border border-gray-100 rounded-2xl flex items-center justify-between hover:bg-gray-50 transition-colors shadow-sm"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg"><Download size={18} /></div>
                <span className="font-bold text-gray-700">Export Data (CSV)</span>
              </div>
              <ChevronRight size={18} className="text-gray-300" />
            </button>
            <button className="w-full p-4 bg-white border border-gray-100 rounded-2xl flex items-center justify-between hover:bg-gray-50 transition-colors shadow-sm opacity-50 grayscale">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-50 text-gray-600 rounded-lg"><LogOut size={18} /></div>
                <span className="font-bold text-gray-700">Delete Account & Data</span>
              </div>
              <ChevronRight size={18} className="text-gray-300" />
            </button>
          </section>
        </div>
      )}

      <footer className="text-center pb-8">
        <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.2em]">FlexTrack v1.0.0 • Offline First</p>
      </footer>
    </div>
  );
};

export default Profile;
