
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Save, Info, Sparkles } from 'lucide-react';
import { Exercise, ExerciseType, UserProfile } from '../types';
import { calculateCalories } from '../db';

interface LogWorkoutProps {
  onSave: (workout: Exercise) => void;
  profile: UserProfile;
  recentNames: string[];
}

const LogWorkout: React.FC<LogWorkoutProps> = ({ onSave, profile, recentNames }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    type: 'cardio' as ExerciseType,
    date: new Date().toISOString().split('T')[0],
    sets: 3,
    reps: 10,
    weight: 0,
    duration: 30,
    distance: 0,
    notes: '',
    manualCalories: 0,
    useManualCals: false
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const calories = formData.useManualCals 
      ? formData.manualCalories 
      : calculateCalories(formData.type, formData.duration, profile.weight, formData.weight);

    const workout: Exercise = {
      id: crypto.randomUUID(),
      name: formData.name || 'Custom Exercise',
      type: formData.type,
      date: formData.date,
      duration: Number(formData.duration),
      calories: Number(calories),
      notes: formData.notes,
      ...(formData.type === 'strength' ? { sets: Number(formData.sets), reps: Number(formData.reps), weight: Number(formData.weight) } : {}),
      ...(['cardio', 'sports'].includes(formData.type) ? { distance: Number(formData.distance) } : {})
    };

    onSave(workout);
    navigate('/');
  };

  const estimatedCals = calculateCalories(formData.type, formData.duration, profile.weight, formData.weight);

  return (
    <div className="flex flex-col h-full bg-gray-50 min-h-screen">
      <header className="sticky top-0 z-50 bg-white border-b border-gray-100 p-4 flex items-center justify-between">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <ChevronLeft size={24} />
        </button>
        <h2 className="text-lg font-bold">New Activity</h2>
        <div className="w-10" />
      </header>

      <form onSubmit={handleSubmit} className="p-5 space-y-6 pb-32">
        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-500 uppercase tracking-wider">Exercise Name</label>
          <input
            type="text"
            required
            list="recent-exercises"
            value={formData.name}
            onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
            placeholder="e.g. Bench Press"
            className="w-full p-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white text-lg shadow-sm"
          />
          <datalist id="recent-exercises">
            {recentNames.map(name => <option key={name} value={name} />)}
          </datalist>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-500 uppercase tracking-wider">Type</label>
          <div className="grid grid-cols-2 gap-2">
            {(['cardio', 'strength', 'flexibility', 'sports'] as ExerciseType[]).map(t => (
              <button
                key={t}
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, type: t }))}
                className={`p-3 rounded-xl border capitalize transition-all text-sm font-medium ${
                  formData.type === t ? 'bg-indigo-600 text-white border-indigo-600 shadow-md ring-2 ring-indigo-200' : 'bg-white text-gray-600 border-gray-200'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-500 uppercase tracking-wider">Date</label>
            <input
              type="date"
              value={formData.date}
              onChange={e => setFormData(prev => ({ ...prev, date: e.target.value }))}
              className="w-full p-3 rounded-xl border border-gray-200 bg-white"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-500 uppercase tracking-wider">Duration (min)</label>
            <input
              type="number"
              required
              min="1"
              value={formData.duration}
              onChange={e => setFormData(prev => ({ ...prev, duration: Number(e.target.value) }))}
              className="w-full p-3 rounded-xl border border-gray-200 bg-white"
            />
          </div>
        </div>

        {formData.type === 'strength' && (
          <div className="grid grid-cols-3 gap-3 animate-in slide-in-from-top-2 duration-300">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase">Sets</label>
              <input
                type="number"
                value={formData.sets}
                onChange={e => setFormData(prev => ({ ...prev, sets: Number(e.target.value) }))}
                className="w-full p-3 rounded-xl border border-gray-200 bg-white text-center"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase">Reps</label>
              <input
                type="number"
                value={formData.reps}
                onChange={e => setFormData(prev => ({ ...prev, reps: Number(e.target.value) }))}
                className="w-full p-3 rounded-xl border border-gray-200 bg-white text-center"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase">Weight (kg)</label>
              <input
                type="number"
                value={formData.weight}
                onChange={e => setFormData(prev => ({ ...prev, weight: Number(e.target.value) }))}
                className="w-full p-3 rounded-xl border border-gray-200 bg-white text-center font-bold text-indigo-600"
              />
            </div>
          </div>
        )}

        {(formData.type === 'cardio' || formData.type === 'sports') && (
          <div className="space-y-2 animate-in slide-in-from-top-2 duration-300">
            <label className="text-sm font-bold text-gray-500 uppercase tracking-wider">Distance (km)</label>
            <input
              type="number"
              step="0.1"
              value={formData.distance}
              onChange={e => setFormData(prev => ({ ...prev, distance: Number(e.target.value) }))}
              className="w-full p-3 rounded-xl border border-gray-200 bg-white"
            />
          </div>
        )}

        <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 text-white p-2 rounded-lg">
              <Sparkles size={18} />
            </div>
            <div>
              <p className="text-xs text-indigo-600 font-bold uppercase">Auto-Calc Calories</p>
              <p className="text-lg font-black text-indigo-900">{estimatedCals} kcal</p>
            </div>
          </div>
          <button 
            type="button" 
            onClick={() => setFormData(prev => ({ ...prev, useManualCals: !prev.useManualCals }))}
            className="text-[10px] text-indigo-700 font-bold bg-indigo-100 px-3 py-1 rounded-full uppercase hover:bg-indigo-200"
          >
            {formData.useManualCals ? 'Use Estimate' : 'Edit Manually'}
          </button>
        </div>

        {formData.useManualCals && (
          <div className="space-y-2 animate-in slide-in-from-top-2 duration-300">
            <label className="text-sm font-bold text-gray-500 uppercase tracking-wider">Manual Calories</label>
            <input
              type="number"
              value={formData.manualCalories}
              onChange={e => setFormData(prev => ({ ...prev, manualCalories: Number(e.target.value) }))}
              className="w-full p-3 rounded-xl border border-gray-200 bg-white font-bold"
            />
          </div>
        )}

        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-500 uppercase tracking-wider">Notes (Optional)</label>
          <textarea
            value={formData.notes}
            onChange={e => setFormData(prev => ({ ...prev, notes: e.target.value }))}
            placeholder="How was the session?"
            className="w-full p-4 rounded-xl border border-gray-200 bg-white min-h-[100px]"
          />
        </div>

        <div className="fixed bottom-24 left-4 right-4 max-w-md mx-auto z-50">
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold shadow-lg flex items-center justify-center gap-2 hover:bg-indigo-700 active:scale-[0.98] transition-all"
          >
            <Save size={20} />
            Complete Exercise
          </button>
        </div>
      </form>
    </div>
  );
};

export default LogWorkout;
