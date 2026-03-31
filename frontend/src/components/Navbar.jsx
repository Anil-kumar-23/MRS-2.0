import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Moon, Sun, Pill, LogOut, Info } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    // Check local storage or system preference
    if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    } else {
      setDarkMode(false);
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    if (darkMode) {
      document.documentElement.classList.remove('dark');
      localStorage.theme = 'light';
      setDarkMode(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.theme = 'dark';
      setDarkMode(true);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-primary text-white shadow-lg p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold flex items-center gap-2">
          <Pill size={32} />
          <span className="hidden sm:inline">MediCare Reminder</span>
          <span className="sm:hidden">MediCare</span>
        </Link>
        
        <div className="flex items-center gap-4">
          <button 
            onClick={toggleDarkMode} 
            className="p-2 rounded-full hover:bg-primary-dark transition-colors"
            aria-label="Toggle Dark Mode"
          >
            {darkMode ? <Sun size={28} /> : <Moon size={28} />}
          </button>
          
          {user ? (
            <>
              <button 
                className="bg-red-500 hover:bg-red-600 px-6 py-2 rounded-lg font-bold flex items-center gap-2 shadow-md transition-all active:scale-95 text-lg"
                onClick={() => alert(`Dialing Emergency Contact for ${user.name}...`)}
              >
                <Info size={24} /> <span className="hidden sm:inline">Emergency</span>
              </button>
              <button 
                onClick={handleLogout}
                className="flex items-center gap-2 hover:bg-primary-dark px-4 py-2 rounded-lg transition-colors text-lg"
              >
                <LogOut size={24} /> <span className="hidden sm:inline">Logout</span>
              </button>
            </>
          ) : (
            <div className="space-x-4">
              <Link to="/login" className="hover:underline text-lg">Login</Link>
              <Link to="/register" className="bg-white text-primary px-4 py-2 rounded-lg font-bold shadow-sm hover:bg-gray-100 text-lg">Register</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
