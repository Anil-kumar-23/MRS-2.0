import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { ArrowLeft, Save, Plus, Trash2 } from 'lucide-react';

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
    if(newTimes.length === 0) return; // Need at least one time
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
    <div className="max-w-3xl mx-auto bg-surface-light dark:bg-surface-dark p-8 rounded-2xl shadow-xl transition-colors">
      <div className="flex items-center gap-4 mb-8 pb-4 border-b dark:border-slate-700">
        <button 
          onClick={() => navigate(-1)}
          className="p-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 rounded-full transition"
        >
          <ArrowLeft size={32} />
        </button>
        <h1 className="text-4xl font-bold text-primary">Add New Medicine</h1>
      </div>

      {error && <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-6 text-xl">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-8">
        <div>
          <label className="block text-2xl font-bold mb-3">Medicine Name</label>
          <input 
            type="text" 
            required
            className="w-full text-2xl px-5 py-4 border-2 border-slate-300 dark:border-slate-600 rounded-xl focus:ring-4 focus:ring-primary/50 focus:border-primary focus:outline-none dark:bg-slate-700 transition"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Paracetamol"
          />
        </div>

        <div>
          <label className="block text-2xl font-bold mb-3">Dosage Instruction</label>
          <input 
            type="text" 
            required
            className="w-full text-2xl px-5 py-4 border-2 border-slate-300 dark:border-slate-600 rounded-xl focus:ring-4 focus:ring-primary/50 focus:border-primary focus:outline-none dark:bg-slate-700 transition"
            value={dosage}
            onChange={(e) => setDosage(e.target.value)}
            placeholder="e.g. 1 Pill, 2 Tablets, etc."
          />
        </div>

        <div>
          <label className="block text-2xl font-bold mb-3">How often?</label>
          <select 
            value={frequency}
            onChange={(e) => setFrequency(e.target.value)}
            className="w-full text-2xl px-5 py-4 border-2 border-slate-300 dark:border-slate-600 rounded-xl focus:ring-4 focus:ring-primary/50 focus:border-primary focus:outline-none dark:bg-slate-700 transition"
          >
            <option value="Daily">Everyday (Daily)</option>
            <option value="Weekly">Once a Week (Weekly)</option>
            <option value="As Needed">When required (As Needed)</option>
          </select>
        </div>

        <div>
          <label className="block text-2xl font-bold mb-3">Reminder Times</label>
          <div className="space-y-4">
            {times.map((time, idx) => (
              <div key={idx} className="flex gap-4 items-center">
                <input 
                  type="time" 
                  required
                  value={time}
                  onChange={(e) => handleTimeChange(idx, e.target.value)}
                  className="flex-grow text-3xl font-bold px-5 py-4 border-2 border-slate-300 dark:border-slate-600 rounded-xl focus:ring-4 focus:ring-primary/50 focus:border-primary focus:outline-none dark:bg-slate-700"
                />
                {times.length > 1 && (
                  <button 
                    type="button"
                    onClick={() => handleRemoveTime(idx)}
                    className="bg-red-100 hover:bg-red-200 text-red-600 dark:bg-red-900/30 dark:hover:bg-red-900/50 p-4 rounded-xl transition"
                    title="Remove this time"
                  >
                    <Trash2 size={32} />
                  </button>
                )}
              </div>
            ))}
          </div>
          <button 
            type="button"
            onClick={handleAddTime}
            className="mt-4 flex items-center justify-center gap-2 w-full border-4 border-dashed border-primary hover:bg-primary/10 text-primary text-2xl font-bold py-4 rounded-xl transition"
          >
            <Plus size={32} /> Add Another Time
          </button>
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 bg-primary hover:bg-primary-dark text-white text-3xl font-extrabold py-6 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] active:scale-95 transition-transform"
        >
          <Save size={36} /> {loading ? 'Saving...' : 'Save Medicine'}
        </button>
      </form>
    </div>
  );
};

export default AddMedicine;
