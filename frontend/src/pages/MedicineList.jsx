import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { Trash2, ArrowLeft, Pill, AlertTriangle } from 'lucide-react';

const MedicineList = () => {
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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

  useEffect(() => {
    fetchMedicines();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to completely remove this medicine?')) {
      try {
        await api.delete(`/medicines/${id}`);
        setMedicines(medicines.filter((m) => m._id !== id));
      } catch (error) {
        alert('Failed to delete medicine');
      }
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4 mb-4">
        <button 
          onClick={() => navigate(-1)}
          className="p-3 bg-surface-light dark:bg-surface-dark shadow-md hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full transition"
        >
          <ArrowLeft size={32} />
        </button>
        <h1 className="text-4xl font-extrabold text-primary">All Prescriptions</h1>
      </div>

      {loading ? (
        <p className="text-2xl text-center">Loading your medicines...</p>
      ) : medicines.length === 0 ? (
        <div className="bg-surface-light dark:bg-surface-dark p-12 rounded-2xl shadow-lg text-center">
          <Pill size={80} className="mx-auto text-slate-300 dark:text-slate-600 mb-6" />
          <p className="text-3xl text-slate-500 mb-8 font-medium">You haven't added any medicines yet.</p>
          <Link to="/add-medicine" className="inline-block bg-primary text-white text-2xl font-bold py-4 px-8 rounded-xl shadow-lg hover:bg-primary-dark transition">
            Add Your First Medicine
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {medicines.map((med) => (
            <div key={med._id} className="bg-surface-light dark:bg-surface-dark rounded-2xl shadow-xl overflow-hidden transition-colors border-2 border-transparent hover:border-primary">
              <div className="bg-primary/10 px-6 py-4 border-b flex justify-between items-center group">
                <h2 className="text-3xl font-extrabold text-slate-800 dark:text-white capitalize truncate pr-4">{med.name}</h2>
                <button 
                  onClick={() => handleDelete(med._id)}
                  className="bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 p-3 rounded-full hover:bg-red-500 hover:text-white dark:hover:bg-red-600 transition outline-none"
                  title="Remove Medicine"
                >
                  <Trash2 size={28} />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-700">
                  <div className="w-1/2">
                    <p className="text-lg text-slate-500 font-semibold mb-1 uppercase tracking-wider">Dosage</p>
                    <p className="text-2xl font-bold">{med.dosage}</p>
                  </div>
                  <div className="w-1/2 border-l border-slate-200 dark:border-slate-700 pl-4">
                    <p className="text-lg text-slate-500 font-semibold mb-1 uppercase tracking-wider">Schedule</p>
                    <p className="text-2xl font-bold">{med.frequency}</p>
                  </div>
                </div>
                
                <div>
                  <p className="text-xl text-slate-500 font-semibold mb-3">Reminder Times:</p>
                  <div className="flex flex-wrap gap-3">
                    {med.times.map((time, idx) => (
                      <span key={idx} className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-200 text-2xl font-bold px-4 py-2 rounded-xl shadow-sm border border-emerald-200 dark:border-emerald-800/50">
                        {time}
                      </span>
                    ))}
                  </div>
                </div>

                {med.missedDoses > 0 && (
                  <div className="mt-6 bg-amber-100 dark:bg-amber-900/30 border-l-4 border-amber-500 p-4 flex gap-3 rounded-r-lg items-center">
                    <AlertTriangle className="text-amber-500" size={32} />
                    <p className="text-xl font-bold text-amber-800 dark:text-amber-200">
                      Missed Doses: {med.missedDoses}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MedicineList;
