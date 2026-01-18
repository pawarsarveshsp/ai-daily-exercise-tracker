
import React, { useMemo } from 'react';
import { Trash2, Dumbbell, ChevronRight, Filter } from 'lucide-react';
import { Exercise } from '../types';

interface HistoryProps {
  workouts: Exercise[];
  onDelete: (id: string) => void;
}

const History: React.FC<HistoryProps> = ({ workouts, onDelete }) => {
  const sortedWorkouts = useMemo(() => {
    return [...workouts].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [workouts]);

  const groupedWorkouts = useMemo(() => {
    const groups: Record<string, Exercise[]> = {};
    sortedWorkouts.forEach(w => {
      const date = new Date(w.date).toLocaleDateString('en-US', { 
        month: 'long', day: 'numeric', year: 'numeric' 
      });
      if (!groups[date]) groups[date] = [];
      groups[date].push(w);
    });
    return groups;
  }, [sortedWorkouts]);

  return (
    <div className="p-6 pb-24 space-y-6">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Workout Log</h1>
        <button className="p-2 text-gray-400 hover:text-indigo-600">
          <Filter size={20} />
        </button>
      </header>

      {workouts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-400">
          <div className="bg-gray-100 p-6 rounded-full mb-4">
            <Dumbbell size={48} className="opacity-20" />
          </div>
          <p className="text-center font-medium">Your history is empty.<br/>Time to start moving!</p>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Fix: Explicitly cast Object.entries results to handle cases where TS defaults to 'unknown' for object values */}
          {(Object.entries(groupedWorkouts) as [string, Exercise[]][]).map(([date, entries]) => (
            <div key={date} className="space-y-4">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100 pb-2">{date}</h3>
              <div className="space-y-3">
                {entries.map((workout) => (
                  <div key={workout.id} className="group relative bg-white border border-gray-100 rounded-2xl p-4 shadow-sm flex items-center gap-4 transition-all hover:border-indigo-200">
                    <div className={`p-3 rounded-xl flex-shrink-0 ${getTypeColor(workout.type)} text-white`}>
                      <Dumbbell size={20} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <h4 className="font-bold text-gray-900 truncate pr-2">{workout.name}</h4>
                        <span className="text-[10px] font-black uppercase text-indigo-500 tracking-wider">+{workout.calories} CAL</span>
                      </div>
                      <div className="flex gap-4 text-xs text-gray-500 mt-1">
                        <span className="flex items-center gap-1">
                          {workout.duration} min
                        </span>
                        {workout.type === 'strength' && (
                          <span className="flex items-center gap-1 font-medium text-gray-600">
                            {workout.sets}x{workout.reps} • {workout.weight}kg
                          </span>
                        )}
                        {workout.distance !== undefined && workout.distance > 0 && (
                          <span className="flex items-center gap-1">
                            {workout.distance} km
                          </span>
                        )}
                      </div>
                    </div>
                    <button 
                      onClick={() => onDelete(workout.id)}
                      className="p-2 text-gray-300 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const getTypeColor = (type: string) => {
  switch (type) {
    case 'cardio': return 'bg-rose-500';
    case 'strength': return 'bg-indigo-600';
    case 'flexibility': return 'bg-emerald-500';
    case 'sports': return 'bg-amber-500';
    default: return 'bg-gray-500';
  }
};

export default History;
