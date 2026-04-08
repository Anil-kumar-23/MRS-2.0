import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Moon, Sun, Pill, LogOut, Info, Menu, X } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [darkMode, setDarkMode] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
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

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  if (user) {
    navLinks.splice(1, 0, { name: 'Dashboard', path: '/dashboard' });
    navLinks.splice(2, 0, { name: 'Add Reminder', path: '/add-medicine' });
  }

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors duration-300">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* Brand */}
        <Link to="/" className="text-2xl font-bold flex items-center gap-2 text-primary">
          <div className="bg-primary-light text-primary dark:bg-primary-dark/30 dark:text-primary-light p-1.5 rounded-lg">
            <Pill size={28} />
          </div>
          <span className="hidden sm:inline text-slate-800 dark:text-white">MediCare</span>
        </Link>
        
        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              to={link.path}
              className={`font-medium transition-colors hover:text-primary ${isActive(link.path) ? 'text-primary' : 'text-slate-600 dark:text-slate-300'}`}
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button 
            onClick={toggleDarkMode} 
            className="p-2 text-slate-500 hover:text-primary hover:bg-primary-light/50 dark:hover:bg-primary-dark/30 rounded-full transition-colors"
            aria-label="Toggle Dark Mode"
          >
            {darkMode ? <Sun size={24} /> : <Moon size={24} />}
          </button>
          
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                <button 
                  onClick={handleLogout}
                  className="flex items-center gap-2 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 px-4 py-2 rounded-xl transition-colors font-medium border border-transparent"
                >
                  <LogOut size={20} /> <span>Logout</span>
                </button>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="px-4 py-2 text-slate-600 dark:text-slate-300 font-medium hover:text-primary transition-colors">Login</Link>
                <Link to="/register" className="bg-primary hover:bg-primary-dark text-white px-5 py-2.5 rounded-xl font-semibold shadow-sm transition-all hover:shadow-md hover:scale-105 active:scale-95">Register</Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2 text-slate-600 dark:text-slate-300"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 absolute w-full left-0 shadow-lg">
          <div className="container mx-auto px-4 py-4 flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`font-medium p-3 rounded-xl transition-colors ${isActive(link.path) ? 'bg-primary-light/50 dark:bg-primary-dark/20 text-primary' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
              >
                {link.name}
              </Link>
            ))}
            
            <div className="border-t border-slate-100 dark:border-slate-800 pt-4 mt-2 flex flex-col gap-3">
              {user ? (
                <button 
                  onClick={() => { handleLogout(); setMobileMenuOpen(false); }}
                  className="w-full flex items-center justify-center gap-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-4 py-3 rounded-xl font-medium"
                >
                  <LogOut size={20} /> <span>Logout</span>
                </button>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="flex items-center justify-center w-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-4 py-3 rounded-xl font-medium">Login</Link>
                  <Link to="/register" onClick={() => setMobileMenuOpen(false)} className="flex items-center justify-center w-full bg-primary text-white px-4 py-3 rounded-xl font-semibold shadow-sm">Register</Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
