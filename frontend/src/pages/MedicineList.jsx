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
    <div className="space-y-8 max-w-5xl mx-auto py-8">
      <div className="flex items-center gap-4 mb-4">
        <button 
          onClick={() => navigate(-1)}
          className="p-2.5 bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-full transition text-slate-600 dark:text-slate-300"
        >
          <ArrowLeft size={24} />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-slate-800 dark:text-white">All Prescriptions</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Manage all your medications and schedules</p>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : medicines.length === 0 ? (
        <div className="bg-white dark:bg-slate-800 p-12 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700 text-center flex flex-col items-center">
          <div className="w-24 h-24 bg-slate-50 dark:bg-slate-900 rounded-full flex items-center justify-center mb-6">
            <Pill size={48} className="text-slate-300 dark:text-slate-600" />
          </div>
          <p className="text-xl text-slate-700 dark:text-slate-300 mb-6 font-medium">You haven't added any medicines yet.</p>
          <Link to="/add-medicine" className="inline-flex items-center gap-2 bg-primary text-white font-semibold py-3 px-6 rounded-xl shadow-sm hover:bg-primary-dark transition-colors">
            <PlusCircle size={20} /> Add Your First Medicine
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {medicines.map((med) => (
            <div key={med._id} className="bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden transition-all hover:shadow-md hover:border-primary/30 group">
              <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 text-primary dark:bg-primary/20 rounded-xl flex items-center justify-center">
                    <Pill size={20} />
                  </div>
                  <h2 className="text-xl font-bold text-slate-800 dark:text-white capitalize truncate">{med.name}</h2>
                </div>
                <button 
                  onClick={() => handleDelete(med._id)}
                  className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:text-rose-400 dark:hover:bg-rose-900/20 rounded-lg transition-colors outline-none"
                  title="Remove Medicine"
                >
                  <Trash2 size={20} />
                </button>
              </div>
              <div className="p-6 space-y-5">
                <div className="flex bg-slate-50 dark:bg-slate-900/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-700">
                  <div className="w-1/2">
                    <p className="text-xs text-slate-500 font-semibold mb-1 uppercase tracking-wider">Dosage</p>
                    <p className="text-lg font-bold text-slate-800 dark:text-slate-200">{med.dosage}</p>
                  </div>
                  <div className="w-1/2 border-l border-slate-200 dark:border-slate-700 pl-4">
                    <p className="text-xs text-slate-500 font-semibold mb-1 uppercase tracking-wider">Schedule</p>
                    <p className="text-lg font-bold text-slate-800 dark:text-slate-200">{med.frequency}</p>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm font-semibold text-slate-600 dark:text-slate-400 mb-3">Reminder Times:</p>
                  <div className="flex flex-wrap gap-2">
                    {med.times.map((time, idx) => (
                      <span key={idx} className="bg-primary/10 text-primary-dark dark:bg-primary-dark/20 dark:text-primary-light text-sm font-semibold px-3 py-1.5 rounded-lg border border-primary/20">
                        {time}
                      </span>
                    ))}
                  </div>
                </div>

                {med.missedDoses > 0 && (
                  <div className="mt-4 bg-amber-50 dark:bg-amber-900/20 border-l-4 border-amber-500 p-3 flex gap-3 rounded-r-xl items-center">
                    <AlertTriangle className="text-amber-500 flex-shrink-0" size={20} />
                    <p className="text-sm font-semibold text-amber-800 dark:text-amber-300">
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
