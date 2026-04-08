import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { PlusCircle, List, Bell, Clock, Activity } from 'lucide-react';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [lastAlertTime, setLastAlertTime] = useState(null);
  const [alarmState, setAlarmState] = useState({ active: false, sound: null, names: '' });

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const todaysMedicines = medicines;

  useEffect(() => {
    if (todaysMedicines.length > 0) {
      const hours = String(currentTime.getHours()).padStart(2, '0');
      const minutes = String(currentTime.getMinutes()).padStart(2, '0');
      const timeStr = `${hours}:${minutes}`;

      if (lastAlertTime === timeStr) return;

      const medicinesToTake = todaysMedicines.filter(med => med.times.includes(timeStr));
      if (medicinesToTake.length > 0) {
        setLastAlertTime(timeStr);
        
        const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/995/995-preview.mp3');
        audio.loop = true; 
        audio.play().catch(console.error);

        const names = medicinesToTake.map(m => m.name).join(', ');
        setAlarmState({ active: true, sound: audio, names, timeStr, ids: medicinesToTake.map(m => m._id) });
      }
    }
  }, [currentTime, todaysMedicines, lastAlertTime]);

  const dismissAlarm = async () => {
    if (alarmState.sound) {
      alarmState.sound.pause();
      alarmState.sound.currentTime = 0;
    }
    
    if (alarmState.ids) {
      for (const id of alarmState.ids) {
        try {
          await api.post(`/medicines/${id}/take`);
        } catch (err) {
          console.error('Failed to mark as taken:', err);
        }
      }
    }
    
    setAlarmState({ active: false, sound: null, names: '' });
  };

  useEffect(() => {
    const fetchMedicines = async () => {
      try {
        const { data } = await api.get('/medicines');
        setMedicines(data);
      } catch (error) {
        console.error('Error fetching medicines:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchMedicines();
  }, []);

  return (
    <div className="space-y-8 max-w-6xl mx-auto py-8">
      {/* Header Section */}
      <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700 flex flex-col sm:flex-row justify-between items-center transition-all bg-gradient-to-r from-white to-primary-light/30 dark:from-slate-800 dark:to-primary-dark/20">
        <div className="mb-6 sm:mb-0">
          <h1 className="text-3xl font-bold text-slate-800 dark:text-white mb-2">Welcome back, {user?.name}!</h1>
          <p className="text-slate-500 dark:text-slate-400">Here's your health overview for today.</p>
        </div>
        <div className="flex items-center gap-4 bg-white dark:bg-slate-900 px-6 py-4 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
          <div className="w-12 h-12 bg-primary-light text-primary dark:bg-primary-dark/30 dark:text-primary-light rounded-xl flex items-center justify-center">
            <Clock size={28} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Current Time</p>
            <p className="text-2xl font-bold text-slate-800 dark:text-white">{currentTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <Link to="/add-medicine" className="group bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700 hover:shadow-md transition-all flex items-center gap-6">
          <div className="w-16 h-16 bg-primary-light text-primary dark:bg-primary-dark/30 dark:text-primary-light rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
            <PlusCircle size={32} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-800 dark:text-white">Add Medication</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Set up a new reminder</p>
          </div>
        </Link>
        <Link to="/medicines" className="group bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700 hover:shadow-md transition-all flex items-center gap-6">
          <div className="w-16 h-16 bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
            <List size={32} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-800 dark:text-white">Medicines List</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">View all your prescriptions</p>
          </div>
        </Link>
      </div>

      {/* Reminders List */}
      <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-rose-100 text-rose-500 dark:bg-rose-900/30 dark:text-rose-400 rounded-xl flex items-center justify-center">
            <Activity size={24} />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Today's Schedule</h2>
        </div>
        
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : todaysMedicines.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 px-4 text-center bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700">
            <Bell size={48} className="text-slate-300 dark:text-slate-600 mb-4" />
            <p className="text-lg font-medium text-slate-600 dark:text-slate-300">You have no medicines scheduled for today.</p>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-2">Take a moment to relax, or add a new schedule if needed.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {todaysMedicines.map(med => (
              <div key={med._id} className="relative overflow-hidden bg-slate-50 dark:bg-slate-800/50 p-6 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-6 hover:bg-white dark:hover:bg-slate-800 hover:shadow-md transition-all border border-transparent hover:border-slate-200 dark:hover:border-slate-700">
                <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-primary rounded-l-2xl"></div>
                <div>
                  <h3 className="text-xl font-bold text-slate-800 dark:text-white capitalize">{med.name}</h3>
                  <div className="flex items-center gap-4 mt-2">
                    <span className="text-sm font-medium text-slate-600 dark:text-slate-400 bg-slate-200 dark:bg-slate-700 px-3 py-1 rounded-full">
                      Dosage: {med.dosage}
                    </span>
                    <span className="text-sm font-medium text-slate-500 dark:text-slate-500">
                      {med.frequency}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2 flex-wrap max-w-sm justify-start md:justify-end">
                  {med.times.map((time, idx) => (
                    <span key={idx} className="bg-primary/10 dark:bg-primary/20 text-primary-dark dark:text-primary-light font-semibold px-4 py-2 rounded-xl border border-primary/20">
                       {time}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Alarm Modal Overlay */}
      {alarmState.active && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm px-4">
          <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-2xl max-w-md w-full text-center border border-slate-100 dark:border-slate-700 animate-in zoom-in-95">
            <div className="w-24 h-24 bg-rose-100 text-rose-500 dark:bg-rose-900/30 rounded-full flex items-center justify-center mx-auto mb-6 relative">
              <div className="absolute inset-0 rounded-full border-4 border-rose-500 animate-ping opacity-20"></div>
              <Bell size={48} className="animate-bounce" />
            </div>
            <h2 className="text-3xl font-bold text-slate-800 dark:text-white mb-2">Time To Take Medicine</h2>
            <p className="text-xl text-primary font-bold mb-6">{alarmState.timeStr}</p>
            <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-xl mb-8 border border-slate-100 dark:border-slate-800">
               <p className="text-lg font-semibold text-slate-700 dark:text-slate-200">{alarmState.names}</p>
            </div>
            <button 
              onClick={dismissAlarm}
              className="w-full bg-primary hover:bg-primary-dark text-white text-lg font-bold py-4 rounded-xl shadow-lg shadow-primary/30 transition-all hover:scale-[1.02] active:scale-95"
            >
              Mark as Taken
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
