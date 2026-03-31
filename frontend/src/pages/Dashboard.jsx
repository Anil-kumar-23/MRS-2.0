import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { PlusCircle, List, Bell, Clock } from 'lucide-react';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());

  const [lastAlertTime, setLastAlertTime] = useState(null);
  const [alarmState, setAlarmState] = useState({ active: false, sound: null, names: '' });

  useEffect(() => {
    // Clock for current time
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Filter medicines that are scheduled for today
  // For this version, we show all medicines but in a real app we would check frequency
  const todaysMedicines = medicines;

  // Sound & Custom Modal Notification System
  useEffect(() => {
    if (currentTime.getSeconds() === 0 && todaysMedicines.length > 0) {
      // Get current hours and minutes for robust "HH:MM" comparison
      const hours = String(currentTime.getHours()).padStart(2, '0');
      const minutes = String(currentTime.getMinutes()).padStart(2, '0');
      const timeStr = `${hours}:${minutes}`;

      // Prevent triggering multiple times in the same minute
      if (lastAlertTime === timeStr) return;

      const medicinesToTake = todaysMedicines.filter(med => med.times.includes(timeStr));
      if (medicinesToTake.length > 0) {
        setLastAlertTime(timeStr); // Mark this minute as alerted
        
        // Use a highly reliable MP3 from an open free CDN
        const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/995/995-preview.mp3');
        audio.loop = true; 
        
        // Play the sound
        audio.play().catch(console.error);

        // Show our custom React modal
        const names = medicinesToTake.map(m => m.name).join(', ');
        setAlarmState({ active: true, sound: audio, names, timeStr, ids: medicinesToTake.map(m => m._id) });
      }
    }
  }, [currentTime, todaysMedicines, lastAlertTime]);

  // Handler to smoothly dismiss the alarm
  const dismissAlarm = async () => {
    if (alarmState.sound) {
      alarmState.sound.pause();
      alarmState.sound.currentTime = 0;
    }
    
    // Also mark these as taken in the backend
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

  // Filter medicines that are scheduled for today (simplified to just displaying all with times for the demo)
  // In a complex app, you'd check day of week vs frequency

  return (
    <div className="space-y-8">
      <div className="bg-surface-light dark:bg-surface-dark p-8 rounded-2xl shadow-lg flex flex-col sm:flex-row justify-between items-center transition-colors">
        <div>
          <h1 className="text-4xl font-bold mb-2">Welcome, {user?.name}!</h1>
          <p className="text-2xl text-slate-500 dark:text-slate-400">Here is your daily overview.</p>
        </div>
        <div className="bg-primary/10 text-primary p-6 rounded-xl mt-6 sm:mt-0 shadow-inner text-center">
          <Clock size={40} className="mx-auto mb-2" />
          <p className="text-3xl font-extrabold">{currentTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link to="/add-medicine" className="bg-green-500 hover:bg-green-600 text-white p-8 rounded-2xl shadow-lg transform transition active:scale-95 flex flex-col items-center justify-center gap-4 group">
          <PlusCircle size={64} className="group-hover:scale-110 transition-transform" />
          <span className="text-3xl font-bold">Add New Medicine</span>
        </Link>
        <Link to="/medicines" className="bg-blue-500 hover:bg-blue-600 text-white p-8 rounded-2xl shadow-lg transform transition active:scale-95 flex flex-col items-center justify-center gap-4 group">
          <List size={64} className="group-hover:scale-110 transition-transform" />
          <span className="text-3xl font-bold">View All Medicines</span>
        </Link>
      </div>

      <div className="bg-surface-light dark:bg-surface-dark p-8 rounded-2xl shadow-lg transition-colors">
        <h2 className="text-4xl font-bold mb-6 flex items-center gap-3 text-primary border-b pb-4">
          <Bell size={36} /> Today's Reminders
        </h2>
        
        {loading ? (
          <p className="text-2xl text-center py-8">Loading your schedule...</p>
        ) : todaysMedicines.length === 0 ? (
          <div className="bg-blue-50 dark:bg-slate-800 p-8 rounded-xl text-center border-2 border-dashed border-blue-200 dark:border-slate-600">
            <p className="text-2xl text-slate-600 dark:text-slate-300">You have no medicines scheduled for today.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {todaysMedicines.map(med => (
              <div key={med._id} className="border-l-8 border-primary bg-slate-50 dark:bg-slate-800 p-6 rounded-r-xl shadow-md flex justify-between items-center hover:bg-slate-100 dark:hover:bg-slate-700 transition">
                <div>
                  <h3 className="text-3xl font-bold text-slate-800 dark:text-white capitalize">{med.name}</h3>
                  <p className="text-2xl text-slate-600 dark:text-slate-300 mt-2">Take: <span className="font-semibold text-primary">{med.dosage}</span> • {med.frequency}</p>
                </div>
                <div className="flex gap-2 flex-wrap max-w-xs justify-end">
                  {med.times.map((time, idx) => (
                     <span key={idx} className="bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 text-2xl font-bold px-4 py-2 rounded-lg shadow-sm">
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-2xl max-w-lg w-full text-center border-4 border-primary">
            <Bell size={80} className="mx-auto text-red-500 animate-bounce mb-6" />
            <h2 className="text-5xl font-extrabold text-slate-800 dark:text-white mb-2">TIME TO TAKE MEDICINE</h2>
            <p className="text-3xl text-primary font-bold mb-6">{alarmState.timeStr}</p>
            <div className="bg-slate-100 dark:bg-slate-700 p-6 rounded-2xl mb-8">
               <p className="text-3xl font-bold dark:text-slate-200">{alarmState.names}</p>
            </div>
            <button 
              onClick={dismissAlarm}
              className="w-full bg-green-500 hover:bg-green-600 text-white text-3xl font-bold py-6 rounded-2xl shadow-xl transition-transform active:scale-95"
            >
              I TOOK IT
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default Dashboard;
