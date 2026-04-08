import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { ArrowLeft, Save, Plus, Trash2, Pill, Clock } from 'lucide-react';

const AddMedicine = () => {
  const [name, setName] = useState('');
  const [dosage, setDosage] = useState('');
  const [frequency, setFrequency] = useState('Daily');
  const [times, setTimes] = useState(['09:00']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleAddTime = () => {
    setTimes([...times, '12:00']);
  };

  const handleRemoveTime = (index) => {
    const newTimes = times.filter((_, i) => i !== index);
    if(newTimes.length === 0) return;
    setTimes(newTimes);
  };

  const handleTimeChange = (index, value) => {
    const newTimes = [...times];
    newTimes[index] = value;
    setTimes(newTimes);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      await api.post('/medicines', { name, dosage, frequency, times });
      navigate('/medicines');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add medicine');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-8">
      <div className="bg-white dark:bg-slate-800 p-8 md:p-12 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700 transition-colors">
        <div className="flex items-center gap-4 mb-8">
          <button 
            onClick={() => navigate(-1)}
            className="p-2.5 bg-slate-50 hover:bg-slate-100 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-600 dark:text-slate-300 rounded-full transition-colors"
          >
            <ArrowLeft size={24} />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-slate-800 dark:text-white">Add Medication</h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Set up a new reminder schedule</p>
          </div>
        </div>

        {error && <div className="bg-rose-50 text-rose-600 px-4 py-3 rounded-xl mb-8 font-medium border border-rose-100">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Medication Name</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                <Pill size={20} />
              </div>
              <input 
                type="text" 
                required
                className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all dark:text-white"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Paracetamol, Vitamin C..."
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Dosage</label>
              <input 
                type="text" 
                required
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all dark:text-white"
                value={dosage}
                onChange={(e) => setDosage(e.target.value)}
                placeholder="e.g. 1 Tablet"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Frequency</label>
              <select 
                value={frequency}
                onChange={(e) => setFrequency(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all dark:text-white"
              >
                <option value="Daily">Daily</option>
                <option value="Weekly">Weekly</option>
                <option value="As Needed">As Needed</option>
              </select>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-700">
            <div className="flex items-center justify-between mb-4">
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Reminder Times</label>
            </div>
            
            <div className="space-y-4">
              {times.map((time, idx) => (
                <div key={idx} className="flex gap-4 items-center">
                  <div className="relative flex-grow">
                     <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                       <Clock size={20} />
                     </div>
                    <input 
                      type="time" 
                      required
                      value={time}
                      onChange={(e) => handleTimeChange(idx, e.target.value)}
                      className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all dark:text-white font-medium"
                    />
                  </div>
                  {times.length > 1 && (
                    <button 
                      type="button"
                      onClick={() => handleRemoveTime(idx)}
                      className="p-3 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-xl transition-colors"
                      title="Remove time"
                    >
                      <Trash2 size={24} />
                    </button>
                  )}
                </div>
              ))}
            </div>
            
            <button 
              type="button"
              onClick={handleAddTime}
              className="mt-4 flex items-center justify-center gap-2 w-full border border-dashed border-primary text-primary hover:bg-primary-light/30 dark:hover:bg-primary-dark/30 font-semibold py-3 rounded-xl transition-colors"
            >
              <Plus size={20} /> Add Another Time
            </button>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full mt-8 flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/30 active:scale-[0.98] transition-all"
          >
            <Save size={24} /> {loading ? 'Saving...' : 'Save Medication Entry'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddMedicine;
